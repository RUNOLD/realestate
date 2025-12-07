import { RegisterTenantForm } from "@/components/dashboard/RegisterTenantForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterTenantPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/users" className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-foreground">Register New Tenant</h1>
                    <p className="text-muted-foreground">Create a new tenant profile. Profile will be pending approval.</p>
                </div>
            </div>

            <RegisterTenantForm />
        </div>
    );
}
