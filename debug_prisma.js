const { PrismaClient } = require('@prisma/client');

async function debug() {
    const password = '_D5vVMAxx9n-H*V';
    const ref = 'iduznqwrpeooswuxjtun';
    const url = `postgresql://postgres.${ref}:${password}@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true`;

    const prisma = new PrismaClient({
        datasources: { db: { url } }
    });

    try {
        await prisma.user.count();
    } catch (e) {
        console.log('--- ERROR START ---');
        console.log('Name:', e.name);
        console.log('Code:', e.code);
        console.log('Message:', e.message);
        console.log('Meta:', JSON.stringify(e.meta, null, 2));
        console.log('--- ERROR END ---');
    } finally {
        await prisma.$disconnect();
    }
}

debug();
