const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function testPooler() {
    const password = '_D5vVMAxx9n-H*V';
    const ref = 'iduznqwrpeooswuxjtun';
    const region = 'eu-west-2';

    const urls = [
        `postgresql://postgres.${ref}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`,
        `postgresql://postgres:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`
    ];

    let results = '';

    for (const url of urls) {
        results += `Testing URL: ${url.replace(password, '****')}\n`;
        const prisma = new PrismaClient({
            datasources: { db: { url } }
        });

        try {
            const count = await prisma.user.count();
            results += `✅ SUCCESS! User count: ${count}\n`;
            fs.writeFileSync('test_results.log', results);
            process.exit(0);
        } catch (e) {
            results += `  - Error Name: ${e.name}\n`;
            results += `  - Error Code: ${e.code}\n`;
            results += `  - Error Message: ${e.message.replace(/\n/g, ' ')}\n`;
        } finally {
            await prisma.$disconnect();
        }
    }
    results += '❌ All failed.\n';
    fs.writeFileSync('test_results.log', results);
    process.exit(1);
}

testPooler();
