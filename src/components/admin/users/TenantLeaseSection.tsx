import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Home,
    Calendar,
    Download,
    TrendingUp,
    AlertCircle,
    Info,
    User,
    ShieldCheck,
    Coins
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface TenantLeaseSectionProps {
    lease: any;
}

export function TenantLeaseSection({ lease }: TenantLeaseSectionProps) {
    if (!lease) {
        return (
            <Card className="border-dashed">
                <CardContent className="p-8 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <Home size={24} />
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold">No Active Lease</p>
                        <p className="text-sm text-muted-foreground">This tenant is not currently assigned to any property.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const { property, rentAmount, billingCycle, startDate, endDate, isActive } = lease;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Home className="text-primary" size={24} />
                        Current Tenancy
                    </CardTitle>
                    <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? "Active" : "Terminated"}
                    </Badge>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Lease Specifics */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-muted-foreground text-sm flex items-center gap-2"><Home size={16} /> Property</span>
                                <div className="text-right">
                                    <p className="font-bold">{property.title}</p>
                                    <p className="text-[10px] font-mono text-muted-foreground">{property.uniqueId || property.id}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-muted-foreground text-sm flex items-center gap-2"><User size={16} /> Landlord</span>
                                <div className="text-right">
                                    <p className="font-bold">{property.owner?.name || "N/A"}</p>
                                    <p className="text-[10px] font-mono text-muted-foreground">{property.owner?.uniqueId || property.owner?.id || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-muted-foreground text-sm flex items-center gap-2"><Info size={16} /> Unit/Address</span>
                                <span className="font-medium text-right text-sm max-w-[200px]">{property.location}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-muted-foreground text-sm flex items-center gap-2"><Coins size={16} /> Service Charge</span>
                                <span className="font-bold">₦{(property.serviceCharge || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-muted-foreground text-sm flex items-center gap-2"><ShieldCheck size={16} /> Caution Deposit</span>
                                <span className="font-bold">₦{(property.cautionDeposit || 0).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Timeline and Agreement */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-muted-foreground text-sm flex items-center gap-2"><TrendingUp size={16} /> Rent Amount</span>
                                <span className="font-bold">₦{rentAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-muted-foreground text-sm flex items-center gap-2"><Calendar size={16} /> Frequency</span>
                                <span className="font-medium uppercase text-xs bg-muted px-2 py-0.5 rounded">{billingCycle}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-muted-foreground text-sm">Lease Start</span>
                                <span className="font-medium">{format(new Date(startDate), 'PPP')}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-muted-foreground text-sm">Lease End</span>
                                <span className="font-medium">
                                    {endDate ? format(new Date(endDate), 'PPP') : "Indefinite"}
                                </span>
                            </div>
                            <div className="pt-2">
                                <Button variant="outline" className="w-full gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5">
                                    <FileText size={18} />
                                    Download Tenancy Agreement
                                    <Download size={14} className="ml-auto" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <div className="text-sm">
                    <p className="font-bold text-blue-900">Lease Terms</p>
                    <p className="text-blue-800">Tenant is bound by the rules of {property.title}. Any modifications to the rent must be logged via the Rent Modification tool.</p>
                </div>
            </div>
        </div>
    );
}
