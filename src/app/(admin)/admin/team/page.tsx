import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Shield, Info, Eye } from "lucide-react";

export default async function AdminTeamPage() {
    const staff = await prisma.user.findMany({
        where: { role: 'STAFF' },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Team Management</h1>
                    <p className="text-muted-foreground mt-1">Manage access for your support and operations team.</p>
                </div>
                <Link href="/admin/team/new">
                    <Button className="gap-2">
                        <UserPlus size={16} /> Add Staff
                    </Button>
                </Link>
            </div>

            {/* Info Card based on User Request */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-6 flex gap-4">
                <div className="p-2 bg-blue-100 rounded-full h-fit text-blue-600">
                    <Info size={24} />
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-blue-900">Grants access to operational data required to answer customer queries.</h3>
                    <p className="text-sm text-blue-800">
                        This includes viewing rights for:
                    </p>
                    <ul className="list-disc list-inside text-sm text-blue-800 ml-2 space-y-1">
                        <li>Properties & Tenants</li>
                        <li>Open Tickets & Maintenance Requests</li>
                        <li>Recent Transactions & Customer Details</li>
                    </ul>
                </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="font-bold text-lg">Customer Service & Office Staff</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Accounts created in this section have restricted permissions limited to day-to-day operations. They will have full visibility of dashboards (Properties, Tenants, Tickets, Transactions, and Maintenance) to assist with inquiries, without access to high-level admin configurations.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Permissions</th>
                                <th className="px-6 py-3">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {staff.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                                <UserPlus size={24} />
                                            </div>
                                            <p className="font-medium">No staff members added yet.</p>
                                            <p className="text-sm">Add your customer service and office staff here.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                staff.map((member) => (
                                    <tr key={member.id} className="bg-card hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {member.name ? member.name.charAt(0).toUpperCase() : 'S'}
                                                </div>
                                                {member.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{member.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex w-fit items-center gap-1">
                                                <Shield size={12} /> {member.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Eye size={14} /> Viewer Access
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(member.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-yellow-50/50 border-t border-yellow-100 text-xs text-yellow-800 flex items-center gap-2">
                    <Info size={14} />
                    Note: Users added here are restricted to a 'Viewer' role. They can access all data necessary for handling customer inquiries (Properties, Tenants, Financials, and Support Tickets) but are restricted from deleting data or changing system-wide settings.
                </div>
            </div>
        </div>
    );
}
