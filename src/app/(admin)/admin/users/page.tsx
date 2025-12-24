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
        // Default: Show internal staff (exclude tenants)
        where.role = { not: 'TENANT' };
    }

    if (query && query.trim() !== '') {
        where = {
            ...where,
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { phone: { contains: query, mode: 'insensitive' } }
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

    const pageTitle = role === 'TENANT' ? 'Active Tenants' : 'Staff & Admin Management';
    const pageDescription = role === 'TENANT' ? 'Manage your registered tenants.' : 'Manage internal staff and administrators.';

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-card p-6 rounded-lg border border-border shadow-sm">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">{pageTitle}</h1>
                    <p className="text-muted-foreground">{pageDescription}</p>
                </div>
                {role === 'TENANT' ? (
                    <Link href="/admin/tenants/new">
                        <Button className="gap-2">
                            <Plus size={16} /> Add Tenant
                        </Button>
                    </Link>
                ) : (
                    <Link href="/admin/team/new">
                        <Button className="gap-2">
                            <Plus size={16} /> Add Staff
                        </Button>
                    </Link>
                )}
            </div>

            <div className="bg-card rounded-md border text-card-foreground shadow">
                <DataTable columns={columns} data={users as any} searchKey="name" />
            </div>
        </div>
    );
}
