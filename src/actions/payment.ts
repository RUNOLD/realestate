'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { CreatePaymentSchema } from "@/lib/schemas";
import { createActivityLog, ActionType, EntityType } from "@/lib/logger";
import { ApprovalStatus } from "@prisma/client";

export async function createPayment(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const rawData = {
        amount: Number(formData.get("amount")),
        reference: formData.get("reference"),
        method: formData.get("method"),
        tenantId: formData.get("tenantId"),
        category: formData.getAll("category"), // Capture all selected categories
    };

    const validatedFields = CreatePaymentSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors, message: "Validation failed" };
    }

    const { amount, reference, method, tenantId, category } = validatedFields.data;

    try {
        const existingPayment = await prisma.payment.findUnique({
            where: { reference }
        });

        if (existingPayment) {
            return { error: "A payment with this reference ID already exists." };
        }

        const userRole = (session.user as any).role;
        const approvalStatus = userRole === 'STAFF' ? ApprovalStatus.PENDING_ADMIN : ApprovalStatus.APPROVED;

        // Auto-resolve Property from Lease
        const activeLease = await prisma.lease.findFirst({
            where: { userId: tenantId, isActive: true },
            select: { propertyId: true }
        });

        const payment = await prisma.payment.create({
            data: {
                amount,
                reference,
                method,
                userId: tenantId,
                propertyId: activeLease?.propertyId, // AUTOMATED RESOLUTION
                status: 'SUCCESS',
                approvalStatus,
                category: Array.isArray(category) ? category.join(", ") : (category || 'RENT'),
            }
        });

        await createActivityLog(
            session.user.id,
            ActionType.CREATE,
            EntityType.PAYMENT,
            payment.id,
            { amount, reference, approvalStatus, propertyId: activeLease?.propertyId }
        );

        revalidatePath(`/admin/users/${tenantId}`);
        return { success: true, message: approvalStatus === 'PENDING_ADMIN' ? "Payment recorded and pending approval." : "Payment recorded." };
    } catch (e) {
        console.error("Create Payment Error:", e);
        return { error: "Failed to record payment" };
    }
}

export async function approvePayment(paymentId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        await prisma.payment.update({
            where: { id: paymentId },
            data: { approvalStatus: 'APPROVED' }
        });

        await createActivityLog(
            session.user.id,
            ActionType.APPROVE,
            EntityType.PAYMENT,
            paymentId,
            { details: "Payment Verified" }
        );

        revalidatePath("/admin/approvals");
        return { success: true };
    } catch (e) {
        console.error("Approve Payment Error:", e);
        return { error: "Failed to approve payment" };
    }
}

export async function verifyPayment(reference: string, amount: number, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
        if (reference.startsWith('mock_')) {
            // Auto-resolve Property from Lease
            const activeLease = await prisma.lease.findFirst({
                where: { userId: userId, isActive: true },
                select: { propertyId: true }
            });

            await prisma.payment.create({
                data: {
                    amount: amount,
                    reference: reference,
                    status: 'SUCCESS',
                    userId: userId,
                    propertyId: activeLease?.propertyId, // AUTOMATED RESOLUTION
                    method: 'Paystack (Mock)',
                    approvalStatus: ApprovalStatus.PENDING_ADMIN
                }
            });
            revalidatePath('/dashboard');
            return { success: true };
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY;

        if (!secretKey) {
            return { success: false, error: "Server misconfiguration: No Secret Key" };
        }

        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secretKey}`
            }
        });

        const data = await response.json();

        if (data.status && data.data.status === 'success') {
            const existing = await prisma.payment.findUnique({
                where: { reference: reference }
            });

            if (existing) {
                return { success: false, error: "Duplicate transaction reference" };
            }

            const amountInNaira = data.data.amount / 100;

            // Auto-resolve Property from Lease
            const activeLease = await prisma.lease.findFirst({
                where: { userId: userId, isActive: true },
                select: { propertyId: true }
            });

            await prisma.payment.create({
                data: {
                    amount: amountInNaira,
                    reference: reference,
                    status: 'SUCCESS',
                    userId: userId,
                    propertyId: activeLease?.propertyId, // AUTOMATED RESOLUTION
                    method: data.data.channel || 'Paystack',
                    approvalStatus: ApprovalStatus.PENDING_ADMIN
                }
            });

            revalidatePath('/dashboard');
            return { success: true };
        } else {
            return { success: false, error: "Payment verification failed at provider" };
        }

    } catch (error) {
        console.error("Payment Verification Error:", error);
        return { success: false, error: "Internal Server Error during verification" };
    }
}
