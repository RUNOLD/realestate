const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const regions = [
    'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1',
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3',
    'ap-south-1', 'ap-southeast-1', 'ap-southeast-2',
    'ca-central-1', 'me-south-1', 'sa-east-1', 'af-south-1'
];

async function discover() {
    const password = '_D5vVMAxx9n-H*V';
    const ref = 'iduznqwrpeooswuxjtun';
    let log = '';

    for (const region of regions) {
        const url = `postgresql://postgres.${ref}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
        console.log(`Testing ${region}...`);
        log += `Testing ${region}: `;

        const prisma = new PrismaClient({
            datasources: { db: { url } },
            log: []
        });

        try {
            const count = await Promise.race([
                prisma.user.count(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 4000))
            ]);
            log += `✅ SUCCESS! Count: ${count}\n`;
            console.log(`✅ SUCCESS in ${region}!`);
            fs.writeFileSync('discovery.log', log);
            process.exit(0);
        } catch (e) {
            const msg = e.message.replace(/\n/g, ' ').substring(0, 100);
            log += `❌ ${msg}\n`;
            console.log(`  - ${msg}`);
        } finally {
            await prisma.$disconnect();
        }
        fs.writeFileSync('discovery.log', log);
    }
    console.log('Finished.');
}

discover();
