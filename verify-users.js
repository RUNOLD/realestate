const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log("--- Current Users in DB ---");
        users.forEach(u => {
            console.log(`User: ${u.email}, Role: ${u.role}, Status: ${u.status}, ID: ${u.id}`);
        });
        console.log("---------------------------");

        console.log("Testing ActivityLog creation...");
        try {
            // Try a raw query or simple create if model exists in client
            // If client is stale, it might not have 'activityLog' property
            if (prisma.activityLog) {
                await prisma.activityLog.create({
                    data: {
                        action: 'TEST_LOG',
                        entity: 'SYSTEM',
                        details: 'Verification script test',
                        userId: users[0]?.id // Use first user if available
                    }
                });
                console.log("✅ ActivityLog table exists and writer works.");
            } else {
                console.log("❌ prisma.activityLog is undefined (Client outdated).");
            }
        } catch (err) {
            console.error("❌ Failed to create ActivityLog:", err.message);
        }

    } catch (e) {
        console.error("Error connecting to DB:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
