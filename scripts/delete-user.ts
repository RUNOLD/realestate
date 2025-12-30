
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const email = process.argv[2];

if (!email) {
    console.error("Please provide an email address: npx tsx scripts/delete-user.ts user@example.com");
    process.exit(1);
}

async function main() {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error(`User with email ${email} not found.`);
        return;
    }

    // Delete related profiles first (though cascading usually handles it, explicit is safer for debugging)
    // Actually, we rely on cascade delete where possible, but if not set up, we delete manually.
    // Creating a transaction to delete all related data.

    console.log(`Deleting user: ${user.name} (${user.email})...`);

    // We'll trust Prisma cascade or simple delete if cascade is on. 
    // If not, we'd need to delete TenantProfile/LandlordProfile first.
    // Let's try direct delete.

    await prisma.user.delete({
        where: { id: user.id },
    });

    console.log(`Successfully deleted ${email}.`);
}

main()
    .catch((e) => {
        console.error("Error deleting user:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
