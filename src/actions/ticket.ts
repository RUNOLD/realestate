'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { CreateTicketSchema, CreateAdminTicketSchema, AddCommentSchema } from "@/lib/schemas";
import { createActivityLog, ActionType, EntityType } from "@/lib/logger";
import { createNotification } from "./notification";
import { NotificationType } from "@prisma/client";

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
                status: "OPEN",
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

        // Notify Admins and Staff
        const staffUsers = await prisma.user.findMany({
            where: { role: { in: ['ADMIN', 'STAFF'] } },
            select: { id: true }
        });

        for (const staff of staffUsers) {
            await createNotification(
                staff.id,
                'MAINTENANCE' as any,
                'New Maintenance Request',
                `A new ticket "${subject}" has been submitted.`,
                `/admin/tickets/${ticket.id}`,
                ticket.id
            );
        }

        revalidatePath("/dashboard");
        revalidatePath("/admin/tickets");
        return { success: true };
    } catch (e) {
        console.error("Create Ticket Error:", e);
        return { error: "Failed to create ticket" };
    }
}

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
                priority: priority as any,
                userId,
                status: "OPEN",
                approvalStatus: "APPROVED",
                requiresApproval: false,
                images: images ? JSON.parse(images as string) : [],
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

export async function approveTicket(ticketId: string, role: 'MANAGER' | 'ADMIN') {
    const session = await auth();
    const userRole = (session?.user as any)?.role;

    if (!session?.user?.id || (userRole !== 'ADMIN' && userRole !== 'STAFF')) {
        return { error: "Unauthorized" };
    }

    // Role-based authorization: Staff can ONLY perform manager-level review
    if (userRole === 'STAFF' && role !== 'MANAGER') {
        return { error: "Staff can only perform manager-level review" };
    }

    try {
        let updateData: any = {};
        const action = ActionType.APPROVE;

        if (role === 'MANAGER') {
            updateData = { approvalStatus: 'PENDING_ADMIN' };
        } else if (role === 'ADMIN') {
            updateData = { approvalStatus: 'APPROVED', status: 'IN_PROGRESS' };
        }

        await prisma.ticket.update({
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


export async function markTicketAsFixed(
    ticketId: string,
    data: {
        resolutionNote: string,
        costActual: number,
        resolvedBy: string
    }
) {
    const session = await auth();
    const userRole = (session?.user as any)?.role;

    if (!session?.user?.id || (userRole !== 'ADMIN' && userRole !== 'STAFF')) {
        return { error: "Unauthorized" };
    }

    try {
        const ticket = await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: 'AWAITING_CONFIRMATION',
                resolutionNote: data.resolutionNote,
                costActual: data.costActual,
                resolvedBy: data.resolvedBy
            },
            include: { user: true }
        });

        await createActivityLog(
            session.user.id,
            'FIXED',
            EntityType.TICKET,
            ticketId,
            { resolutionNote: data.resolutionNote, cost: data.costActual }
        );

        // Notify Tenant
        await createNotification(
            ticket.userId,
            'MAINTENANCE',
            'Maintenance Completed',
            `Work on "${ticket.subject}" is complete. Please confirm resolution.`,
            `/dashboard/maintenance`,
            ticketId
        );

        revalidatePath("/admin/tickets");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (e) {
        console.error("Mark Fixed Error:", e);
        return { error: "Failed to update ticket" };
    }
}

export async function confirmTicketResolution(ticketId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) return { error: "Ticket not found" };

        if (ticket.userId !== session.user.id && (session.user as any).role !== 'ADMIN') {
            return { error: "Unauthorized" };
        }

        await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: 'RESOLVED',
                resolutionDate: new Date()
            }
        });

        await createActivityLog(
            session.user.id,
            'RESOLVE',
            EntityType.TICKET,
            ticketId,
            { confirmedBy: session.user.id }
        );

        revalidatePath("/dashboard");
        revalidatePath("/admin/tickets");
        return { success: true };
    } catch (e) {
        console.error("Confirm Ticket Error:", e);
        return { error: "Failed to confirm resolution" };
    }
}


export async function addComment(ticketId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const validatedFields = AddCommentSchema.safeParse({ ticketId, content });

    if (!validatedFields.success) {
        return { error: "Validation failed" };
    }

    try {
        // Fetch ticket to check ownership/claim status
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            select: { userId: true, claimedById: true }
        });

        if (!ticket) return { error: "Ticket not found" };

        const isTenant = session.user.id === ticket.userId;

        // If not the tenant, enforce claiming logic
        if (!isTenant) {
            if (!ticket.claimedById) {
                // First responder claims the ticket
                await prisma.ticket.update({
                    where: { id: ticketId },
                    data: { claimedById: session.user.id }
                });
            } else if (ticket.claimedById !== session.user.id) {
                // Not the claimant
                return { error: "This conversation is restricted to the first responder." };
            }
        }

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
        }

        // Notify relevant parties
        try {
            if (isTenant) {
                if (ticket.claimedById) {
                    await createNotification(
                        ticket.claimedById,
                        'CHAT' as any,
                        'New Message from Tenant',
                        `New reply on ticket #${ticketId.substring(0, 8)}`,
                        `/admin/tickets/${ticketId}`,
                        ticketId
                    );
                }
            } else {
                await createNotification(
                    ticket.userId,
                    'CHAT' as any,
                    'New Message from Support',
                    `Staff replied to your ticket #${ticketId.substring(0, 8)}`,
                    `/dashboard/maintenance`,
                    ticketId
                );
            }
        } catch (notifError) {
            console.error("Notification Trigger Error:", notifError);
        }

        revalidatePath(`/admin/tickets/${ticketId}`);
        revalidatePath(`/dashboard/maintenance`);
        return { success: true };
    } catch (e: any) {
        console.error("Add Comment Error:", e);
        return { error: e.message || "Failed to post comment" };
    }
}
