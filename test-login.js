const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin(email, password) {
    console.log(`Testing login for: ${email}`);
    try {
        const user = await prisma.user.findFirst({
            where: { email: email }
        });

        if (!user) {
            console.log("❌ User not found.");
            return;
        }

        console.log(`✅ User found: ID=${user.id}, Role=${user.role}`);
        console.log(`Stored Hash: ${user.password}`);

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            console.log("✅ Password MATCHES!");
        } else {
            console.log("❌ Password DOES NOT MATCH.");

            // Generate a correct hash for comparison/fixing
            const newHash = await bcrypt.hash(password, 10);
            console.log(`Expected Hash for '${password}': ${newHash}`);
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the test
testLogin('staff@ayoolaproperty.com', 'password123');
