"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function verifyPayment(reference: string, amount: number, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
        // 1. Handle Mock/Dev Mode Verification FIRST
        if (reference.startsWith('mock_')) {
            await prisma.payment.create({
                data: {
                    amount: amount,
                    reference: reference,
                    status: 'SUCCESS',
                    userId: userId,
                    method: 'Paystack (Mock)'
                }
            });
            revalidatePath('/dashboard');
            return { success: true };
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY;

        if (!secretKey) {
            return { success: false, error: "Server misconfiguration: No Secret Key" };
        }

        // Verify with Paystack API
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secretKey}`
            }
        });

        const data = await response.json();

        if (data.status && data.data.status === 'success') {
            // Payment is valid
            // Check if reference already exists to prevent double value
            const existing = await prisma.payment.findUnique({
                where: { reference: reference }
            });

            if (existing) {
                return { success: false, error: "Duplicate transaction reference" };
            }

            // Save to DB
            // Note: Paystack returns amount in Kobo, so data.data.amount / 100 = Naira
            const amountInNaira = data.data.amount / 100;

            await prisma.payment.create({
                data: {
                    amount: amountInNaira,
                    reference: reference,
                    status: 'SUCCESS',
                    userId: userId,
                    method: data.data.channel || 'Paystack'
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
