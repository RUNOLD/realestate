'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { CreateLeaseSchema, UpdateRentSchema } from "@/lib/schemas";
import { createActivityLog, ActionType, EntityType } from "@/lib/logger";

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
                isActive: true,
                billingCycle: 'YEARLY'
            }
        });

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

    const validatedFields = UpdateRentSchema.safeParse({ leaseId, newAmount, reason });

    if (!validatedFields.success) {
        return { error: "Validation failed" };
    }

    try {
        const lease = await prisma.lease.findUnique({ where: { id: leaseId } });
        if (!lease) return { error: "Lease not found" };

        const previousAmount = lease.rentAmount;

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

            await tx.activityLog.create({
                data: {
                    userId: session.user.id,
                    action: 'UPDATE',
                    entity: 'LEASE',
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

export async function terminateLease(leaseId: string, terminationDate?: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        const lease = await prisma.lease.findUnique({
            where: { id: leaseId },
            include: { property: true }
        });

        if (!lease) return { error: "Lease not found" };

        await prisma.$transaction([
            (prisma.lease as any).update({
                where: { id: leaseId },
                data: {
                    isActive: false,
                    terminationDate: terminationDate ? new Date(terminationDate) : new Date()
                }
            }),
            (prisma.property as any).update({
                where: { id: lease.propertyId },
                data: { status: 'AVAILABLE' }
            })
        ]);

        await createActivityLog(
            session.user.id,
            ActionType.UPDATE,
            EntityType.LEASE,
            leaseId,
            { details: "Lease Terminated", propertyId: lease.propertyId, terminationDate }
        );

        revalidatePath("/admin/properties");
        revalidatePath(`/admin/properties/${lease.propertyId}`);
        revalidatePath(`/admin/users/${lease.userId}`);
        return { success: true };
    } catch (e) {
        console.error("Terminate Lease Error:", e);
        return { error: "Failed to terminate lease" };
    }
}

export async function deleteLease(leaseId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        const lease = await prisma.lease.findUnique({
            where: { id: leaseId }
        });

        if (!lease) return { error: "Lease not found" };

        await prisma.$transaction([
            prisma.lease.delete({
                where: { id: leaseId }
            }),
            prisma.property.update({
                where: { id: lease.propertyId },
                data: { status: 'AVAILABLE' }
            })
        ]);

        await createActivityLog(
            session.user.id,
            ActionType.DELETE,
            EntityType.LEASE,
            leaseId,
            { details: "Lease Deleted", propertyId: lease.propertyId }
        );

        revalidatePath("/admin/properties");
        revalidatePath(`/admin/properties/${lease.propertyId}`);
        revalidatePath(`/admin/users/${lease.userId}`);
        return { success: true };
    } catch (e) {
        console.error("Delete Lease Error:", e);
        return { error: "Failed to delete lease" };
    }
}

export async function deleteProperty(propertyId: string, reason: string, deleteAllUnits: boolean = false) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            include: { units: true }
        });

        if (!property) return { error: "Property not found" };

        let idsToDelete = [propertyId];

        if (deleteAllUnits) {
            if (property.parentId) {
                // If it's a unit, find siblings and include the parent
                const siblings = await prisma.property.findMany({
                    where: { parentId: property.parentId },
                    select: { id: true }
                });
                idsToDelete = Array.from(new Set([...idsToDelete, ...siblings.map(s => s.id), property.parentId]));
            } else if (property.units.length > 0) {
                // If it's a parent, find all units
                idsToDelete = Array.from(new Set([...idsToDelete, ...property.units.map(u => u.id)]));
            }
        }

        await prisma.$transaction(async (tx) => {
            // Disconnect or delete related records to satisfy constraints

            // Tickets
            await tx.ticket.deleteMany({ where: { propertyId: { in: idsToDelete } } });
            await tx.ticket.deleteMany({ where: { unitId: { in: idsToDelete } } });

            // Payments
            await tx.payment.updateMany({
                where: { propertyId: { in: idsToDelete } },
                data: { propertyId: null }
            });

            // LandlordExpense
            await tx.landlordExpense.deleteMany({ where: { propertyId: { in: idsToDelete } } });

            // Payouts
            await tx.payout.updateMany({
                where: { propertyId: { in: idsToDelete } },
                data: { propertyId: null }
            });

            // Delete the properties in correct order (children first to avoid FK issues)
            await tx.property.deleteMany({
                where: { id: { in: idsToDelete }, parentId: { not: null } }
            });
            await tx.property.deleteMany({
                where: { id: { in: idsToDelete }, parentId: null }
            });
        });

        await createActivityLog(
            session.user.id,
            ActionType.DELETE,
            EntityType.PROPERTY,
            propertyId,
            { details: `Property Deleted (Reason: ${reason})`, deletedIds: idsToDelete }
        );

        revalidatePath("/admin/properties");
        return { success: true };
    } catch (e) {
        console.error("Delete Property Error:", e);
        return { error: "Failed to delete property. It may have dependent records that cannot be safely removed." };
    }
}
