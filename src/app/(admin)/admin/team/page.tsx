import { prisma } from "@/lib/prisma";
import { TeamList } from "@/components/admin/team/TeamList";

export default async function AdminTeamPage() {
    const [staff, landlords] = await Promise.all([
        prisma.user.findMany({
            where: {
                role: {
                    in: ['STAFF', 'ADMIN']
                }
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                uniqueId: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                phone: true,
            }
        }),
        prisma.user.findMany({
            where: { role: 'LANDLORD' },
            orderBy: { createdAt: 'desc' },
            include: {
                landlordProfile: {
                    select: {
                        landlordType: true,
                        relationshipToProperty: true,
                        residentialAddress: true,
                    }
                }
            }
        })
    ]);

    // Transform landlords to match the interface if needed, or just let TS infer
    const formattedLandlords = landlords.map(l => ({
        id: l.id,
        uniqueId: l.uniqueId,
        name: l.name,
        email: l.email,
        role: l.role,
        createdAt: l.createdAt,
        phone: l.phone,
        landlordProfile: l.landlordProfile
    }));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-primary">Team Management</h1>
                <p className="text-muted-foreground mt-1">Manage access for your support team and landlord partners.</p>
            </div>

            <TeamList staff={staff} landlords={formattedLandlords} />
        </div>
    );
}
