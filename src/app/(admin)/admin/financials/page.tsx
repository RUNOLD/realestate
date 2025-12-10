import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    Download,
    Calendar,
    Search,
    Filter,
    MoreHorizontal,
    ArrowUpRight
} from "lucide-react";

export default async function FinancialsPage() {
    // 1. Fetch Data
    const payments = await prisma.payment.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { name: true, email: true, image: true } // Assuming image exists, optional
            }
        },
        take: 20
    });

    // 2. Calculate Stats
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);
    const successCount = payments.filter(p => p.status === 'SUCCESS').length;
    const successRate = payments.length > 0 ? Math.round((successCount / payments.length) * 100) : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-8 bg-gray-50/50 min-h-screen">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Financials</h1>
                    <p className="text-gray-500 mt-1">Overview of your revenue streams and recent transactions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="bg-white hover:bg-gray-50">
                        <Calendar className="mr-2 h-4 w-4" />
                        Last 30 Days
                    </Button>
                    <Button className="bg-black text-white hover:bg-gray-800">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₦${totalRevenue.toLocaleString()}`}
                    trend="+12.5% from last month"
                    icon={<DollarSign className="h-5 w-5 text-green-600" />}
                    bg="bg-green-50"
                />
                <StatCard
                    title="Pending Collections"
                    value={`₦${pendingAmount.toLocaleString()}`}
                    trend="5 invoices pending"
                    icon={<CreditCard className="h-5 w-5 text-amber-600" />}
                    bg="bg-amber-50"
                />
                <StatCard
                    title="Success Rate"
                    value={`${successRate}%`}
                    trend="Based on last 20 txns"
                    icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
                    bg="bg-blue-50"
                />
            </div>

            {/* Financial dashboard wireframe layout */}

            {/* Main Content Area */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Table Toolbar */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-semibold text-lg text-gray-900">Recent Transactions</h3>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search payments..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="shrink-0 border-gray-200">
                            <Filter className="h-4 w-4 text-gray-500" />
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Transaction Details</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-gray-100 p-3 rounded-full mb-3">
                                                <Search className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p className="font-medium">No transactions found</p>
                                            <p className="text-xs mt-1">Try adjusting your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs text-gray-400">#{payment.id.substring(0, 8)}</span>
                                                <span className="font-medium text-gray-900">Rent Payment</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                    {payment.user.name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{payment.user.name}</div>
                                                    <div className="text-xs text-gray-500">{payment.user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(payment.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={payment.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                            ₦{payment.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
                    <span>Showing {payments.length} recent transactions</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled className="h-8">Previous</Button>
                        <Button variant="outline" size="sm" disabled className="h-8">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, icon, bg }: { title: string, value: string, trend: string, icon: React.ReactNode, bg: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between group hover:shadow-md transition-all">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
                <div className="flex items-center mt-2.5">
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {trend}
                    </span>
                </div>
            </div>
            <div className={`p-3 rounded-lg ${bg} opacity-80 group-hover:opacity-100 transition-opacity`}>
                {icon}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        SUCCESS: "bg-green-100 text-green-800",
        FAILED: "bg-red-100 text-red-800",
    };

    const label = status ? (status.charAt(0) + status.slice(1).toLowerCase()) : 'Unknown';
    const className = styles[status] || "bg-gray-100 text-gray-800";

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
            {label}
        </span>
    );
}
