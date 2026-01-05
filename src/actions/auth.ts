'use server';

import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/auth";
import { AuthError } from 'next-auth';
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mail";
import { getResetPasswordTemplate } from "@/lib/mail_templates";

export async function authenticate(
    prevState: any,
    formData: FormData,
) {
    let redirectUrl = '/dashboard';

    try {
        const identifier = formData.get('identifier') as string;
        const password = formData.get('password') as string;

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier },
                ]
            },
            select: { role: true }
        });

        if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
            redirectUrl = '/admin';
        } else if ((user?.role as any) === 'LANDLORD') {
            redirectUrl = '/landlord/dashboard';
        }

        await signIn('credentials', {
            identifier,
            password,
            redirect: false,
        });

        return { success: true, redirectUrl };

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials.' };
                default:
                    return { error: 'Something went wrong.' };
            }
        }

        if ((error as Error).message === 'NEXT_REDIRECT' || (error as any).digest?.startsWith('NEXT_REDIRECT')) {
            return { success: true, redirectUrl };
        }

        throw error;
    }
}

export async function handleSignOut() {
    await signOut({ redirectTo: '/' });
}

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "Email is required" };
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return { success: "If an account exists, a reset link has been sent." };
    }

    const token = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetToken: token,
            resetTokenExpiry: expiry,
        },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const resetLink = `${cleanBaseUrl}/reset-password?token=${token}`;

    // console.log(`📡 Attempting to send reset link to ${email}...`);

    const emailResult = await sendEmail({
        to: email,
        subject: "Reset Your Password - Ayoola Property",
        html: getResetPasswordTemplate(resetLink)
    });

    if (!emailResult.success) {
        console.error("❌ Failed to send reset email:", emailResult.error);
        // We still return success to the UI for security (email enumeration prevention)
    } else {
        // console.log(`✅ Reset link sent to ${email}`);
    }

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

    const hashedPassword = await bcrypt.hash(password, 10);

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
