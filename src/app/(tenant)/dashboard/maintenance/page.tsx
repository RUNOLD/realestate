import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MaintenanceContent } from "@/app/(tenant)/dashboard/maintenance/MaintenanceContent";

export default async function MaintenancePage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const tickets = await prisma.ticket.findMany({
        where: { userId: session.user.id },
        include: {
            comments: {
                orderBy: { createdAt: "asc" },
                include: {
                    user: {
                        select: { name: true, role: true, id: true }
                    }
                }
            }
        },
        orderBy: { updatedAt: "desc" },
    });

    return (
        <MaintenanceContent
            initialTickets={tickets}
            userId={session.user.id}
        />
    );
}
