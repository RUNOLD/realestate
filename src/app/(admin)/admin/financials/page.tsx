import Link from "next/link";
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    Search,
    Filter,
    MoreHorizontal,
    BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FinancialsToolbar } from "@/components/admin/FinancialsToolbar";
import { prisma } from "@/lib/prisma";

import { ExportPayoutsButton } from "@/components/admin/financials/ExportPayoutsButton";
import { FinancialsSearch } from "@/components/admin/financials/FinancialsSearch";
import { TransactionActions } from "@/components/admin/financials/TransactionActions";
import { FinancialsFilter } from "@/components/admin/financials/FinancialsFilter";

export default async function FinancialsPage({
    searchParams,
}: {
    searchParams: Promise<{ period?: string; q?: string; status?: string; view?: string }>;
}) {
    // 1. Determine Date Range & Filters
    const { period = 'all', status, view } = await searchParams;
    let startDate: Date | undefined;

    if (period === '7d') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
    } else if (period === '30d') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
    } else if (period === '90d') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);
    }

    // 2. Fetch Data (Filtered)
    let payments: any[] = [];
    let payouts: any[] = []; // Fetch Payouts for Export

    try {
        const [paymentsParams, payoutsParams] = await Promise.all([
            prisma.payment.findMany({
                where: {
                    createdAt: startDate ? { gte: startDate } : undefined,
                    status: status || undefined,
                    OR: searchParams && (searchParams as any).q ? [
                        { user: { name: { contains: (searchParams as any).q, mode: 'insensitive' } } },
                        { user: { email: { contains: (searchParams as any).q, mode: 'insensitive' } } },
                        { property: { title: { contains: (searchParams as any).q, mode: 'insensitive' } } },
                    ] : undefined
                },
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { name: true, email: true, image: true }
                    },
                    property: {
                        select: {
                            title: true,
                            unitNumber: true,
                            owner: {
                                select: { name: true }
                            }
                        }
                    }
                },
                take: period === 'all' && !status ? 100 : undefined
            }),
            prisma.payout.findMany({
                where: {
                    createdAt: startDate ? { gte: startDate } : undefined,
                },
                orderBy: { createdAt: 'desc' },
                include: {
                    landlord: { select: { name: true, email: true } }
                }
            })
        ]);
        payments = paymentsParams;
        payouts = payoutsParams;

    } catch (e) {
        console.error("Financials Error:", e);
        payments = [];
        payouts = [];
    }

    // 3. Calculate Stats (Real Data - Based on Processed Payout Commissions)
    const totalRevenue = payouts.reduce((sum, p) => {
        const snapshot = p.expenseSnapshot as any;
        return sum + (Number(snapshot?.commission) || 0);
    }, 0);

    const pendingCount = payments.filter(p => p.status === 'PENDING').length;
    const pendingAmount = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);
    const successCount = payments.filter(p => p.status === 'SUCCESS').length;
    const totalTxns = payments.length;
    const successRate = totalTxns > 0 ? Math.round((successCount / totalTxns) * 100) : 0;

    // Analytics Data Preparation (Group by Date - Commissions Only)
    const chartData = view === 'analytics' ? payouts.reduce((acc: any, curr: any) => {
        const date = new Date(curr.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const commission = (curr.expenseSnapshot as any)?.commission || 0;
        acc[date] = (acc[date] || 0) + Number(commission);
        return acc;
    }, {}) : {};

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6 sm:p-8 min-h-screen">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Financials</h1>
                    <p className="text-muted-foreground mt-1">Overview of your revenue streams and recent transactions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <ExportPayoutsButton payouts={payouts} />
                    <FinancialsToolbar data={payments} currentPeriod={period} />
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/admin/financials?view=analytics" className="block transition-transform hover:scale-[1.02]">
                    <StatCard
                        title="Total Revenue"
                        value={`₦${totalRevenue.toLocaleString()}`}
                        trend={totalRevenue > 0 ? "Click for analytics" : "No revenue filtered"}
                        trendColor={totalRevenue > 0 ? "text-primary" : "text-muted-foreground"}
                        icon={<DollarSign className="h-5 w-5 text-green-500" />}
                        bg="bg-green-500/10"
                    />
                </Link>
                <Link href="/admin/financials?status=PENDING" className="block transition-transform hover:scale-[1.02]">
                    <StatCard
                        title="Pending Collections"
                        value={`₦${pendingAmount.toLocaleString()}`}
                        trend={pendingCount > 0 ? `${pendingCount} invoices pending` : "All caught up"}
                        trendColor={pendingCount > 0 ? "text-amber-600" : "text-emerald-600"}
                        icon={<CreditCard className="h-5 w-5 text-amber-500" />}
                        bg="bg-amber-500/10"
                    />
                </Link>
                <div className="block">
                    <StatCard
                        title="Success Rate"
                        value={`${successRate}%`}
                        trend={totalTxns > 0 ? `Based on ${totalTxns} txns` : "No data"}
                        trendColor="text-muted-foreground"
                        icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
                        bg="bg-blue-500/10"
                    />
                </div>
            </div>

            {/* View Switching: Analytics vs List */}
            {view === 'analytics' ? (
                <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Revenue Analytics
                        </h3>
                        <Link href="/admin/financials">
                            <Button variant="outline" size="sm">Back to List</Button>
                        </Link>
                    </div>

                    <div className="h-64 flex items-end gap-2 sm:gap-4 border-b border-border pb-2 px-2 overflow-x-auto">
                        {Object.keys(chartData).length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No data to generate graph.
                            </div>
                        ) : (
                            Object.entries(chartData).map(([date, amount]: [string, any], idx) => (
                                <div key={idx} className="flex flex-col items-center justify-end h-full gap-2 min-w-[50px] flex-1 group">
                                    <div className="relative w-full max-w-[60px] bg-primary/20 rounded-t-md hover:bg-primary/40 transition-all flex items-end justify-center group-hover:shadow-lg"
                                        style={{ height: `${Math.max((amount / (totalRevenue || 1)) * 100, 5)}%`, minHeight: '10%' }}>
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-black text-white text-[10px] px-2 py-1 rounded transition-opacity whitespace-nowrap z-10">
                                            ₦{amount.toLocaleString()}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-muted-foreground rotate-0 truncate w-full text-center">{date}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                /* Main Transaction List */
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                            {status === 'PENDING' ? (
                                <>
                                    <CreditCard className="h-5 w-5 text-amber-500" />
                                    Pending Collections
                                    <Link href="/admin/financials" className="text-xs font-normal text-muted-foreground hover:underline ml-2">(Clear Filter)</Link>
                                </>
                            ) : "Recent Transactions"}
                        </h3>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <FinancialsSearch />
                            <FinancialsFilter />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                                <tr>
                                    <th className="px-6 py-4">Tenant</th>
                                    <th className="px-6 py-4">Property / Unit</th>
                                    <th className="px-6 py-4">Landlord</th>
                                    <th className="px-6 py-4">Rent Period</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="bg-muted p-3 rounded-full mb-3">
                                                    <Search className="h-6 w-6 text-muted-foreground/50" />
                                                </div>
                                                <p className="font-medium">No transactions found</p>
                                                <p className="text-xs mt-1">Try adjusting your filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="group hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
                                                        {payment.user.name?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-foreground">{payment.user.name}</div>
                                                        <div className="text-xs text-muted-foreground">{payment.user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-foreground font-medium">{payment.property?.title || 'N/A'}</div>
                                                <div className="text-xs text-muted-foreground">{payment.property?.unitNumber || 'Main Unit'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-foreground font-medium">{payment.property?.owner?.name || 'System Managed'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-foreground font-medium">
                                                    {new Date(payment.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                                {new Date(payment.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={payment.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right font-semibold text-foreground">
                                                ₦{payment.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <TransactionActions payment={payment as any} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-4 border-t border-border bg-muted/20 flex justify-between items-center text-xs text-muted-foreground">
                        <span>Showing {payments.length} recent transactions</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled className="h-8">Previous</Button>
                            <Button variant="outline" size="sm" disabled className="h-8">Next</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, trend, trendColor, icon, bg }: {
    title: string,
    value: string,
    trend: string,
    trendColor: string,
    icon: React.ReactNode,
    bg: string
}) {
    return (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start justify-between group hover:shadow-md hover:border-primary/20 transition-all h-full">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className="text-2xl font-bold text-foreground mt-2">{value}</h3>
                <div className="flex items-center mt-2.5">
                    <span className={`text-xs font-bold ${trendColor} bg-muted/40 px-2 py-0.5 rounded-full flex items-center`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {trend}
                    </span>
                </div>
            </div>
            <div className={`p-3 rounded-lg ${bg}`}>
                {icon}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        SUCCESS: "bg-green-500/10 text-green-500 border-green-500/20",
        FAILED: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    const label = status ? (status.charAt(0) + status.slice(1).toLowerCase()) : 'Unknown';
    const className = styles[status] || "bg-gray-500/10 text-gray-500";

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${className}`}>
            {label}
        </span>
    );
}
