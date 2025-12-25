import { RegisterStaffForm } from "@/components/admin/users/RegisterStaffForm";
import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";

export default function AddStaffPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Link href="/admin/team" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> Back to Team
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-primary flex items-center gap-3">
                        <ShieldCheck size={28} className="text-primary/60" />
                        Add Team Member
                    </h1>
                    <p className="text-muted-foreground mt-1">Create a new staff or admin account to help manage your properties and portfolio.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <RegisterStaffForm />
            </div>
        </div>
    );
}
