'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ContactSchema, UploadDocumentSchema } from "@/lib/schemas";
import { createActivityLog, ActionType, EntityType } from "@/lib/logger";

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
    } catch (e: any) {
        console.error("Upload Document Error:", e);
        return { error: e.message || "Failed to upload document" };
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
            EntityType.TICKET,
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
