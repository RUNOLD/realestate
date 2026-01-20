
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Simulating Ticketing & Chat Flow...");

    // 1. Get Seeded Data
    const tenant = await prisma.user.findUnique({ where: { email: "tenant@test.com" } });
    const landlord = await prisma.user.findUnique({ where: { email: "landlord@test.com" } });
    const property = await prisma.property.findUnique({ where: { uniqueId: "PROP001" } });

    if (!tenant || !landlord || !property) {
        throw new Error("Missing seeded data. Run seed-qa.ts first.");
    }

    // 2. Simulate Ticket Creation (Tenant Side)
    const ticket = await prisma.ticket.create({
        data: {
            subject: "Leaking Sink in Bathroom",
            description: "The sink in the master bathroom is leaking from the pipe below.",
            category: "PLUMBING",
            priority: "MEDIUM",
            userId: tenant.id,
            propertyId: property.id,
            landlordId: landlord.id,
            status: "OPEN",
            approvalStatus: "APPROVED" // Simulate auto-approval or staff approval
        }
    });
    console.log("✅ Ticket created:", ticket.id);

    // 3. Simulate Chat Message (Staff/Admin Side)
    // For this simulation, we'll use the Super Admin or just mock a staff reply
    const admin = await prisma.user.findUnique({ where: { email: "admin@ayoolarealestate.com" } });
    if (!admin) throw new Error("Super Admin not found");

    // Staff claims ticket
    await prisma.ticket.update({
        where: { id: ticket.id },
        data: { claimedById: admin.id }
    });
    console.log("✅ Ticket claimed by admin");

    const comment = await prisma.ticketComment.create({
        data: {
            ticketId: ticket.id,
            userId: admin.id,
            content: "Hello! We have received your request. A plumber will be dispatched tomorrow morning."
        },
        include: { user: { select: { name: true, role: true } } }
    });
    console.log("✅ Chat comment added:", comment.content);

    // 4. Verify Pusher Logic (Manual Check of env)
    console.log("ℹ️ Pusher trigger would happen here in the app code.");

    console.log("🚀 Simulation complete.");
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
