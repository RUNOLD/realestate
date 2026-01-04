import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
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
                password: 'password', // Store as plain text or hash if needed, auth.ts handles both
                role: 'ADMIN',
                status: 'ACTIVE'
            }
        });
        console.log('Created admin:', newUser.email);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
