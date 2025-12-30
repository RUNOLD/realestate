"use client";

import { RegisterStaffForm } from "@/components/admin/users/RegisterStaffForm";
import RegisterLandlordForm from "@/components/admin/users/RegisterLandlordForm";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, UserPlus, Briefcase } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddTeamPage() {
    const [activeTab, setActiveTab] = useState<'staff' | 'landlord'>('staff');

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Link href="/admin/team" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> Back to Team
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-primary flex items-center gap-3">
                        <ShieldCheck size={28} className="text-primary/60" />
                        Add New Member
                    </h1>
                    <p className="text-muted-foreground mt-1">Create new accounts for staff, admins, or landlords.</p>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-muted rounded-lg w-fit">
                <Button
                    variant={activeTab === 'staff' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('staff')}
                    className="gap-2"
                >
                    <UserPlus size={16} /> Internal Staff
                </Button>
                <Button
                    variant={activeTab === 'landlord' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('landlord')}
                    className="gap-2"
                >
                    <Briefcase size={16} /> Landlord (External)
                </Button>
            </div>

            <div className="bg-card/50 rounded-xl">
                {activeTab === 'staff' ? (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="mb-6 p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-700">
                            <strong>Note:</strong> Staff members have access to the dashboard to manage tickets and tenants.
                            Admins have full system access.
                        </div>
                        <RegisterStaffForm />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="mb-6 p-4 bg-amber-50/50 border border-amber-100 rounded-lg text-sm text-amber-700">
                            <strong>Note:</strong> Landlords will have restricted access to view their own properties and financials.
                            You can assign properties to them after creation.
                        </div>
                        <RegisterLandlordForm />
                    </div>
                )}
            </div>
        </div>
    );
}
