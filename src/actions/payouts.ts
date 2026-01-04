
'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function approvePayoutAction(formData: FormData) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const landlordId = formData.get("landlordId") as string;
    const propertyId = formData.get("propertyId") as string;
    const propertyTitle = formData.get("propertyTitle") as string || "Property";

    // Robust numeric parsing with fallbacks
    const amount = Number(formData.get("amount")) || 0;
    const totalCollected = Number(formData.get("totalCollected")) || 0;
    const commission = Number(formData.get("commission")) || 0;
    const managementFee = Number(formData.get("managementFee")) || 0;
    const totalExpenses = Number(formData.get("totalExpenses")) || 0;

    const description = `${propertyTitle} - Rent Payout`;

    try {
        // Find last payout for THIS PROPERTY to determine periodStart
        const lastPayout = await (prisma.payout as any).findFirst({
            where: { landlordId, propertyId },
            orderBy: { periodEnd: 'desc' }
        });

        const periodStart = lastPayout ? lastPayout.periodEnd : new Date(0);
        const periodEnd = new Date(); // Right now

        // Create the Payout record
        const payout = await (prisma.payout as any).create({
            data: {
                reference: `PO-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
                landlordId,
                propertyId,
                amount,
                description,
                periodStart,
                periodEnd,
                status: 'PROCESSED',
                expenseSnapshot: {
                    totalCollected,
                    commission,
                    managementFee,
                    totalExpenses
                }
            }
        });

        // Link existing approved expenses for THIS PROPERTY to this payout
        await prisma.landlordExpense.updateMany({
            where: {
                landlordId,
                propertyId,
                status: 'APPROVED',
                payoutId: null,
                createdAt: {
                    gt: periodStart,
                    lte: periodEnd
                }
            },
            data: {
                payoutId: payout.id,
                status: 'DEDUCTED'
            }
        });

        revalidatePath("/admin/payouts");
        revalidatePath("/admin/financials");
        return { success: true };
    } catch (error) {
        console.error("Payout Approval Error:", error);
        return { error: "Failed to process payout" };
    }
}
