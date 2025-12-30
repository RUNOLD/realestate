
import RegisterLandlordForm from "@/components/admin/users/RegisterLandlordForm";
import Link from "next/link";
import { ChevronLeft, Building2 } from "lucide-react";

export default function NewLandlordPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Link href="/admin/landlords" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> Back to Landlords
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-primary flex items-center gap-3">
                        <Building2 size={28} className="text-primary/60" />
                        Add New Landlord
                    </h1>
                    <p className="text-muted-foreground mt-1">Create a new landlord account to assign properties and manage portfolios.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <RegisterLandlordForm />
            </div>
        </div>
    );
}
