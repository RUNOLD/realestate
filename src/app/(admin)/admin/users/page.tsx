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
    const { role, query } = await searchParams;

    // Logic: If role param is present, filter by it (e.g. ?role=TENANT).
    // If NO role param, show "Staff & Admin" (exclude TENANT).
    let where: any = role
        ? { role: role.toUpperCase() as any }
        : { role: { not: 'TENANT' } };

    if (query) {
        where = {
            ...where,
            OR: [
                { name: { contains: query } },
                { email: { contains: query } }
            ]
        };
    }

    let users: any[] = [];
    try {
        users = await prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100 // Limit for safety
        });
    } catch (e) {
        console.error(e);
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
                    <Link href="/admin/users/new">
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
