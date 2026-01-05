import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { createActivityLog, ActionType, EntityType } from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) {
            console.error("PAYSTACK_SECRET_KEY is not defined");
            return NextResponse.json({ error: "Configuration error" }, { status: 500 });
        }

        const arrayBuffer = await req.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const signature = req.headers.get("x-paystack-signature");

        if (!signature) {
            return NextResponse.json({ error: "No signature provided" }, { status: 400 });
        }

        const hash = crypto.createHmac("sha512", secret)
            .update(buffer)
            .digest("hex");

        // Convert to JSON for logic processing after verification
        const body = JSON.parse(buffer.toString());

        if (hash !== signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const event = body.event;
        const data = body.data;

        if (event === "charge.success") {
            const reference = data.reference;

            // Find the payment
            const payment = await prisma.payment.findUnique({
                where: { reference },
                include: { user: true } // Include user for logging
            });

            if (!payment) {
                console.error(`Payment with reference ${reference} not found`);
                return NextResponse.json({ message: "Payment not found" }, { status: 200 }); // Return 200 to acknowledge receipt
            }

            if (payment.status === "SUCCESS") {
                return NextResponse.json({ message: "Payment already processed" }, { status: 200 });
            }

            // Update payment status
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: "SUCCESS" }
            });

            // Log activity
            if (payment.userId) {
                await createActivityLog(
                    payment.userId,
                    ActionType.UPDATE,
                    EntityType.PAYMENT,
                    payment.id,
                    {
                        amount: payment.amount,
                        reference: reference,
                        status: "SUCCESS",
                        method: "PAYSTACK_WEBHOOK"
                    }
                );
            }

            // Explicitly update dashboard/lease if needed? 
            // For now, payment success is enough. The dashboard reads from Payment table.
        }

        return NextResponse.json({ status: "success" }, { status: 200 });

    } catch (error) {
        console.error("Paystack Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
