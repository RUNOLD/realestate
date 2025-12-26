const fs = require('fs');
const path = require('path');

console.log("--- Environment Variable Verification ---");

// Try to manually read .env if process.env is empty (helper for debugging)
try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        console.log("✅ .env file found at: " + envPath);
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, val] = line.split('=');
            if (key) {
                process.env[key.trim()] = val ? val.trim() : '';
            }
        });
        console.log("ℹ️  Manually loaded .env for this script check.");
    } else {
        console.error("❌ .env file NOT found at: " + envPath);
    }
} catch (e) {
    console.error("⚠️  Error reading .env file:", e.message);
}

const REQUIRED_KEYS = [
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
];

let hasError = false;

REQUIRED_KEYS.forEach(key => {
    const value = process.env[key];
    if (value && value.length > 0) {
        console.log(`✅ ${key}: Found (Length: ${value.length})`);
    } else {
        console.log(`❌ ${key}: MISSING or Empty`);
        hasError = true;
    }
});

if (hasError) {
    console.log("\n⚠️  Configuration Issue Detected!");
    console.log("Please ensure your .env file contains exactly these keys.");
    console.log("Restart your server after editing .env.");
} else {
    console.log("\n✅ All Cloudinary keys appear to be present.");
}
