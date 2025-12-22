const { PrismaClient } = require('@prisma/client');

const regions = [
    'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1',
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3',
    'ap-south-1', 'ap-southeast-1', 'ap-southeast-2',
    'ca-central-1', 'me-south-1', 'sa-east-1', 'af-south-1'
];

async function testRegions() {
    const password = '_D5vVMAxx9n-H*V';
    const ref = 'iduznqwrpeooswuxjtun';

    for (const region of regions) {
        // We try the common username formats: 'postgres' and 'postgres.[ref]'
        const usernames = [`postgres.${ref}`, 'postgres'];

        for (const user of usernames) {
            const url = `postgresql://${user}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
            console.log(`Testing region: ${region} with user: ${user}...`);

            const prisma = new PrismaClient({
                datasources: { db: { url } },
                log: []
            });

            try {
                // Use a very short timeout
                const result = await Promise.race([
                    prisma.user.count(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                ]);
                console.log(`\n\n✅ SUCCESS!`);
                console.log(`Region: ${region}`);
                console.log(`User: ${user}`);
                console.log(`URL: ${url}`);
                console.log(`User count:`, result);
                process.exit(0);
            } catch (e) {
                const msg = e.message.split('\n')[0];
                console.log(`  - Failed: ${msg}`);
            } finally {
                await prisma.$disconnect();
            }
        }
    }
    console.log('❌ All regions/users failed.');
}

testRegions().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
