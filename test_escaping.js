const { PrismaClient } = require('@prisma/client');

async function testConnection() {
    const passwordRaw = '_D5vVMAxx9n-H*V';
    const passwordEscaped = '_D5vVMAxx9n-H%2AV';
    const ref = 'iduznqwrpeooswuxjtun';
    const region = 'eu-north-1';

    const passwords = [passwordRaw, passwordEscaped];

    for (const pw of passwords) {
        const url = `postgresql://postgres.${ref}:${pw}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
        console.log(`Testing with password format: ${pw}`);

        const prisma = new PrismaClient({
            datasources: { db: { url } }
        });

        try {
            const count = await prisma.user.count();
            console.log(`✅ SUCCESS! User count: ${count}`);
            process.exit(0);
        } catch (e) {
            console.log(`  - Failed: ${e.message.split('Error querying the database:')[1] || e.message.split('\n')[0]}`);
        } finally {
            await prisma.$disconnect();
        }
    }
}

testConnection();
