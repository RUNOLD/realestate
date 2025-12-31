import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Home,
    Calendar,
    CreditCard,
    Ticket,
    AlertCircle,
    CheckCircle2,
    Clock,
    User
} from "lucide-react";
import { format } from "date-fns";

interface TenantSnapshotProps {
    financials: {
        balance: number;
        totalDue: number;
        totalPaid: number;
        status: string;
        nextRentDate: Date | null;
        openTickets: number;
        totalTickets: number;
        lease: any;
    };
}

export function TenantSnapshot({ financials }: TenantSnapshotProps) {
    const { balance, status, nextRentDate, openTickets, lease } = financials;
    const isOverdue = status === 'OVERDUE' || balance > 0;

    // Calculate days remaining in lease
    const daysRemaining = lease?.endDate
        ? Math.ceil((new Date(lease.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sticky top-0 z-10 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Status Card */}
            <Card className="shadow-sm border-2 border-primary/10">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {isOverdue ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    </div>
                    <div>
                        <p className="text-[11px] uppercase font-black text-foreground/80 tracking-tight">Status</p>
                        <Badge variant={isOverdue ? "destructive" : "default"} className="mt-1 font-bold">
                            {isOverdue ? "Overdue" : "Active"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Property Card */}
            <Card className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Home size={20} />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[11px] uppercase font-black text-foreground/80 tracking-tight">Property</p>
                        <p className="text-base font-black truncate text-foreground">
                            {lease?.property?.title || "No Property"}
                        </p>
                        {lease?.property?.uniqueId && (
                            <p className="text-[9px] font-mono text-muted-foreground truncate">{lease.property.uniqueId}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Rent Card */}
            <Card className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                        <CreditCard size={20} />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase font-black text-foreground/80 tracking-tight">Rent</p>
                        <p className="text-base font-black text-foreground">₦{lease?.rentAmount?.toLocaleString() || 0} <span className="text-[10px] font-medium text-foreground/60">/{lease?.billingCycle?.toLowerCase()}</span></p>
                    </div>
                </CardContent>
            </Card>

            {/* Lease Card */}
            <Card className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase font-extrabold text-foreground tracking-tight">Lease</p>
                        <p className="text-base font-extrabold text-foreground">
                            {daysRemaining !== null
                                ? `${daysRemaining} days left`
                                : "No Expiry"}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Balance Card */}
            <Card className={`shadow-sm ${isOverdue ? 'bg-red-50' : ''}`}>
                <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isOverdue ? 'bg-white text-red-600 border border-red-200 shadow-sm' : 'bg-green-100 text-green-600'}`}>
                        <CreditCard size={20} />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase font-black text-foreground/80 tracking-tight">Balance</p>
                        <p className={`text-base font-black ${isOverdue ? 'text-red-600' : 'text-green-500'}`}>
                            ₦{balance.toLocaleString()}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Tickets Card */}
            <Card className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                        <Ticket size={20} />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase font-black text-foreground/80 tracking-tight">Open Tickets</p>
                        <p className="text-base font-black text-foreground">{openTickets} <span className="text-xs font-medium text-foreground/60">/ {financials.totalTickets}</span></p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
