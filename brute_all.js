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
        // Try aws-0 and aws-1
        for (const cluster of ['aws-0', 'aws-1']) {
            const url = `postgresql://postgres.${ref}:${password}@${cluster}-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
            console.log(`Testing ${cluster}-${region}...`);

            const prisma = new PrismaClient({
                datasources: { db: { url } },
                log: []
            });

            try {
                const count = await Promise.race([
                    prisma.user.count(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 5000))
                ]);
                console.log(`\n\n✅ SUCCESS in ${cluster}-${region}! Count: ${count}`);
                fs.writeFileSync('brute_success.log', url);
                process.exit(0);
            } catch (e) {
                const msg = e.message.replace(/\n/g, ' ').substring(0, 50);
                console.log(`  - ${msg}`);
            } finally {
                await prisma.$disconnect();
            }
        }
    }
    console.log('Finished.');
}

discover();
