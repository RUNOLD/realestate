const fs = require('fs');
const path = require('path');

// Target .env in the project root (one level up from scripts/)
const envPath = path.resolve(__dirname, '..', '.env');
const key = 'RESEND_API_KEY';
const value = 're_PUfi6scH_6uFm9kynVTtjxdMLdzLEVgp1';

console.log(`Updating .env at: ${envPath}`);

try {
    let content = '';
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
    } else {
        console.log('.env file not found, creating new one.');
    }

    // Split by newline and filter out any existing RESEND_API_KEY lines
    const lines = content.split(/\r?\n/);
    const newLines = lines.filter(line => !line.trim().startsWith(key + '='));

    // Append the new key
    newLines.push(`${key}=${value}`);

    fs.writeFileSync(envPath, newLines.join('\n').trim() + '\n');
    console.log('Updated .env successfully');

    // Verify read
    const check = fs.readFileSync(envPath, 'utf8');
    if (check.includes(value)) {
        console.log('Verification: Key is present.');
    } else {
        console.error('Verification: Key NOT found after write!');
        process.exit(1);
    }

} catch (e) {
    console.error('Failed to update .env:', e);
    process.exit(1);
}
