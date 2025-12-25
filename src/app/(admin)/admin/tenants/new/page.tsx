import { RegisterTenantForm } from "@/components/admin/users/RegisterTenantForm";
import Link from "next/link";
import { ChevronLeft, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddTenantPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Link href="/admin/users?role=TENANT" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> Back to Tenants
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-primary flex items-center gap-3">
                        <UserPlus size={28} className="text-primary/60" />
                        Add New Tenant
                    </h1>
                    <p className="text-muted-foreground mt-1">Register a new tenant in the system. They will be able to log in with their email and password.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <RegisterTenantForm />
            </div>
        </div>
    );
}
