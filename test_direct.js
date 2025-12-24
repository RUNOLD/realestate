const { PrismaClient } = require('@prisma/client');

async function testDirect() {
    const password = '_D5vVMAxx9n-H*V';
    const ref = 'iduznqwrpeooswuxjtun';
    const url = `postgresql://postgres:${password}@db.${ref}.supabase.co:5432/postgres`;

    console.log(`Testing Direct Connection to ${ref}...`);

    const prisma = new PrismaClient({
        datasources: { db: { url } },
        log: ['query', 'info', 'warn', 'error']
    });

    try {
        const count = await prisma.user.count();
        console.log(`✅ SUCCESS! Connected via Direct URL.`);
        console.log(`User Count: ${count}`);
    } catch (e) {
        console.error('❌ FAILED Direct Connection');
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}

testDirect();
