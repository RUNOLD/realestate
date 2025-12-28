import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search } from "@/components/admin/Search";
import { DataTable } from "@/components/admin/tables/data-table";
import { columns } from "@/components/admin/tables/users/columns";
import { Plus } from "lucide-react";

interface PageProps {
    searchParams: Promise<{ role?: string; query?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
    const { role: roleParam, query: queryParam } = await searchParams;
    const role = Array.isArray(roleParam) ? roleParam[0] : roleParam;
    const query = Array.isArray(queryParam) ? queryParam[0] : queryParam;

    // Build the where clause
    let where: any = {};

    if (role) {
        where.role = role.toUpperCase() as any;
    } else {
        // Default: Show internal staff (exclude tenants and landlords)
        where.role = { in: ['ADMIN', 'STAFF'] };
    }

    if (query && query.trim() !== '') {
        where = {
            ...where,
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { phone: { contains: query, mode: 'insensitive' } },
                { uniqueId: { contains: query, mode: 'insensitive' } },
            ]
        };
    }

    let users: any[] = [];
    try {
        users = await prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100
        });
    } catch (e) {
        console.error("PRISMA ERROR in AdminUsersPage:", e);
        // We still want the page to load, just with empty data.
    }

    let pageTitle = 'Staff & Admin Management';
    let pageDescription = 'Manage internal staff and administrators.';
    let addButton = (
        <Link href="/admin/team/new">
            <Button className="gap-2">
                <Plus size={16} /> Add Staff
            </Button>
        </Link>
    );

    if (role === 'TENANT') {
        pageTitle = 'Active Tenants';
        pageDescription = 'Manage your registered tenants.';
        addButton = (
            <Link href="/admin/tenants/new">
                <Button className="gap-2">
                    <Plus size={16} /> Add Tenant
                </Button>
            </Link>
        );
    } else if (role === 'LANDLORD') {
        pageTitle = 'Landlord Directory';
        pageDescription = 'Manage property owners and landlords.';
        addButton = (
            <Link href="/admin/landlords/new">
                <Button className="gap-2">
                    <Plus size={16} /> Add Landlord
                </Button>
            </Link>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-card p-6 rounded-lg border border-border shadow-sm">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">{pageTitle}</h1>
                    <p className="text-muted-foreground">{pageDescription}</p>
                </div>
                {addButton}
            </div>

            <div className="bg-card rounded-md border text-card-foreground shadow space-y-4 p-4">
                <Search placeholder="Search users by name, email, or ID..." />
                <DataTable columns={columns} data={users as any} />
            </div>
        </div>
    );
}
