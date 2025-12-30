import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    let logOutput = "";
    const log = (msg: string) => {
        console.log(msg);
        logOutput += msg + "\n";
    };

    log("--- Environment Check ---");
    log(`NODE_ENV: ${process.env.NODE_ENV}`);
    log(`AUTH_SECRET exists: ${!!process.env.AUTH_SECRET}`);
    log(`NEXTAUTH_SECRET exists: ${!!process.env.NEXTAUTH_SECRET}`);
    log(`POSTGRES_PRISMA_URL exists: ${!!process.env.POSTGRES_PRISMA_URL}`);
    log(`DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
    log(`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME exists: ${!!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`);
    log(`CLOUDINARY_API_KEY exists: ${!!process.env.CLOUDINARY_API_KEY}`);
    log(`CLOUDINARY_API_SECRET exists: ${!!process.env.CLOUDINARY_API_SECRET}`);
    log(`RESEND_API_KEY exists: ${!!process.env.RESEND_API_KEY}`);

    log("\n--- Database Connection Check ---");
    try {
        const userCount = await prisma.user.count();
        log(`Successfully connected to Database. User count: ${userCount}`);

        // Log the first user's email/phone to check if our login query would work (privacy safe-ish)
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
            log(`First user found: ${firstUser.email || firstUser.phone} (Role: ${firstUser.role})`);
        } else {
            log("No users found in database.");
        }

    } catch (e) {
        log(`Database connection failed: ${e}`);
    } finally {
        await prisma.$disconnect();
        fs.writeFileSync('env-check.log', logOutput);
    }
}

main();
