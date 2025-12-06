'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../../auth";

// authenticate function restored
import { signIn, signOut } from '../../auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: any,
    formData: FormData,
) {
    try {
        const identifier = formData.get('identifier') as string;
        const password = formData.get('password') as string;

        // 1. Determine redirect URL based on user role (Lookup user first)
        // We do this BEFORE signIn to avoid "redirect: false" complexity with cookies
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier },
                ]
            },
            select: { role: true }
        });

        console.log("LOGIN DEBUG: User found:", user);

        let redirectUrl = '/dashboard'; // Default
        if (user?.role === 'ADMIN') {
            redirectUrl = '/admin';
        }

        console.log("LOGIN DEBUG: Redirecting to:", redirectUrl);

        // 2. Sign In with redirect
        // This will throw a NEXT_REDIRECT error on success, which is normal.
        await signIn('credentials', {
            identifier,
            password,
            redirectTo: redirectUrl,
        });

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials.' };
                default:
                    return { error: 'Something went wrong.' };
            }
        }
        // IMPORTANT: We must re-throw the redirect error so Next.js handles the navigation
        throw error;
    }
}

export async function createTicket(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;

    if (!subject || !description || !category) {
        return { error: "Missing required fields" };
    }

    try {
        await prisma.ticket.create({
            data: {
                subject,
                description,
                category: category as any,
                userId: session.user.id,
                status: "PENDING"
            }
        });
        revalidatePath("/dashboard");
        revalidatePath("/admin/tickets");
        return { success: true };
    } catch (e) {
        // This might fail if "guest-user-id" doesn't exist in User table (foreign key constraint).
        // But for "remove auth", we assume we just want to bypass the check. 
        // If it fails on DB level, that's a data issue, but the auth layer is removed.
        // We can try to catch it and return success for now or log error.
        console.error("Create Ticket Error (likely FK constraint):", e);
        return { error: "Failed to create ticket (Guest check)" };
    }
}



export async function submitContact(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
        return { error: "Please fill in all required fields." };
    }

    try {
        await prisma.contactSubmission.create({
            data: {
                name,
                email,
                phone: phone || null,
                message
            }
        });
        return { success: true };
    } catch (e) {
        console.error("Contact Form Error:", e);
        return { error: "Failed to send message. Please try again." };
    }
}

export async function handleSignOut() {
    await signOut({ redirectTo: '/' });
}
