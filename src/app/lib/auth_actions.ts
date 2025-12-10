"use server";

import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mail";
import { getResetPasswordTemplate } from "@/app/lib/mail_templates";

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "Email is required" };
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        // We return success even if user not found to prevent enumeration
        return { success: "If an account exists, a reset link has been sent." };
    }

    // Generate token
    const token = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetToken: token,
            resetTokenExpiry: expiry,
        },
    });

    // Send Email (Real or Mock)
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    await sendEmail({
        to: email,
        subject: "Reset Your Password - Ayoola Property",
        html: getResetPasswordTemplate(resetLink)
    });

    return { success: "If an account exists, a reset link has been sent." };
}

export async function resetPassword(prevState: any, formData: FormData) {
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!token || !password || !confirmPassword) {
        return { error: "All fields are required" };
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    // Find user with valid token
    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: {
                gt: new Date(),
            },
        },
    });

    if (!user) {
        return { error: "Invalid or expired reset token" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
        },
    });

    return { success: "Password reset successfully. You can now login." };
}
