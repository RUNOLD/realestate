import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateRandomDigits(length: number): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function generateUniqueId(prefix: string): Promise<string> {
    const maxRetries = 20;

    for (let i = 0; i < maxRetries; i++) {
        const randomDigits = generateRandomDigits(4);
        const uniqueId = `${prefix}${randomDigits}`;

        // Use Raw SQL to valid existence check without relying on typed client model fields
        const existing: any[] = await prisma.$queryRaw`SELECT 1 FROM "User" WHERE "uniqueId" = ${uniqueId} LIMIT 1`;

        if (existing.length === 0) {
            return uniqueId;
        }
    }
    throw new Error(`Failed to generate unique ID for prefix ${prefix}`);
}

async function main() {
    console.log('Starting User ID Backfill (Raw SQL Mode)...');

    // Fetch users who don't have a uniqueId yet
    // NOTE: Using quotes for exact case matching if needed, though usually standard public names are lowercase in PG.
    // Prisma usually creates tables with TitleCase if model is TitleCase but wrapped in quotes.
    const users: any[] = await prisma.$queryRaw`SELECT id, email, role FROM "User" WHERE "uniqueId" IS NULL`;

    console.log(`Found ${users.length} users to update.`);

    for (const user of users) {
        let prefix = 'APM'; // Default
        const role = user.role;

        if (role === 'TENANT' || role === 'LANDLORD') {
            prefix = 'APMS';
        } else if (role === 'ADMIN' || role === 'STAFF') {
            prefix = 'APM';
        }

        try {
            const uniqueId = await generateUniqueId(prefix);

            await prisma.$executeRaw`UPDATE "User" SET "uniqueId" = ${uniqueId} WHERE id = ${user.id}`;

            console.log(`Updated User ${user.email} (${role}) -> ${uniqueId}`);
        } catch (error) {
            console.error(`Failed to update user ${user.email}:`, error);
        }
    }

    console.log('Backfill complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
