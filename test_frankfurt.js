const { PrismaClient } = require('@prisma/client');

async function testConnection() {
    const url = 'postgresql://postgres.iduznqwrpeooswuxjtun:_D5vVMAxx9n-H*V@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
    console.log('Testing connection to:', url.replace(/:.*@/, ':****@'));

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: url
            }
        }
    });

    try {
        const count = await prisma.user.count();
        console.log('✅ SUCCESS! User count:', count);
    } catch (e) {
        console.error('❌ FAILED:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
