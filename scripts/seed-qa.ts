
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding QA Data...");

    const hashedPassword = await bcrypt.hash("password123", 10);

    // 1. Create Landlord
    const landlord = await prisma.user.upsert({
        where: { email: "landlord@test.com" },
        update: {},
        create: {
            name: "Test Landlord",
            email: "landlord@test.com",
            password: hashedPassword,
            role: "LANDLORD",
            status: "ACTIVE",
            uniqueId: "LL001",
            landlordProfile: {
                create: {
                    landlordType: "INDIVIDUAL",
                    residentialAddress: "123 Landlord Lane",
                    bankName: "Test Bank",
                    accountName: "Test Landlord",
                    accountNumber: "1234567890",
                    isConsentGiven: true
                }
            }
        }
    });
    console.log("✅ Landlord created:", landlord.email);

    // 2. Create Property
    const property = await prisma.property.upsert({
        where: { uniqueId: "PROP001" },
        update: {},
        create: {
            title: "Test Luxury Apartment",
            description: "A beautiful test apartment for QA purposes.",
            location: "Lekki, Lagos",
            price: 5000000,
            type: "APARTMENT",
            status: "AVAILABLE",
            uniqueId: "PROP001",
            ownerId: landlord.id,
            bedrooms: 3,
            bathrooms: 3,
            sqft: 1500
        }
    });
    console.log("✅ Property created:", property.title);

    // 3. Create Tenant
    const tenant = await prisma.user.upsert({
        where: { email: "tenant@test.com" },
        update: {},
        create: {
            name: "Test Tenant",
            email: "tenant@test.com",
            password: hashedPassword,
            role: "TENANT",
            status: "ACTIVE",
            uniqueId: "TN001",
            tenantProfile: {
                create: {
                    nationality: "Nigerian",
                    residentialAddress: "456 Tenant Ave",
                    agreedToTerms: true
                }
            }
        }
    });
    console.log("✅ Tenant created:", tenant.email);

    // 4. Create Lease
    const lease = await prisma.lease.create({
        data: {
            userId: tenant.id,
            propertyId: property.id,
            rentAmount: 5000000,
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            isActive: true,
            billingCycle: "YEARLY"
        }
    });
    console.log("✅ Lease created for property:", property.title);

    console.log("🚀 QA Seeding complete.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
