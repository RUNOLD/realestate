const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function testPooler() {
    const password = '_D5vVMAxx9n-H*V';
    const ref = 'iduznqwrpeooswuxjtun';
    const region = 'eu-north-1';

    const urls = [
        `postgresql://postgres.${ref}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`,
        `postgresql://postgres:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`,
        `postgresql://postgres.${ref}:${password}@aws-0-${region}.pooler.supabase.com:5432/postgres?pgbouncer=true`,
        `postgresql://postgres.${ref}:${password}@aws-1-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`,
    ];

    let results = '';

    for (const url of urls) {
        results += `Testing URL: ${url.replace(password, '****')}\n`;
        const prisma = new PrismaClient({
            datasources: { db: { url } }
        });

        try {
            const count = await Promise.race([
                prisma.user.count(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 10000))
            ]);
            results += `✅ SUCCESS! User count: ${count}\n`;
            fs.writeFileSync('test_stockholm.log', results);
            console.log('✅ SUCCESS!');
            process.exit(0);
        } catch (e) {
            results += `  - Error: ${e.message.replace(/\n/g, ' ').substring(0, 150)}\n`;
        } finally {
            await prisma.$disconnect();
        }
    }
    results += '❌ All failed.\n';
    fs.writeFileSync('test_stockholm.log', results);
    process.exit(1);
}

testPooler();
