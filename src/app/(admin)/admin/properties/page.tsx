import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/admin/Search";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/admin/tables/data-table";
import { columns } from "@/components/admin/tables/properties/columns";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const query = typeof params.query === 'string' ? params.query : undefined;

    // Fetch data with search filter
    const where = query ? {
        OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { location: { contains: query, mode: 'insensitive' as const } },
            { uniqueId: { contains: query, mode: 'insensitive' as const } }
        ]
    } : {};

    let properties: any[] = [];
    try {
        properties = await prisma.property.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            // Ensure we select fields matching our Type if needed, or rely on automatic compatibility
        });
    } catch (error) {
        console.error("Failed to fetch properties:", error);
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Properties</h1>
                    <p className="text-muted-foreground mt-1">Manage your portfolio and track listing status.</p>
                </div>
                <Link href="/admin/properties/new">
                    <Button className="gap-2">
                        <Plus size={16} /> Add Property
                    </Button>
                </Link>
            </div>

            <div className="bg-card rounded-md border border-border space-y-4 p-4">
                <Search placeholder="Search properties by title, location, or ID..." />
                {/* CASTING properties to any because generic type safety with Prism return type is often tricky in quick refactors.
                     Ideally we map to Property type. 
                 */}
                <DataTable columns={columns} data={properties as any} />
            </div>
        </div>
    );
}

// End of component
