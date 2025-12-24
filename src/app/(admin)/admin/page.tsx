import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Users,
    Building2,
    Ticket,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Plus,
    Search,
    Wallet,
    ArrowUpRight,
    MoreHorizontal
} from "lucide-react";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { DashboardHeader } from "@/components/admin/DashboardHeader";

export default async function AdminDashboardPage() {
    const session = await auth();
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
        redirect("/login");
    }

    // 1. Fetch Real Stats from DB
    const [
        totalProperties,
        occupiedProperties,
        activeTenants,
        openTicketsCount,
        highPriorityTickets,
        recentTickets,
        recentPayments,
    ] = await Promise.all([
        prisma.property.count(),
        prisma.lease.count({ where: { isActive: true } }),
        prisma.user.count({ where: { role: 'TENANT', status: 'ACTIVE' } }),
        prisma.ticket.count({ where: { status: 'OPEN' } }),
        prisma.ticket.count({ where: { status: 'OPEN', priority: 'HIGH' } }),
        prisma.ticket.findMany({
            orderBy: { createdAt: 'desc' },
            take: 3,
            include: { user: true }
        }),
        prisma.payment.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { user: true }
        })
    ]);

    // Monthly Revenue (Current Month)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const revenueData = await prisma.payment.aggregate({
        where: {
            status: 'SUCCESS',
            createdAt: { gte: firstDayOfMonth }
        },
        _sum: { amount: true }
    });

    const vacantProperties = totalProperties - occupiedProperties;
    const monthlyRevenue = revenueData._sum.amount || 0;

    // Formatting Helpers
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0
        }).format(val);

    // Date for header
    const currentDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* 1. Header Section */}
                <DashboardHeader currentDate={currentDate} />

                {/* 2. KPI Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard
                        title="Total Properties"
                        value={totalProperties.toString()}
                        subtext={`${occupiedProperties} Occupied • ${vacantProperties} Vacant`}
                        icon={Building2}
                        trend="+12%"
                        color="blue"
                    />
                    <DashboardCard
                        title="Active Tenants"
                        value={activeTenants.toString()}
                        subtext="Across all properties"
                        icon={Users}
                        trend="+5%"
                        color="indigo"
                        href="/admin/users?role=TENANT"
                    />
                    <DashboardCard
                        title="Open Tickets"
                        value={openTicketsCount.toString()}
                        subtext={`${highPriorityTickets} High Priority`}
                        icon={Ticket}
                        trend={openTicketsCount > 0 ? `+${openTicketsCount}` : undefined}
                        trendColor="text-red-600"
                        trendBg="bg-red-50"
                        color="amber"
                        href="/admin/tickets"
                    />
                    {session?.user.role === 'ADMIN' && (
                        <DashboardCard
                            title="Monthly Revenue"
                            value={formatCurrency(monthlyRevenue)}
                            subtext="Paid this month"
                            icon={Wallet}
                            trend="+10.5%"
                            color="green"
                            href="/admin/financials"
                        />
                    )}
                </div>

                {/* 3. Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Maintenance (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-900">Recent Maintenance Requests</h3>
                                    <p className="text-sm text-gray-500">You have {openTicketsCount} requests pending review.</p>
                                </div>
                                <Link href="/admin/tickets">
                                    <Button variant="ghost" className="text-sm text-blue-600 hover:text-blue-700">View All</Button>
                                </Link>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {recentTickets.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 text-sm">No maintenance requests found.</div>
                                ) : recentTickets.map((ticket) => (
                                    <Link key={ticket.id} href={`/admin/tickets/${ticket.id}`}>
                                        <div className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4 group">
                                            <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                                }`}>
                                                <AlertCircle size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-semibold text-gray-900 text-sm">{ticket.subject}</h4>
                                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                                                        }`}>
                                                        {ticket.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-1">{ticket.description || 'No description provided'}</p>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                                    <span>Reported by {ticket.user.name}</span>
                                                    <span>•</span>
                                                    <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal size={16} />
                                            </Button>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Finances (1/3 width) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">Recent Payments</h3>
                                <Link href="/admin/financials">
                                    <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                                </Link>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {recentPayments.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 text-sm">No recent payments.</div>
                                ) : recentPayments.map((payment) => (
                                    <PaymentRow
                                        key={payment.id}
                                        initials={(payment.user.name || 'U').substring(0, 2).toUpperCase()}
                                        name={payment.user.name || 'Unknown User'}
                                        detail={`${payment.method} • ${payment.reference.substring(0, 8)}`}
                                        amount={formatCurrency(payment.amount)}
                                        status={payment.status}
                                        color={payment.status === 'SUCCESS' ? 'blue' : payment.status === 'PENDING' ? 'orange' : 'red'}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// --- Helper Components to keep the main code clean ---

interface DashboardCardProps {
    title: string;
    value: string;
    subtext: string;
    icon: any;
    trend?: string;
    trendColor?: string;
    trendBg?: string;
    color: string;
    href?: string;
}

function DashboardCard({ title, value, subtext, icon: Icon, trend, trendColor = "text-green-600", trendBg = "bg-green-50", color, href }: DashboardCardProps) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        amber: "bg-amber-50 text-amber-600",
        green: "bg-green-50 text-green-600",
    };

    const Content = () => (
        <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all ${href ? 'hover:shadow-md cursor-pointer hover:border-indigo-200' : 'hover:shadow-md'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-lg ${colors[color as keyof typeof colors] || colors.blue}`}>
                    <Icon size={22} />
                </div>
                {trend && (
                    <span className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full ${trendColor} ${trendBg}`}>
                        <ArrowUpRight size={12} /> {trend}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
                <p className="text-xs text-gray-400 mt-1">{subtext}</p>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}><Content /></Link>;
    }

    return <Content />;
}

function PaymentRow({ initials, name, detail, amount, status, color }: { initials: string, name: string, detail: string, amount: string, status: string, color: string }) {
    const bgColors = {
        blue: "bg-blue-100 text-blue-700",
        purple: "bg-purple-100 text-purple-700",
        orange: "bg-orange-100 text-orange-700",
        red: "bg-red-100 text-red-700",
    };

    return (
        <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs ${bgColors[color as keyof typeof bgColors]}`}>
                    {initials}
                </div>
                <div>
                    <h4 className="font-medium text-sm text-gray-900">{name}</h4>
                    <p className="text-xs text-gray-500">{detail}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-sm text-gray-900">{amount}</p>
                <p className={`text-[10px] font-medium uppercase tracking-wide ${status === 'Success' ? 'text-green-600' :
                    status === 'Pending' ? 'text-amber-600' : 'text-red-600'
                    }`}>{status}</p>
            </div>
        </div>
    );
}
