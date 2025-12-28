
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Banknote, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function LandlordFinancialsPage() {
    const session = await auth();
    if (!session?.user) return null;

    const properties = await prisma.property.findMany({
        where: { ownerId: session.user.id },
        include: {
            payments: {
                orderBy: { createdAt: 'desc' },
                where: { approvalStatus: 'APPROVED' },
                include: { user: true }
            }
        }
    });

    // property.payments type needs handling if implicit
    const allPayments = properties
        // @ts-ignore
        .flatMap(p => p.payments.map(pay => ({
            ...pay,
            propertyTitle: p.title,
            tenantName: pay.user?.name || 'Unknown'
        })))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const totalRevenue = allPayments.reduce((sum, pay) => sum + pay.amount, 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">Financial Report</h1>
                    <p className="text-muted-foreground">Comprehensive view of your rental income.</p>
                </div>
                {/* Placeholder for export functionality */}
                <Button variant="outline" className="gap-2 bg-card border-border hover:bg-muted font-medium text-foreground">
                    <Download size={16} /> Export CSV
                </Button>
            </div>

            {/* Summary Card */}
            <Card className="bg-card border-border shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Revenue Collected</CardTitle>
                    <Banknote className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-foreground">₦{totalRevenue.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground mt-1">Lifetime earnings from all properties</p>
                </CardContent>
            </Card>

            {/* Payments List */}
            <Card className="bg-card border-border shadow-lg">
                <CardHeader className="border-b border-border/50 pb-4 bg-muted/20">
                    <CardTitle className="text-lg font-bold text-foreground">Transaction History</CardTitle>
                    <CardDescription>All approved payments.</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 p-0">
                    <div className="divide-y divide-border/50">
                        {allPayments.length > 0 ? (
                            allPayments.map(payment => (
                                <div key={payment.id} className="p-4 sm:p-6 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between group gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                            <ArrowUpRight className="h-6 w-6 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground text-lg">₦{payment.amount.toLocaleString()}</p>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
                                                <span className="font-semibold text-foreground">{payment.propertyTitle}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span>{payment.tenantName}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{payment.method.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm font-medium text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 mt-1">APPROVED</Badge>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-muted-foreground font-medium">No payment records found.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
