
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
    });

    console.log('--- FOUND USERS ---');
    users.forEach(u => {
        console.log(`[${u.role}] ${u.email} (ID: ${u.id})`);
    });
    console.log(`\nTotal Users: ${users.length}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
