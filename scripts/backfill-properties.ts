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

        // Raw SQL check against Property table
        const existing: any[] = await prisma.$queryRaw`SELECT 1 FROM "Property" WHERE "uniqueId" = ${uniqueId} LIMIT 1`;

        if (existing.length === 0) {
            return uniqueId;
        }
    }
    throw new Error(`Failed to generate unique ID for prefix ${prefix}`);
}

async function main() {
    console.log('Starting Property ID Backfill (Raw SQL Mode)...');

    // Fetch properties without uniqueId
    const properties: any[] = await prisma.$queryRaw`SELECT id, location FROM "Property" WHERE "uniqueId" IS NULL`;

    console.log(`Found ${properties.length} properties to update.`);

    for (const property of properties) {
        let cityCode = 'XX';
        const locationLower = property.location?.toLowerCase() || '';

        if (locationLower.includes('ibadan')) {
            cityCode = 'IB';
        } else if (locationLower.includes('lagos')) {
            cityCode = 'LG';
        } else if (locationLower.includes('abuja')) {
            cityCode = 'ABJ';
        }

        const prefix = `APMS${cityCode}`;

        try {
            const uniqueId = await generateUniqueId(prefix);
            await prisma.$executeRaw`UPDATE "Property" SET "uniqueId" = ${uniqueId} WHERE id = ${property.id}`;
            console.log(`Updated Property ${property.id} (${cityCode}) -> ${uniqueId}`);
        } catch (error) {
            console.error(`Failed to update property ${property.id}:`, error);
        }
    }

    console.log('Property Backfill complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
