import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import {
    Activity,
    Settings,
    Zap,
    TrendingUp,
    AlertTriangle,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Components (We will create these next)
import { UtilityConfigForm } from "@/components/admin/utilities/UtilityConfigForm";
import { UtilityTransactionTable } from "@/components/admin/utilities/UtilityTransactionTable";

export default async function UtilitiesPage() {
    // Fetch Data
    const rawTransactions = await prisma.utilityTransaction.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { user: { select: { name: true, email: true } } }
    });

    const transactions = rawTransactions.map((txn: any) => ({
        ...txn,
        createdAt: txn.createdAt.toISOString(),
        updatedAt: txn.updatedAt.toISOString(),
    }));

    // KPI Calculation
    const totalRevenue = await prisma.utilityTransaction.aggregate({
        _sum: { commission: true },
        where: { status: 'SUCCESS' }
    });

    const totalVolume = await prisma.utilityTransaction.aggregate({
        _sum: { totalPaid: true },
        where: { status: 'SUCCESS' }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-2">
                        <Zap className="text-yellow-500 fill-yellow-500" /> Utility Management
                    </h1>
                    <p className="text-muted-foreground mt-1">Monitor electricity vending, commissions, and provider status.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Export Report</Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Commission Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{(totalRevenue._sum.commission || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+ from vending fees</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Vending Volume</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{(totalVolume._sum.totalPaid || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total processed via gateway</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gateway Status</CardTitle>
                        <div className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-green-500 font-bold">ONLINE</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Paystack</div>
                        <p className="text-xs text-muted-foreground">Primary Provider Active</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="transactions" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="configuration">Configuration</TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="space-y-4">
                    {/* We pass data to client component for interactivity */}
                    <UtilityTransactionTable initialData={transactions} />
                </TabsContent>

                <TabsContent value="configuration">
                    <UtilityConfigForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
