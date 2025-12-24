const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Starting reproduction...");
    try {
        // Attempting to reproduce the 'not: TENANT' query
        console.log("Test 1: { role: { not: 'TENANT' } }");
        const users1 = await prisma.user.findMany({
            where: { role: { not: 'TENANT' } },
            take: 5
        });
        console.log("Test 1 Success. Count:", users1.length);

        // Attempting to reproduce with search query
        console.log("Test 2: { role: { not: 'TENANT' }, OR: [...] }");
        const users2 = await prisma.user.findMany({
            where: {
                role: { not: 'TENANT' },
                OR: [
                    { name: { contains: 'test' } },
                    { email: { contains: 'test' } }
                ]
            },
            take: 5
        });
        console.log("Test 2 Success. Count:", users2.length);

    } catch (error) {
        console.error("ERROR CAPTURED:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
