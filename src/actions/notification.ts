"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NotificationType } from "@prisma/client";

export async function createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message?: string,
    link?: string,
    ticketId?: string
) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                link,
                ticketId,
            }
        });

        // Trigger Real-time notification via Pusher
        try {
            const { pusherServer } = await import("@/lib/pusher");
            await pusherServer.trigger(`private-user-${userId}`, "incoming-notification", {
                id: notification.id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                link: notification.link,
                createdAt: notification.createdAt,
            });
        } catch (pusherError) {
            console.error("Pusher Notification Error:", pusherError);
        }

        return { success: true, notification };
    } catch (e) {
        console.error("Create Notification Error:", e);
        return { error: "Failed to create notification" };
    }
}

export async function getNotifications() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 20,
        });
        return { success: true, notifications };
    } catch (e) {
        console.error("Get Notifications Error:", e);
        return { error: "Failed to fetch notifications" };
    }
}

export async function markNotificationRead(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    try {
        await prisma.notification.update({
            where: { id, userId: session.user.id },
            data: { isRead: true }
        });
        return { success: true };
    } catch (e) {
        console.error("Mark Read Error:", e);
        return { error: "Failed to mark as read" };
    }
}

export async function markAllNotificationsRead() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    try {
        await prisma.notification.updateMany({
            where: { userId: session.user.id, isRead: false },
            data: { isRead: true }
        });
        return { success: true };
    } catch (e) {
        console.error("Mark All Read Error:", e);
        return { error: "Failed to mark all as read" };
    }
}
