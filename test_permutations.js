const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function testPermutations() {
    const ref = 'iduznqwrpeooswuxjtun';
    const region = 'eu-north-1';
    const host = `aws-0-${region}.pooler.supabase.com`;
    const passwords = ['_D5vVMAxx9n-H*V', '_D5vVMAxx9n-H%2AV'];
    const users = [`postgres.${ref}`, ref, 'postgres'];
    const ports = ['6543', '5432'];
    const dbs = ['postgres', ref];

    let log = '--- Stockholm Permutation Log ---\n';
    console.log('Starting Stockholm permutation test...');

    for (const pw of passwords) {
        for (const user of users) {
            for (const port of ports) {
                for (const db of dbs) {
                    const url = `postgresql://${user}:${pw}@${host}:${port}/${db}${port === '6543' ? '?pgbouncer=true' : ''}`;
                    const displayUrl = url.replace(pw, '****');
                    console.log(`Testing: ${displayUrl}`);
                    log += `Testing: ${displayUrl}\n`;

                    const prisma = new PrismaClient({
                        datasources: { db: { url } }
                    });

                    try {
                        const count = await Promise.race([
                            prisma.user.count(),
                            new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 4000))
                        ]);
                        console.log(`[OK] SUCCESS! Count: ${count}`);
                        log += `[OK] SUCCESS! Count: ${count}\n`;
                        fs.writeFileSync('permutation_success.log', url);
                        process.exit(0);
                    } catch (e) {
                        const msg = e.message.split('Error querying the database:')[1] || e.message.split('\n')[0];
                        console.log(`[FAIL] ${msg.trim()}`);
                        log += `[FAIL] ${msg.trim()}\n`;
                    } finally {
                        await prisma.$disconnect();
                    }
                }
            }
        }
    }
    console.log('Finished all permutations.');
    fs.writeFileSync('permutation_results.log', log);
}

testPermutations();
