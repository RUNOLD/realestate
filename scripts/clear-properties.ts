
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting Clean Up: Clearing All Properties...');

    try {
        // 1. Delete dependent tickets logic via cascade or manual
        // Let's rely on deleteMany. If constraints fail, we'll know.
        // Ideally, tickets should be deleted if property is deleted if we set onDelete: Cascade. 
        // Checking schema: 
        // user user @relation(...) onDelete: Cascade -> logic for User.
        // property has leases, tickets.

        // Deleting in order to be safe.

        console.log('Deleting Tickets...');
        await prisma.ticket.deleteMany({});

        console.log('Deleting Leases...');
        await prisma.lease.deleteMany({});

        console.log('Deleting Units (Child Properties)...');
        // Units are properties where parentId is NOT null.
        // Self-relation: parent Property @relation("PropertyUnits", fields: [parentId], ...)
        // If we delete parents, children might block it or cascade.
        // Let's delete child units first.
        await prisma.property.deleteMany({
            where: { parentId: { not: null } }
        });

        console.log('Deleting Parent Properties...');
        const result = await prisma.property.deleteMany({});

        console.log(`Deleted ${result.count} properties.`);
        console.log('✅ All properties cleared successfully.');

    } catch (error) {
        console.error('Error clearing properties:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
