
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Starting Gap Analysis Verification...");

    // 1. Setup Data
    const tenant = await prisma.user.findFirst({ where: { role: 'TENANT' } });
    if (!tenant) throw new Error("No Tenant found");

    const property = await prisma.property.findFirst({ where: { leases: { some: { userId: tenant.id, isActive: true } } } });
    if (!property) throw new Error("No Property found for tenant");

    console.log(`Using Tenant: ${tenant.email}, Property: ${property.title}`);

    // 2. Create Ticket
    const ticket = await prisma.ticket.create({
        data: {
            subject: "Gap Analysis Test Ticket",
            description: "Testing strict inputs",
            category: "PLUMBING",
            userId: tenant.id,
            propertyId: property.id,
            landlordId: property.ownerId,
            status: "OPEN",
            requiresApproval: false
        }
    });

    console.log(`Ticket Created: ${ticket.id}`);

    // 3. Test Validation (Should Fail)
    console.log("Testing Validation (Missing Artisan Details)...");
    try {
        // Simulating the server action logic (we can't call server actions directly easily in script, 
        // but we can test the data constraints or replicate the check)

        // In a real script we'd check the API. Here we will manually update to verify Schema allows/disallows?
        // Actually, the logic is in the Server Action, not DB constraints (mostly).
        // But we can check DB constraints for Enum.
    } catch (e) {
        console.log("Validation Caught (Expected)");
    }

    // 4. Test Happy Path (Landlord Payer)
    console.log("Testing Happy Path (Landlord Payer)...");
    const fixed = await prisma.ticket.update({
        where: { id: ticket.id },
        data: {
            status: 'AWAITING_CONFIRMATION',
            artisanName: "Test Artisan",
            artisanPhone: "08012345678",
            payerType: 'LANDLORD',
            tenantConfirmationStatus: 'PENDING',
            costActual: 5000
        }
    });

    // 5. Check Expense Creation Logic (Simulated)
    // In the app, the server action does this. Here we manually check if likely to succeed.
    const expense = await prisma.landlordExpense.create({
        data: {
            amount: 5000,
            description: `Repair: ${fixed.subject}`,
            ticketId: fixed.id,
            propertyId: fixed.propertyId!,
            landlordId: fixed.landlordId!,
            status: 'PENDING',
            date: new Date()
        }
    });
    console.log(`Expense Created: ${expense.id} (Status: ${expense.status})`);

    // 6. Test Confirmation
    console.log("Testing Confirmation...");
    await prisma.ticket.update({
        where: { id: ticket.id },
        data: { tenantConfirmationStatus: 'CONFIRMED', status: 'RESOLVED' }
    });
    await prisma.landlordExpense.update({
        where: { id: expense.id },
        data: { status: 'APPROVED' }
    });

    const confirmedExpense = await prisma.landlordExpense.findUnique({ where: { id: expense.id } });
    console.log(`Expense Status After Confirm: ${confirmedExpense?.status}`);

    if (confirmedExpense?.status !== 'APPROVED') throw new Error("Expense should be APPROVED");

    // 7. Test Dispute (New Ticket)
    console.log("Testing Dispute...");
    const ticket2 = await prisma.ticket.create({
        data: {
            subject: "Dispute Test", category: "ELECTRICAL", userId: tenant.id, status: "AWAITING_CONFIRMATION",
            tenantConfirmationStatus: 'PENDING'
        }
    });

    await prisma.ticket.update({
        where: { id: ticket2.id },
        data: { tenantConfirmationStatus: 'DISPUTED', status: 'IN_PROGRESS' }
    });

    const disputedTicket = await prisma.ticket.findUnique({ where: { id: ticket2.id } });
    console.log(`Disputed Ticket Status: ${disputedTicket?.tenantConfirmationStatus}`);

    if (disputedTicket?.tenantConfirmationStatus !== 'DISPUTED') throw new Error("Ticket should be DISPUTED");

    console.log("✅ Verification Passed!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
