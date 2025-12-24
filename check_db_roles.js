const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const roles = await prisma.user.groupBy({
            by: ['role'],
            _count: {
                id: true
            }
        });
        console.log("Found roles in database:");
        console.table(roles);

        const users = await prisma.user.findMany({
            take: 10,
            select: { id: true, name: true, email: true, role: true }
        });
        console.log("Sample users:");
        console.table(users);

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
