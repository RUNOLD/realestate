const { PrismaClient } = require('@prisma/client');

async function verifyProvided() {
    const password = '_D5vVMAxx9n-H*V';
    // User provided: aws-1-eu-north-1.pooler.supabase.com
    const url = `postgresql://postgres.iduznqwrpeooswuxjtun:${password}@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true`;

    console.log(`Testing URL: ${url.replace(password, '****')}...`);

    const prisma = new PrismaClient({
        datasources: { db: { url } },
        log: ['info', 'warn', 'error']
    });

    try {
        const count = await prisma.user.count();
        console.log(`✅ SUCCESS! Connected via Provided URL.`);
        console.log(`User Count: ${count}`);
    } catch (e) {
        console.error('❌ FAILED Provided URL');
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}

verifyProvided();
