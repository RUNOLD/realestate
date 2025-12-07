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

        // Unified Dashboard: Redirect everyone to /dashboard
        // if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
        //    redirectUrl = '/admin';
        // }

        console.log("LOGIN DEBUG: Redirecting to:", redirectUrl);

        // 2. Sign In with redirect: false to handle client-side
        console.log("LOGIN DEBUG: Attempting sign in with redirect: false");
        await signIn('credentials', {
            identifier,
            password,
            redirect: false,
        });

        // If we get here, sign in was successful (otherwise it throws)
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
        const ticket = await prisma.ticket.create({
            data: {
                subject,
                description,
                category: category as any,
                userId: session.user.id,
                status: "PENDING",
                // Transparency System: Set initial approval status
                approvalStatus: "PENDING_MANAGER",
                requiresApproval: true,
            }
        });

        // Log the activity
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

export async function createAdminTicket(prevState: any, formData: FormData) {
    const session = await auth();
    // Allow ADMIN and STAFF to create tickets
    if (!session?.user?.id || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'STAFF')) {
        return { error: "Unauthorized" };
    }

    const userId = formData.get("userId") as string; // Requester
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const priority = formData.get("priority") as string;
    const images = formData.get("images") as string; // Expecting JSON string for now

    if (!userId || !subject || !description || !category || !priority) {
        return { error: "Missing required fields" };
    }

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

        // Log the activity
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

export async function createLease(userId: string, propertyId: string, rentAmount: number, startDate: Date, endDate?: Date) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Unauthorized" };

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

export async function updateRent(leaseId: string, newAmount: number, reason: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Unauthorized" };

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

export async function createTenant(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    const nextOfKinName = formData.get("nextOfKinName") as string;
    const nextOfKinPhone = formData.get("nextOfKinPhone") as string;
    const employerName = formData.get("employerName") as string;
    const jobTitle = formData.get("jobTitle") as string;

    if (!name || !email || !password) {
        return { error: "Missing required fields" };
    }

    try {
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
        return { error: "Failed to create tenant. Email might be in use." };
    }
}

export async function createPayment(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const amount = parseFloat(formData.get("amount") as string);
    const reference = formData.get("reference") as string;
    const method = formData.get("method") as string;
    const tenantId = formData.get("tenantId") as string;

    if (!amount || !reference || !tenantId) {
        return { error: "Missing required fields" };
    }

    try {
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

export async function uploadDocument(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const userId = formData.get("userId") as string;
    const category = formData.get("category") as string;
    const file = formData.get("file") as File;

    // In a real app we'd upload 'file' to blob storage (S3/R2).
    // For this local MVP, we will write to the public/uploads directory.

    // 1. Prepare buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Prepare directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
        await fs.mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // ignore if exists
    }

    // 3. Write file
    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, uniqueName);
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueName}`;

    try {
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
            EntityType.DOCUMENT, // Assuming this exists or falls back to string
            userId, // Linking to user
            { filename: file.name, category }
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
