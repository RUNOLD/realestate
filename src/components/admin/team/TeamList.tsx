'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, Shield, Eye, Briefcase, Building, Phone, Mail } from "lucide-react";
import Link from 'next/link';

interface StaffMember {
    id: string;
    uniqueId: string | null;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
    phone: string | null;
}

interface Landlord {
    id: string;
    uniqueId: string | null;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
    phone: string | null;
    landlordProfile: {
        landlordType: string | null;
        relationshipToProperty: string | null;
        residentialAddress: string | null;
    } | null;
}

interface TeamListProps {
    staff: StaffMember[];
    landlords: Landlord[];
}

export function TeamList({ staff, landlords }: TeamListProps) {
    const [activeTab, setActiveTab] = useState<'staff' | 'landlord'>('staff');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex p-1 bg-muted rounded-lg w-fit">
                    <Button
                        variant={activeTab === 'staff' ? 'ghost' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('staff')}
                        className={`gap-2 ${activeTab === 'staff' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                    >
                        <UserPlus size={16} /> Internal Staff ({staff.length})
                    </Button>
                    <Button
                        variant={activeTab === 'landlord' ? 'ghost' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('landlord')}
                        className={`gap-2 ${activeTab === 'landlord' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                    >
                        <Briefcase size={16} /> Landlords ({landlords.length})
                    </Button>
                </div>

                <Link href="/admin/team/new">
                    <Button className="gap-2">
                        <UserPlus size={16} /> Add Member
                    </Button>
                </Link>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden animate-in fade-in duration-300">
                <div className="p-6 border-b border-border">
                    <h3 className="font-bold text-lg">
                        {activeTab === 'staff' ? "Customer Service & Office Staff" : "Landlord Partners"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {activeTab === 'staff'
                            ? "Accounts created in this section have restricted permissions limited to day-to-day operations. They will have full visibility of dashboards to assist with inquiries."
                            : "External partners who own managed properties. They have restricted access to view their specific properties and financial reports."}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Contact</th>
                                {activeTab === 'landlord' ? (
                                    <>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Relationship</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3">Permissions</th>
                                    </>
                                )}
                                <th className="px-6 py-3">Joined</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {activeTab === 'staff' ? (
                                staff.length === 0 ? (
                                    <EmptyRow type="staff" />
                                ) : (
                                    staff.map((member) => (
                                        <tr key={member.id} className="bg-card hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {member.name ? member.name.charAt(0).toUpperCase() : 'S'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{member.name}</div>
                                                        <div className="text-xs text-muted-foreground">{member.uniqueId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail size={12} className="text-muted-foreground" />
                                                        {member.email}
                                                    </div>
                                                    {member.phone && (
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Phone size={12} />
                                                            {member.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex w-fit items-center gap-1 
                                                    ${member.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
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
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/users/${member.id}`}>View</Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            ) : (
                                landlords.length === 0 ? (
                                    <EmptyRow type="landlord" />
                                ) : (
                                    landlords.map((landlord) => (
                                        <tr key={landlord.id} className="bg-card hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                                                        {landlord.name ? landlord.name.charAt(0).toUpperCase() : 'L'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{landlord.name}</div>
                                                        <div className="text-xs text-muted-foreground">{landlord.uniqueId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail size={12} className="text-muted-foreground" />
                                                        {landlord.email}
                                                    </div>
                                                    {landlord.phone && (
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Phone size={12} />
                                                            {landlord.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Building size={14} className="text-muted-foreground" />
                                                    {landlord.landlordProfile?.landlordType || 'Individual'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {landlord.landlordProfile?.relationshipToProperty || 'Owner'}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {new Date(landlord.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/users/${landlord.id}`}>View</Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function EmptyRow({ type }: { type: 'staff' | 'landlord' }) {
    return (
        <tr>
            <td colSpan={6} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
                        {type === 'staff' ? <UserPlus size={24} /> : <Briefcase size={24} />}
                    </div>
                    <p className="font-medium">No {type === 'staff' ? 'staff members' : 'landlords'} found.</p>
                    <p className="text-sm">Get started by adding a new {type === 'staff' ? 'team member' : 'partner'}.</p>
                </div>
            </td>
        </tr>
    );
}
