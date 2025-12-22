const { execSync } = require('child_process');

const regions = [
    'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1',
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3',
    'ap-south-1', 'ap-southeast-1', 'ap-southeast-2',
    'ca-central-1', 'me-south-1', 'sa-east-1', 'af-south-1'
];

console.log('--- Regional Probe ---');
for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    try {
        // Use nslookup to see if it has an A record (IPv4)
        const output = execSync(`nslookup ${host}`).toString();
        if (output.includes('Addresses:') || output.includes('Address:')) {
            console.log(`[OK] ${region} - Reachable`);
        } else {
            console.log(`[  ] ${region} - No IPv4`);
        }
    } catch (e) {
        console.log(`[FAIL] ${region}`);
    }
}
