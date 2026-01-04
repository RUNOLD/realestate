
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Banknote, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function LandlordFinancialsPage() {
    const session = await auth();
    if (!session?.user) return null;

    const payouts = await prisma.payout.findMany({
        where: { landlordId: session.user.id },
        orderBy: { createdAt: 'desc' }
    });

    const totalNetRevenue = payouts.reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">Financial Transparency</h1>
                    <p className="text-muted-foreground">Settlement history and revenue analytics.</p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Net Revenue</CardTitle>
                        <Banknote className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-foreground">₦{totalNetRevenue.toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground mt-1">Total settlements processed to your account</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Latest Payout Status</CardTitle>
                        <CheckCircle className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-foreground">
                            {payouts[0] ? `₦${payouts[0].amount.toLocaleString()}` : "₦0"}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {payouts[0] ? `Processed on ${new Date(payouts[0].createdAt).toLocaleDateString()}` : "No payouts processed yet"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Payout History */}
            <Card className="bg-card border-border shadow-lg">
                <CardHeader className="border-b border-border/50 pb-4 bg-muted/20">
                    <CardTitle className="text-lg font-bold text-foreground">Settlement History</CardTitle>
                    <CardDescription>Verified payouts approved by the administration.</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 p-0">
                    <div className="divide-y divide-border/50">
                        {payouts.length > 0 ? (
                            payouts.map(payout => (
                                <div key={payout.id} className="p-4 sm:p-6 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                            <ArrowUpRight className="h-6 w-6 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-mono text-muted-foreground mb-1">{payout.reference}</p>
                                            <p className="font-bold text-emerald-600 text-lg">₦{payout.amount.toLocaleString()}</p>
                                            <p className="text-sm font-semibold text-foreground">{(payout as any).description || "Rent Payout"}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Period: {new Date(payout.periodStart).toLocaleDateString()} - {new Date(payout.periodEnd).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-medium text-foreground">Processed</p>
                                            <p className="text-xs text-muted-foreground">{new Date(payout.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">PAID</Badge>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-muted-foreground font-medium">No settlements found yet.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
