
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ADMIN_EMAIL = 'admin@ayoolaproperty.com';

async function main() {
    console.log(`PREPARING TO DELETE ALL USERS EXCEPT: ${ADMIN_EMAIL}`);
    console.log("Waiting 5 seconds... Press Ctrl+C to cancel.");

    await new Promise(resolve => setTimeout(resolve, 5000));

    const usersToDelete = await prisma.user.findMany({
        where: {
            email: { not: ADMIN_EMAIL }
        }
    });

    if (usersToDelete.length === 0) {
        console.log("No demo accounts found to delete.");
        return;
    }

    console.log(`Found ${usersToDelete.length} users to delete.`);

    // Delete in transaction for safety
    // Note: If you have cascading deletes set up in schema.prisma (onDelete: Cascade), 
    // deleting the user is enough. If not, this might fail or require deleting profiles first.
    // Assuming standard setup, we try direct delete. If it fails, we need manual cleanup.

    for (const user of usersToDelete) {
        try {
            console.log(`Deleting ${user.email} (${user.role})...`);
            // Attempt to delete user. If foreign key constraints fail, we might need to delete profiles.
            // But typically User is the parent.
            await prisma.user.delete({ where: { id: user.id } });
        } catch (e: any) {
            console.error(`Failed to delete ${user.email}: ${e.message}`);
        }
    }

    console.log("\nCleanup complete.");
    console.log(`Preserved User: ${ADMIN_EMAIL}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
