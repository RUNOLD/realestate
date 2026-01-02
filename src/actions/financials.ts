'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { differenceInMonths, differenceInYears, addMonths, addYears } from "date-fns";

export async function calculatePayout(landlordId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    // 1. Get Total Active Rent (Monthly)
    // Find all active leases for this landlord's properties
    const properties = await prisma.property.findMany({
        where: { ownerId: landlordId },
        include: { leases: { where: { isActive: true } } }
    });

    let totalRent = 0;
    properties.forEach(prop => {
        prop.leases.forEach(lease => {
            totalRent += lease.rentAmount; // Assuming rentAmount is per month or cycle
        });
    });

    // 2. Get Approved Expenses (Not yet deducted)
    const expenses = await prisma.landlordExpense.findMany({
        where: {
            landlordId,
            status: 'APPROVED',
            payoutId: null // Not yet processed
        }
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
        rent: totalRent,
        expenses: totalExpenses,
        netPayout: totalRent - totalExpenses,
        expenseCount: expenses.length
    };
}

export async function generatePayout(rentCycleId: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        const rentCycle = await prisma.rentCycle.findUnique({
            where: { id: rentCycleId },
            include: { landlord: true }
        });

        if (!rentCycle) return { error: "Rent Cycle not found" };
        if (rentCycle.status !== 'OPEN') return { error: "Rent Cycle is already closed" };

        const landlordId = rentCycle.landlordId;

        // 1. Calculate Rent for this Cycle
        // Logic: Sum of rent for active leases *during* this period? 
        // simplified: Sum of leases active now. Ideally we track 'RentPayments' linked to cycle.
        // For MVP: We assume leases active = revenue. (Real world needs payment reconciliation).

        const properties = await prisma.property.findMany({
            where: { ownerId: landlordId },
            include: { leases: { where: { isActive: true } } }
        });

        let totalRent = 0;
        properties.forEach(prop => {
            prop.leases.forEach(lease => {
                totalRent += lease.rentAmount;
            });
        });

        // 2. Get Expenses Linked to this Cycle (via Tickets) OR manually created in this timeframe
        // Update: Expenses are linked to Tickets, Tickets are linked to RentCycle.
        // Also Expenses created directly (Deficits) need linking.

        const expenses = await prisma.landlordExpense.findMany({
            where: {
                landlordId,
                status: 'APPROVED',
                payoutId: null,
                OR: [
                    {
                        ticket: {
                            rentCycleId,
                            payerType: 'LANDLORD' // STRICT CHECK
                        }
                    },
                    {
                        date: { gte: rentCycle.startDate, lte: rentCycle.endDate },
                        ticketId: null // Manual expenses or Deficits (no ticket linked)
                    }
                ]
            }
        });

        const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
        const netPayout = totalRent - totalExpenses;

        const reference = `PO-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${Math.floor(Math.random() * 10000)}`;

        // 3. Create Payout Record
        const payout = await prisma.payout.create({
            data: {
                reference,
                landlordId,
                rentCycleId, // Link to cycle
                amount: netPayout,
                periodStart: rentCycle.startDate,
                periodEnd: rentCycle.endDate,
                status: 'PENDING',
                expenseSnapshot: expenses as any
            }
        });

        // 4. Mark Expenses Deducted
        if (expenses.length > 0) {
            await prisma.landlordExpense.updateMany({
                where: { id: { in: expenses.map(e => e.id) } },
                data: { status: 'DEDUCTED', payoutId: payout.id }
            });
        }

        // 5. Deficit Handling (Carry Forward)
        if (netPayout < 0) {
            const deficitAmount = Math.abs(netPayout);

            // Create "Next" Cycle if not exists? Or just create an Expense dated Today?
            // "Carry negative balances to the *next month*"
            // We create an APPROVED expense. When the next cycle picks up expenses, it will pick this up.

            const firstProperty = properties[0]; // Needed for FK
            if (firstProperty) {
                await prisma.landlordExpense.create({
                    data: {
                        amount: deficitAmount,
                        description: `DEFICIT CARRIED FORWARD (${reference})`,
                        landlordId,
                        propertyId: firstProperty.id,
                        status: 'APPROVED',
                        date: new Date() // Will be picked up by next cycle logic
                    }
                });
            }
        }

        // 6. Close the Rent Cycle
        await prisma.rentCycle.update({
            where: { id: rentCycleId },
            data: { status: 'CLOSED' }
        });

        return { success: true, payout };

    } catch (e) {
        console.error("Generate Payout Error:", e);
        return { error: "Failed to generate payout" };
    }
}

export async function getTenantFinancials(userId: string) {
    const session = await auth();
    if (!session) return { error: "Not authenticated" };

    const lease = await prisma.lease.findFirst({
        where: { userId, isActive: true },
        include: {
            property: {
                include: {
                    owner: true // Landlord
                }
            }
        }
    });

    if (!lease) return { balance: 0, totalDue: 0, totalPaid: 0, status: 'NO_LEASE', nextRentDate: null };

    const today = new Date();
    const startDate = new Date(lease.startDate);

    // Calculate cycles passed based on billing cycle
    let cyclesElapsed = 0;
    let nextRentDate = startDate;

    if (today >= startDate) {
        if (lease.billingCycle === 'MONTHLY') {
            cyclesElapsed = differenceInMonths(today, startDate) + 1;
            nextRentDate = addMonths(startDate, cyclesElapsed);
        } else if (lease.billingCycle === 'QUARTERLY') {
            cyclesElapsed = Math.floor(differenceInMonths(today, startDate) / 3) + 1;
            nextRentDate = addMonths(startDate, cyclesElapsed * 3);
        } else if (lease.billingCycle === 'YEARLY') {
            cyclesElapsed = differenceInYears(today, startDate) + 1;
            nextRentDate = addYears(startDate, cyclesElapsed);
        }
    } else {
        // Lease hasn't started yet
        nextRentDate = startDate;
    }

    const totalRentDue = cyclesElapsed * lease.rentAmount;

    // Service charge calculation: paid with every year's rent
    // Calculate how many years have passed (or started)
    const yearsElapsed = Math.floor(differenceInYears(today, startDate)) + 1;
    const totalServiceChargeDue = (lease.property.serviceCharge || 0) * yearsElapsed;

    // Caution fee is a one-time payment
    const totalCautionDue = lease.property.cautionDeposit || 0;

    const totalDue = totalRentDue + totalServiceChargeDue + totalCautionDue;

    const payments = await prisma.payment.findMany({
        where: { userId, status: 'SUCCESS' }
    });

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = totalDue - totalPaid;

    // Open Tickets count
    const openTickets = await prisma.ticket.count({
        where: { userId, status: { notIn: ['RESOLVED', 'CLOSED'] } }
    });

    const totalTickets = await prisma.ticket.count({ where: { userId } });

    return {
        totalDue,
        totalPaid,
        balance: Math.max(0, balance),
        status: balance > 0 ? 'OVERDUE' : 'ACTIVE',
        nextRentDate,
        openTickets,
        totalTickets,
        lease
    };
}
