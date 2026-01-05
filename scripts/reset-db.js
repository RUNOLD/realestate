
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log("⚠️  STARTING FULL DATABASE RESET ⚠️");

    // Ordered deletion list (or truncate with cascade)
    // Using TRUNCATE CASCADE is fastest and handles dependencies
    const tablenames = await prisma.$queryRaw`
        SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

    const tables = tablenames
        .map(({ tablename }) => tablename)
        .filter((name) => name !== '_prisma_migrations')
        .map((name) => `"public"."${name}"`)
        .join(', ');

    if (!tables.length) {
        console.log("No tables found.");
        return;
    }

    try {
        console.log(`Truncating tables: ${tables}`);
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
        console.log("✅ All tables truncated successfully.");
    } catch (error) {
        console.error("Error truncating tables:", error);
        process.exit(1);
    }

    // SEEDING SUPER ADMIN
    console.log("🌱 Seeding Super Admin...");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // We need a uniqueId generator logic replica or just hardcode it
    // Using 'APM0000' as the first ID

    await prisma.user.create({
        data: {
            name: "Super Admin",
            email: "admin@ayoolarealestate.com",
            password: hashedPassword,
            role: "ADMIN",
            status: "ACTIVE",
            uniqueId: "APM0001",
            phone: "07000000000",
            emailVerified: new Date(),
        }
    });

    console.log("✅ Super Admin created: admin@ayoolarealestate.com / admin123");
    console.log("🚀 Database reset complete.");
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
