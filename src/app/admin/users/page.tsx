import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Edit, Trash2, Mail, Shield, ExternalLink } from "lucide-react";

interface PageProps {
    searchParams: Promise<{ role?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
    const { role } = await searchParams;

    // If specific role requested (e.g. TENANT), show that.
    // If NO role requested (default "Users" view), EXCLUDE tenants to show only Staff/Admins.
    const where = role
        ? { role: role.toUpperCase() as any }
        : { role: { not: 'TENANT' } };

    const users = await prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    const pageTitle = role === 'TENANT' ? 'Active Tenants' : 'Staff & Admin Management';
    const pageDescription = role === 'TENANT' ? 'Manage your registered tenants.' : 'Manage internal staff and administrators.';

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">{pageTitle}</h1>
                    <p className="text-muted-foreground">{pageDescription}</p>
                </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Joined</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="bg-card hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            <div className="flex items-center gap-3">
                                                <Link href={`/admin/users/${user.id}`} className="hover:underline flex items-center gap-3 w-full">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    {user.name || 'Unknown User'}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex w-fit items-center gap-1 ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'TENANT' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                <Shield size={12} /> {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex flex-col gap-1 text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} /> {user.email}
                                            </div>
                                            {user.status === 'PENDING' && (
                                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                                                    Pending Approval
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/users/${user.id}`}>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                        <ExternalLink size={16} />
                                                    </Button>
                                                </Link>
                                            </div>
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
