
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@ayoolaproperty.com';
    const password = 'password123';

    try {
        const user = await prisma.user.findFirst({
            where: { email }
        });

        if (!user) {
            console.log('User not found');
            return;
        }

        console.log(`User found: ${user.email}, Role: ${user.role}`);
        console.log(`Stored Hash: ${user.password}`);

        const match = await bcrypt.compare(password, user.password);
        console.log(`Password match for '${password}': ${match}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
