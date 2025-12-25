'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { CreateTicketSchema, CreateAdminTicketSchema, AddCommentSchema } from "@/lib/schemas";
import { createActivityLog, ActionType, EntityType } from "@/lib/logger";

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
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
        return { error: "Unauthorized" };
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

        revalidatePath(`/admin/tickets/${ticketId}`);
        return { success: true };
    } catch (e) {
        console.error("Add Comment Error:", e);
        return { error: "Failed to post comment" };
    }
}
