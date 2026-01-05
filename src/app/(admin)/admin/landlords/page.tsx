
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Shield, Info, Eye, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Search } from "@/components/admin/Search";

interface PageProps {
    searchParams: Promise<{ query?: string }>;
}

export default async function AdminLandlordsPage({ searchParams }: PageProps) {
    const { query } = await searchParams;

    const where: any = { role: 'LANDLORD' };

    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
            { uniqueId: { contains: query, mode: 'insensitive' } }
        ];
    }

    const landlords = await prisma.user.findMany({
        where,
        include: {
            // @ts-ignore: ownedProperties exists in schema but client might be stale during build
            ownedProperties: {
                select: { id: true, title: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Landlord Management</h1>
                    <p className="text-muted-foreground mt-1">Manage property owners and view their portfolios.</p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/admin/landlords/new">
                        <UserPlus size={16} /> Add Landlord
                    </Link>
                </Button>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="font-bold text-lg">Property Owners</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        List of all registered landlords. Click on a landlord's name to view their full profile and managed properties.
                    </p>
                </div>

                <div className="p-4 border-b border-border">
                    <Search placeholder="Search landlords by name, email, or ID..." />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3">Properties Owned</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {landlords.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                                <Building2 size={24} />
                                            </div>
                                            <p className="font-medium">No landlords added yet.</p>
                                            <p className="text-sm">Create a landlord account to assign properties.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                landlords.map((landlord) => (
                                    <tr key={landlord.id} className="bg-card hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {landlord.name ? landlord.name.charAt(0).toUpperCase() : 'L'}
                                                </div>
                                                {landlord.name}
                                                <span className="ml-2 text-xs text-muted-foreground font-mono">({landlord.uniqueId || 'No ID'})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{landlord.email}</td>
                                        <td className="px-6 py-4">{landlord.phone || "-"}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="secondary" className="font-mono">
                                                {landlord.ownedProperties.length}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/users/${landlord.id}`}>
                                                    View Details
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
