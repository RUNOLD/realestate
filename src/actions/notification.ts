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

        // 1. Fetch User Preferences to check if we should send Email/SMS
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, notificationPreferences: true }
        });

        const preferences = user?.notificationPreferences as any;

        // 2. Trigger External Alerts based on "Pulse Connectivity" preferences
        if (preferences?.email && user?.email) {
            try {
                const { sendEmail } = await import("@/lib/mail");
                await sendEmail({
                    to: user.email,
                    subject: `[Ayoola Pulse] ${title}`,
                    html: `
                        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
                            <h2 style="color: #1a1a1a;">${title}</h2>
                            <p>${message || 'You have a new update on your portal.'}</p>
                            ${link ? `<div style="margin: 20px 0;">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${link}" 
                                   style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                                    View Details
                                </a>
                            </div>` : ''}
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p style="font-size: 12px; color: #666;">Ayoola Property Management & Sourcing Services Limited</p>
                        </div>
                    `
                });
            } catch (mailError) {
                console.error("Pulse Email Error:", mailError);
            }
        }

        // 3. Trigger Real-time notification via Pusher
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
