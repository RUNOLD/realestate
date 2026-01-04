'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createActivityLog, ActionType, EntityType } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export async function sendTenantReminder(tenantId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any)?.role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        // Mock sending reminder (email/sms)

        await createActivityLog(
            session.user.id,
            ActionType.UPDATE,
            EntityType.USER,
            tenantId,
            { action: "Sended Payment Reminder" }
        );

        return { success: true };
    } catch (e) {
        return { error: "Failed to send reminder" };
    }
}

export async function suspendTenantPortal(tenantId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any)?.role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        await prisma.user.update({
            where: { id: tenantId },
            data: { status: 'SUSPENDED' }
        });

        // The original code had `if (!session?.user) return { error: "Unauthorized" };` here,
        // but the preceding check `!session?.user?.id || (session.user as any)?.role !== 'ADMIN'`
        // already ensures `session.user` exists if we reach this point and are authorized.
        // So, `session.user.id` is safe to access.
        await createActivityLog(
            session.user.id,
            ActionType.UPDATE,
            EntityType.USER,
            tenantId,
            { action: "Suspended Tenant Portal" }
        );

        revalidatePath(`/admin/users/${tenantId}`);
        return { success: true };
    } catch (e) {
        return { error: "Failed to suspend portal" };
    }
}

export async function blacklistTenant(tenantId: string, reason?: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        // Implement blacklisting logic (e.g., adding to a Blacklist table or flag)
        await (prisma.user as any).update({
            where: { id: tenantId },
            data: {
                role: 'TENANT', // Ensure they are marked as tenant
                blacklistReason: reason || "No reason provided"
            }
        });

        if (!session?.user) return { error: "Unauthorized" };
        await createActivityLog(
            session.user.id,
            ActionType.UPDATE,
            EntityType.USER,
            tenantId,
            { action: "Blacklisted Tenant", reason }
        );

        revalidatePath(`/admin/users/${tenantId}`);
        return { success: true };
    } catch (e) {
        return { error: "Failed to blacklist tenant" };
    }
}
