
import { prisma } from "@/lib/prisma";

export enum ActionType {
    LOGIN = 'LOGIN',
    CREATE = 'CREATE',
    READ = 'READ',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    APPROVE = 'APPROVE',
    REJECT = 'REJECT',
}

export enum EntityType {
    PAYMENT = 'PAYMENT',
    LEASE = 'LEASE',
    RENT_MODIFICATION = 'RENT_MODIFICATION',
    DOCUMENT = 'DOCUMENT',
    MATERIAL = 'MATERIAL',
    USER = 'USER',
    PROPERTY = 'PROPERTY',
    TICKET = 'TICKET',
}

/**
 * Creates an activity log entry in the database.
 * 
 * @param userId - The ID of the user performing the action (optional for system actions).
 * @param action - The type of action performed (from ActionType enum).
 * @param entity - The entity being affected (from EntityType enum).
 * @param entityId - The ID of the specific entity record.
 * @param details - Optional object containing additional details (will be stringified).
 */
export async function createActivityLog(
    userId: string | null,
    action: ActionType | string,
    entity: EntityType | string,
    entityId: string | null,
    details?: any
) {
    try {
        await prisma.activityLog.create({
            data: {
                userId,
                action: action.toString(),
                entity: entity.toString(),
                entityId,
                details: details ? JSON.stringify(details) : null,
            },
        });
    } catch (error) {
        console.error("Failed to create activity log:", error);
        // We don't want to break the main flow if logging fails, so we just log the error.
    }
}
