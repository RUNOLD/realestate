'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createActivityLog, ActionType, EntityType } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export async function sendTenantReminder(tenantId: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== 'ADMIN') return { error: "Unauthorized" };

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
    if ((session?.user as any)?.role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        await prisma.user.update({
            where: { id: tenantId },
            data: { isActive: false }
        });

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

export async function blacklistTenant(tenantId: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        // Implement blacklisting logic (e.g., adding to a Blacklist table or flag)
        await prisma.user.update({
            where: { id: tenantId },
            data: { role: 'TENANT' } // Or similar, maybe a new 'BLACKLISTED' status?
        });

        await createActivityLog(
            session.user.id,
            ActionType.UPDATE,
            EntityType.USER,
            tenantId,
            { action: "Blacklisted Tenant" }
        );

        revalidatePath(`/admin/users/${tenantId}`);
        return { success: true };
    } catch (e) {
        return { error: "Failed to blacklist tenant" };
    }
}
