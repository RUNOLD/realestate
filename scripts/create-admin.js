import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const admin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (admin) {
            console.log('Admin found:', admin.email);
        } else {
            const newUser = await prisma.user.create({
                data: {
                    email: 'admin@ayoola.com',
                    name: 'Super Admin',
                    password: 'password',
                    role: 'ADMIN',
                    status: 'ACTIVE'
                }
            });
            console.log('Created admin:', newUser.email);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
