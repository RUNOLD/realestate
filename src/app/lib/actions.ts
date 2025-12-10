'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../../auth";
import path from 'path';
import fs from 'fs/promises';

// authenticate function restored
import { signIn, signOut } from '../../auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: any,
    formData: FormData,
) {
    let redirectUrl = '/dashboard'; // Default (Action Scope)

    try {
        const identifier = formData.get('identifier') as string;
        const password = formData.get('password') as string;

        // 1. Determine redirect URL based on user role (Lookup user first)
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

        // Role-based redirection
        if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
            redirectUrl = '/admin';
        }

        console.log("LOGIN DEBUG: Redirecting to:", redirectUrl);

        // 2. Sign In with redirect: false to handle client-side
        console.log("LOGIN DEBUG: Attempting sign in with redirect: false");
        await signIn('credentials', {
            identifier,
            password,
            redirect: false,
        });

        // If we get here, sign in was successful (otherwise it throws)
        console.log("LOGIN ACTION SUCCESS: User Role:", user?.role, "Redirecting to:", redirectUrl);
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

        // If the error is a NEXT_REDIRECT, we catch it and return success to the client
        // to handle the navigation via router.push
        if ((error as Error).message === 'NEXT_REDIRECT' || (error as any).digest?.startsWith('NEXT_REDIRECT')) {
            return { success: true, redirectUrl };
        }

        // IMPORTANT: We must re-throw other errors
        throw error;
    }
}

import { createActivityLog, ActionType, EntityType } from "@/lib/logger";

// ... existing authenticate function ...

import { CreateTicketSchema, ContactSchema } from "@/lib/schemas";

export async function createTicket(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const rawData = {
        subject: formData.get("subject"),
        description: formData.get("description"),
        category: formData.get("category"),
    };

    const validatedFields = CreateTicketSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors, message: "Validation failed" };
    }

    const { subject, description, category } = validatedFields.data;

    try {
        const ticket = await prisma.ticket.create({
            data: {
                subject,
                description,
                category: category as any,
                userId: session.user.id,
                status: "PENDING",
                approvalStatus: "PENDING_MANAGER",
                requiresApproval: true,
            }
        });

        await createActivityLog(
            session.user.id,
            ActionType.CREATE,
            EntityType.TICKET,
            ticket.id,
            { subject, category }
        );

        revalidatePath("/dashboard");
        revalidatePath("/admin/tickets");
        return { success: true };
    } catch (e) {
        console.error("Create Ticket Error:", e);
        return { error: "Failed to create ticket" };
    }
}


export async function submitContact(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
    };

    const validatedFields = ContactSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors, message: "Validation failed" };
    }

    const { name, email, phone, message } = validatedFields.data;

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

import { CreateAdminTicketSchema } from "@/lib/schemas";

export async function createAdminTicket(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'STAFF')) {
        return { error: "Unauthorized" };
    }

    const rawData = {
        userId: formData.get("userId"),
        subject: formData.get("subject"),
        description: formData.get("description"),
        category: formData.get("category"),
        priority: formData.get("priority"),
        images: formData.get("images"),
    };

    const validatedFields = CreateAdminTicketSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors, message: "Validation failed" };
    }

    const { userId, subject, description, category, priority, images } = validatedFields.data;

    try {
        const ticket = await prisma.ticket.create({
            data: {
                subject,
                description,
                category: category as any,
                priority: priority,
                userId,
                status: "PENDING", // Initial status
                approvalStatus: "APPROVED", // Auto-approve if created by admin
                requiresApproval: false,
                images: images || "[]",
            }
        });

        await createActivityLog(
            session.user.id,
            ActionType.CREATE,
            EntityType.TICKET,
            ticket.id,
            { subject, priority, onBehalfOf: userId }
        );

        revalidatePath("/dashboard");
        revalidatePath("/admin/tickets");
        return { success: true };
    } catch (e) {
        console.error("Create Admin Ticket Error:", e);
        return { error: "Failed to create ticket" };
    }
}

export async function handleSignOut() {
    await signOut({ redirectTo: '/' });
}

// --- Digital Transparency System Actions ---

export async function approveTicket(ticketId: string, role: 'MANAGER' | 'ADMIN') {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
        // ideally check for MANAGER role too if implemented
        return { error: "Unauthorized" };
    }

    try {
        let updateData: any = {};
        let action = ActionType.APPROVE;

        // Simple workflow: Manager -> Admin -> Approved
        if (role === 'MANAGER') {
            updateData = { approvalStatus: 'PENDING_ADMIN' };
        } else if (role === 'ADMIN') {
            updateData = { approvalStatus: 'APPROVED', status: 'IN_PROGRESS' };
        }

        const ticket = await prisma.ticket.update({
            where: { id: ticketId },
            data: updateData
        });

        await createActivityLog(
            session.user.id,
            action,
            EntityType.TICKET,
            ticketId,
            { newStatus: updateData.approvalStatus }
        );

        revalidatePath("/admin/tickets");
        return { success: true };
    } catch (e) {
        console.error("Approve Ticket Error:", e);
        return { error: "Failed to approve ticket" };
    }
}

import { CreateLeaseSchema } from "@/lib/schemas";

export async function createLease(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Unauthorized" };

    const rawData = {
        userId: formData.get("userId"),
        propertyId: formData.get("propertyId"),
        rentAmount: Number(formData.get("rentAmount")),
        startDate: new Date(formData.get("startDate") as string),
        endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : undefined
    };

    const validatedFields = CreateLeaseSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors, message: "Validation failed" };
    }

    const { userId, propertyId, rentAmount, startDate, endDate } = validatedFields.data;

    try {
        const lease = await prisma.lease.create({
            data: {
                userId,
                propertyId,
                rentAmount,
                startDate,
                endDate,
                isActive: true
            }
        });

        // Update Property Status to RENTED
        await prisma.property.update({
            where: { id: propertyId },
            data: { status: 'RENTED' }
        });

        await createActivityLog(
            session.user.id,
            ActionType.CREATE,
            EntityType.LEASE,
            lease.id,
            { userId, propertyId, rentAmount }
        );

        revalidatePath(`/admin/users/${userId}`);
        revalidatePath("/admin/properties");
        return { success: true };
    } catch (e) {
        console.error("Create Lease Error:", e);
        return { error: "Failed to create lease" };
    }
}

import { UpdateRentSchema } from "@/lib/schemas";

export async function updateRent(leaseId: string, newAmount: number, reason: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Unauthorized" };

    const validatedFields = UpdateRentSchema.safeParse({ leaseId, newAmount, reason });

    if (!validatedFields.success) {
        return { error: "Validation failed" };
    }

    try {
        const lease = await prisma.lease.findUnique({ where: { id: leaseId } });
        if (!lease) return { error: "Lease not found" };

        const previousAmount = lease.rentAmount;

        // Atomic transaction: Update Lease + Create Log + Create Activity Log
        await prisma.$transaction(async (tx) => {
            await tx.lease.update({
                where: { id: leaseId },
                data: { rentAmount: newAmount }
            });

            await tx.rentModificationLog.create({
                data: {
                    leaseId,
                    adminId: session.user.id,
                    previousAmount,
                    newAmount,
                    reason
                }
            });

            // We can't use the helper here easily because it uses `prisma` global. 
            // Ideally helper should accept tx or we do it manually.
            await tx.activityLog.create({
                data: {
                    userId: session.user.id,
                    action: 'UPDATE',
                    entity: 'LEASE', // or RENT_MODIFICATION
                    entityId: leaseId,
                    details: JSON.stringify({ previousAmount, newAmount, reason })
                }
            });
        });

        revalidatePath(`/admin/tenants/${lease.userId}`);
        return { success: true };

    } catch (e) {
        console.error("Update Rent Error:", e);
        return { error: "Failed to update rent" };
    }
}

// --- RBAC & Staff Actions ---

import bcrypt from 'bcryptjs';

import { CreateTenantSchema } from "@/lib/schemas";

export async function createTenant(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password"),
        nextOfKinName: formData.get("nextOfKinName"),
        nextOfKinPhone: formData.get("nextOfKinPhone"),
        employerName: formData.get("employerName"),
        jobTitle: formData.get("jobTitle"),
    };

    const validatedFields = CreateTenantSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors, message: "Validation failed" };
    }

    const { name, email, phone, password, nextOfKinName, nextOfKinPhone, employerName, jobTitle } = validatedFields.data;

    try {
        // 1. Check for existing user
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone || undefined } // Only check phone if provided
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === email) return { error: "A user with this email already exists." };
            if (phone && existingUser.phone === phone) return { error: "A user with this phone number already exists." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = (session.user as any).role;

        // Staff created tenants are PENDING by default
        const status = userRole === 'STAFF' ? 'PENDING' : 'ACTIVE';

        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone: phone || null,
                password: hashedPassword,
                role: 'TENANT',
                status,
                nextOfKinName: nextOfKinName || null,
                nextOfKinPhone: nextOfKinPhone || null,
                employerName: employerName || null,
                jobTitle: jobTitle || null,
                isEmployed: !!employerName,
            }
        });

        await createActivityLog(
            session.user.id,
            ActionType.CREATE,
            EntityType.USER,
            user.id,
            { name, role: 'TENANT', status }
        );

        revalidatePath("/admin/users");
        return { success: true, message: status === 'PENDING' ? "Tenant created and pending approval." : "Tenant created successfully." };
    } catch (e) {
        console.error("Create Tenant Error:", e);
        return { error: "Failed to create tenant. Please try again." };
    }
}

import { CreatePaymentSchema } from "@/lib/schemas";

export async function createPayment(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const rawData = {
        amount: Number(formData.get("amount")),
        reference: formData.get("reference"),
        method: formData.get("method"),
        tenantId: formData.get("tenantId"),
    };

    const validatedFields = CreatePaymentSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors, message: "Validation failed" };
    }

    const { amount, reference, method, tenantId } = validatedFields.data;

    try {
        // Check for duplicate reference (Assuming reference should be unique)
        const existingPayment = await prisma.payment.findUnique({
            where: { reference }
        });

        if (existingPayment) {
            return { error: "A payment with this reference ID already exists." };
        }

        const userRole = (session.user as any).role;
        // Staff created payments are PENDING approval
        const approvalStatus = userRole === 'STAFF' ? 'PENDING' : 'APPROVED';

        const payment = await prisma.payment.create({
            data: {
                amount,
                reference,
                method,
                userId: tenantId,
                status: 'SUCCESS', // The payment itself is successful/recorded
                approvalStatus, // But admins need to verify it
            }
        });

        await createActivityLog(
            session.user.id,
            ActionType.CREATE,
            EntityType.PAYMENT,
            payment.id,
            { amount, reference, approvalStatus }
        );

        revalidatePath(`/admin/users/${tenantId}`);
        return { success: true, message: approvalStatus === 'PENDING' ? "Payment recorded and pending approval." : "Payment recorded." };
    } catch (e) {
        console.error("Create Payment Error:", e);
        return { error: "Failed to record payment" };
    }
}

export async function approveUser(userId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status: 'ACTIVE' }
        });

        await createActivityLog(
            session.user.id,
            ActionType.APPROVE,
            EntityType.USER,
            userId,
            { details: "Tenant Approved" }
        );

        revalidatePath("/admin/users");
        revalidatePath("/admin/approvals");
        return { success: true };
    } catch (e) {
        console.error("Approve User Error:", e);
        return { error: "Failed to approve user" };
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
        // We'd likely revalidate the specific user page too, but we might not have ID easily here without fetch.
        // It's okay.
        return { success: true };
    } catch (e) {
        console.error("Approve Payment Error:", e);
        return { error: "Failed to approve payment" };
    }
}

import { UploadDocumentSchema } from "@/lib/schemas";

export async function uploadDocument(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const rawData = {
        userId: formData.get("userId"),
        category: formData.get("category"),
    };

    const validatedFields = UploadDocumentSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors, message: "Validation failed" };
    }

    const { userId, category } = validatedFields.data;
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
        return { error: "No file provided" };
    }

    try {
        // Upload to Cloudinary
        // Note: We import dynamically or top-level. Since this is a server action file, top level is fine if we add the import.
        // But for cleaner replacement here without messing up top imports too much, we can try to import helper actions.
        // Actually, let's just use the helper we created.
        const { uploadToCloudinary } = await import("@/lib/cloudinary");

        const fileUrl = await uploadToCloudinary(file, 'realestate_documents');

        await prisma.document.create({
            data: {
                userId,
                name: file.name,
                url: fileUrl,
                type: file.type || 'application/octet-stream',
                category: category,
            }
        });

        await createActivityLog(
            session.user.id,
            ActionType.CREATE,
            EntityType.DOCUMENT,
            userId,
            { filename: file.name, category, url: fileUrl }
        );

        revalidatePath(`/admin/users/${userId}`);
        return { success: true };
    } catch (e) {
        console.error("Upload Document Error:", e);
        return { error: "Failed to upload document" };
    }
}
export async function deleteProperty(propertyId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        await prisma.property.delete({
            where: { id: propertyId }
        });

        await createActivityLog(
            session.user.id,
            ActionType.DELETE,
            EntityType.PROPERTY,
            propertyId,
            { details: "Property Deleted" }
        );

        revalidatePath("/admin/properties");
        return { success: true };
    } catch (e) {
        console.error("Delete Property Error:", e);
        return { error: "Failed to delete property" };
    }
}

export async function deleteMaterial(materialId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        await prisma.material.delete({
            where: { id: materialId }
        });

        revalidatePath("/admin/materials");
        return { success: true };
    } catch (e) {
        console.error("Delete Material Error:", e);
        return { error: "Failed to delete material" };
    }
}





export async function markMessageAsRead(messageId: string) {
    const session = await auth();
    // Allow ADMIN and STAFF
    if (!session?.user?.id || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'STAFF')) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.contactSubmission.update({
            where: { id: messageId },
            data: { status: 'READ' }
        });

        revalidatePath("/admin/inbox");
        return { success: true };
    } catch (e) {
        console.error("Mark Message Read Error:", e);
        return { error: "Failed to update message status" };
    }
}

export async function deleteMessage(messageId: string) {
    const session = await auth();
    // Only ADMIN can delete
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.contactSubmission.delete({
            where: { id: messageId }
        });

        await createActivityLog(
            session.user.id,
            ActionType.DELETE,
            EntityType.TICKET, // Using TICKET as proxy for now
            messageId,
            { details: "Contact Message Deleted" }
        );

        revalidatePath("/admin/inbox");
        return { success: true };
    } catch (e) {
        console.error("Delete Message Error:", e);
        return { error: "Failed to delete message" };
    }
}

import { AddCommentSchema } from "@/lib/schemas";

export async function addComment(ticketId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const validatedFields = AddCommentSchema.safeParse({ ticketId, content });

    if (!validatedFields.success) {
        return { error: "Validation failed" };
    }

    try {
        const comment = await prisma.ticketComment.create({
            data: {
                ticketId,
                userId: session.user.id,
                content,
            },
            include: {
                user: {
                    select: { name: true, role: true }
                }
            }
        });

        // Trigger Pusher
        // Dynamic import to avoid build issues if pusher envs are missing
        try {
            const { pusherServer } = await import("@/lib/pusher");
            await pusherServer.trigger(`ticket-${ticketId}`, 'incoming-message', {
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                user: {
                    name: comment.user.name,
                    role: comment.user.role,
                    id: session.user.id
                }
            });
        } catch (pusherError) {
            console.error("Pusher Trigger Error:", pusherError);
            // Don't fail the action if realtime fails, just log it.
        }

        revalidatePath(`/admin/tickets/${ticketId}`);
        return { success: true };
    } catch (e) {
        console.error("Add Comment Error:", e);
        return { error: "Failed to post comment" };
    }
}
