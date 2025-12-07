const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log("Starting manual seed...");
    const password = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@ayoolaproperty.com' },
        update: {},
        create: {
            email: 'admin@ayoolaproperty.com',
            name: 'Super Admin',
            password: password,
            role: 'ADMIN',
        },
    });
    console.log("Admin created/found:", admin.email);

    const staff = await prisma.user.upsert({
        where: { email: 'staff@ayoolaproperty.com' },
        update: {},
        create: {
            email: 'staff@ayoolaproperty.com',
            name: 'Sarah Staff',
            password: password,
            role: 'STAFF',
        },
    });
    console.log("Staff created/found:", staff.email);

    const tenant = await prisma.user.upsert({
        where: { email: 'tenant@example.com' },
        update: {},
        create: {
            email: 'tenant@example.com',
            name: 'John Doe',
            password: password,
            role: 'TENANT',
        },
    });
    console.log("Tenant created/found:", tenant.email);

    console.log("Seed completed successfully.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
