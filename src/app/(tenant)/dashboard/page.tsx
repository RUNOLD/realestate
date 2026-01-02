import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { redirect } from "next/navigation";
import { TicketForm } from "@/components/tenant/TicketForm";
import { PayRentButtonClient } from "@/components/tenant/PayRentButtonClient";
import { QuickActions } from "@/components/tenant/QuickActions";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Plus,
    Users,
    Building2,
    Ticket,
    Search,
    Wallet,
    Package,
    ArrowUpRight,
    MoreHorizontal
} from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = (session.user as any).role;
    const isTenant = userRole === 'TENANT';
    const isAdmin = userRole === 'ADMIN';

    // --- TENANT VIEW ---
    if (isTenant) {
        const [tickets, payments, activeLease] = await Promise.all([
            prisma.ticket.findMany({
                where: { userId: session.user.id },
                orderBy: { createdAt: 'desc' },
                take: 5
            }),
            prisma.payment.findMany({
                where: { userId: session.user.id },
                orderBy: { createdAt: 'desc' },
                take: 10
            }),
            prisma.lease.findFirst({
                where: { userId: session.user.id, isActive: true },
                include: { property: true }
            })
        ]);

        const activeTickets = tickets.filter(t => t.status !== 'CLOSED' && t.status !== 'RESOLVED');
        const rentAmount = activeLease?.rentAmount || 0;
        const serviceCharge = activeLease?.property.serviceCharge || 0;
        const totalRecurring = rentAmount + serviceCharge;

        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary">Welcome, {session.user.name ?? 'Tenant'}</h1>
                        <p className="text-muted-foreground">Manage your tenancy and requests.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Next Rent Payment</h3>
                        <div className="text-2xl font-bold text-primary mb-3">
                            {totalRecurring > 0 ? `₦${totalRecurring.toLocaleString()}` : 'No Active Lease'}
                        </div>

                        {rentAmount > 0 && (
                            <div className="mb-3 space-y-2">
                                <div className="text-sm text-foreground font-medium">
                                    {activeLease?.property.title}
                                    {activeLease?.property.unitNumber && <span className="block text-xs text-muted-foreground">{activeLease.property.unitNumber}</span>}
                                    <span className="block text-xs text-muted-foreground">{activeLease?.property.location}</span>
                                </div>
                                <div className="flex gap-2">
                                    <PayRentButtonClient
                                        email={session.user.email || 'tenant@example.com'}
                                        amount={rentAmount}
                                        userId={session.user.id!}
                                    />
                                    <Button variant="outline" size="sm" className="w-full text-xs" disabled>
                                        Buy Utilities
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <Clock size={12} /> {activeLease?.endDate ? `Expires ${new Date(activeLease.endDate).toLocaleDateString()}` : 'No due date set'}
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Tickets</h3>
                        <div className="text-2xl font-bold text-primary mb-1">{activeTickets.length} Open</div>
                        {activeTickets.length > 0 && (
                            <div className="text-sm text-yellow-600 font-medium flex items-center gap-1">
                                <AlertCircle size={14} /> {activeTickets[0].status}
                            </div>
                        )}
                    </div>
                </div>

                {/* New Ticket Form */}
                <TicketForm />

                {/* Recent Activity */}
                <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-lg font-bold text-primary">Payment History</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted text-muted-foreground uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Transaction Ref</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {payments.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">No payments found.</td></tr>
                                ) : (
                                    payments.map(pay => (
                                        <tr key={pay.id} className="bg-card hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4">{new Date(pay.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">{pay.reference}</td>
                                            <td className="px-6 py-4">₦{pay.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${pay.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {pay.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {pay.status === 'SUCCESS' && (
                                                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                                                        View Receipt
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // --- STAFF & ADMIN VIEW ---

    // 1. Fetch KPI Data securely
    let totalProperties = 0;
    let occupiedProperties = 0;
    let totalTenants = 0;
    let openTickets = 0;
    let highPriorityTickets = 0;
    let totalMaterials = 0;
    let lowStockMaterials = 0;
    let monthlyRevenue = 0;
    let recentTickets: any[] = [];
    let recentPayments: any[] = [];
    let expiringLeases: any[] = [];

    try {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const results = await Promise.all([
            prisma.property.count(),
            prisma.property.count({ where: { status: 'RENTED' } }),
            prisma.user.count({ where: { role: 'TENANT' } }),
            prisma.ticket.count({ where: { status: { notIn: ['CLOSED', 'RESOLVED'] } } }),
            prisma.ticket.count({ where: { status: { notIn: ['CLOSED', 'RESOLVED'] }, priority: 'HIGH' } }), // highPriorityTickets
            prisma.material.count(),
            prisma.material.count({ where: { inStock: false } }),
            prisma.ticket.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: true }
            }),
            prisma.payment.findMany({
                take: 6,
                orderBy: { createdAt: 'desc' },
                include: { user: true }
            }),
            prisma.lease.findMany({
                where: {
                    isActive: true,
                    endDate: {
                        lte: thirtyDaysFromNow,
                        gte: new Date()
                    }
                },
                include: {
                    user: true,
                    property: true
                },
                take: 5
            })
        ]);

        [
            totalProperties,
            occupiedProperties,
            totalTenants,
            openTickets,
            highPriorityTickets,
            totalMaterials,
            lowStockMaterials,
            recentTickets,
            recentPayments,
            expiringLeases
        ] = results;

        // Revenue Calculation
        const currentMonthStart = new Date();
        currentMonthStart.setDate(1);
        const revenueItems = await prisma.payment.findMany({
            where: {
                status: 'SUCCESS',
                createdAt: { gte: currentMonthStart }
            },
            select: { amount: true }
        });
        monthlyRevenue = revenueItems.reduce((sum, p) => sum + p.amount, 0);

    } catch (error) {
        console.error("Dashboard Data Fetch Error:", error);
    }

    return (
        <div className="space-y-8">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                        {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h1 className="text-3xl font-serif font-bold text-primary">Welcome back, {session.user.name ?? 'Staff'}</h1>
                    <p className="text-muted-foreground">Here is what's happening with the portfolio today.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/properties">
                        <Button variant="outline" className="bg-background hover:bg-accent/10">
                            <Search className="mr-2 h-4 w-4" /> Search
                        </Button>
                    </Link>
                    <QuickActions />
                </div>
            </div >

            {/* 2. KPI Overview Cards */}
            < div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" >
                <DashboardCard
                    title="Total Properties"
                    value={totalProperties.toString()}
                    subtext={`${occupiedProperties} Occupied • ${totalProperties - occupiedProperties} Vacant`}
                    icon={Building2}
                    trend="Live"
                    color="blue"
                    href="/admin/properties"
                />
                <DashboardCard
                    title="Active Tenants"
                    value={totalTenants.toString()}
                    subtext="Registered Tenants"
                    icon={Users}
                    trend="Live"
                    color="indigo"
                    href="/admin/users?role=TENANT"
                />
                <DashboardCard
                    title="Materials In Stock"
                    value={totalMaterials.toString()}
                    subtext={`Low stock items: ${lowStockMaterials}`}
                    icon={Package}
                    trend="Live"
                    color="cyan"
                    href="/admin/materials"
                />

                {/* REVENUE - ADMIN ONLY */}
                {
                    isAdmin && (
                        <DashboardCard
                            title="Monthly Revenue"
                            value={`₦${monthlyRevenue.toLocaleString()}`}
                            subtext="Current Month"
                            icon={Wallet}
                            trend="Live"
                            color="green"
                            href="/admin/financials"
                        />
                    )
                }
            </div >

            {/* ALERT: Expiring Leases */}
            {expiringLeases.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
                    <div className="bg-amber-100 p-2 rounded-full text-amber-700 shrink-0 mt-0.5">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-amber-900">Attention Needed: Expiring Leases</h3>
                        <p className="text-amber-800 text-sm mt-1">
                            You have {expiringLeases.length} lease{expiringLeases.length !== 1 ? 's' : ''} expiring within the next 30 days. Please review them for renewal.
                        </p>
                        <ul className="mt-3 space-y-1">
                            {expiringLeases.map((lease) => (
                                <li key={lease.id} className="text-sm text-amber-900 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                    <span className="font-semibold">{lease.user.name}</span>
                                    <span className="text-amber-700">at</span>
                                    <span className="font-medium">{lease.property.title}</span>
                                    <span className="text-amber-600">({new Date(lease.endDate!).toLocaleDateString()})</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-3">
                            <Link href="/admin/users?role=TENANT">
                                <Button variant="outline" size="sm" className="bg-white border-amber-200 text-amber-800 hover:bg-amber-100 hover:text-amber-900">
                                    Manage Tenants
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Main Content Grid */}
            < div className="grid grid-cols-1 lg:grid-cols-3 gap-8" >

                {/* LEFT COLUMN: Maintenance (2/3 width) */}
                < div className="lg:col-span-2 space-y-6" >
                    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-foreground">Recent Maintenance Requests</h3>
                                <p className="text-sm text-muted-foreground">You have {openTickets} requests pending review.</p>
                            </div>
                            <Button variant="ghost" className="text-sm text-primary hover:text-primary/80">View All</Button>
                        </div>

                        <div className="divide-y divide-border">
                            {recentTickets.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground">No recent tickets.</div>
                            ) : (
                                recentTickets.map((ticket) => (
                                    <TicketItem
                                        key={ticket.id}
                                        title={ticket.subject}
                                        status={ticket.status}
                                        statusColor={ticket.status === 'OPEN' ? 'amber' : ticket.priority === 'HIGH' ? 'red' : 'green'}
                                        description={ticket.description ? ticket.description.substring(0, 60) + '...' : 'No description'}
                                        meta={`Reported by ${ticket.user?.name || 'Unknown'} • ${new Date(ticket.createdAt).toLocaleDateString()}`}
                                        icon={ticket.priority === 'HIGH' ? AlertCircle : Ticket}
                                        iconColor={ticket.priority === 'HIGH' ? 'red' : 'amber'}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div >

                {/* RIGHT COLUMN: Finances or Quick Stats (1/3 width) */}
                < div className="lg:col-span-1 space-y-6" >
                    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden h-full">
                        <div className="p-6 border-b border-border">
                            <h3 className="font-bold text-foreground">Recent Activity</h3>
                        </div>

                        <div className="divide-y divide-border">
                            {recentPayments.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground">No recent activity.</div>
                            ) : (
                                recentPayments.map((payment) => (
                                    <PaymentRow
                                        key={payment.id}
                                        initials={payment.user?.name ? payment.user.name.substring(0, 2).toUpperCase() : '??'}
                                        name={payment.user?.name || 'Unknown User'}
                                        detail={payment.method} // Or property unit if we had it
                                        amount={`₦${payment.amount.toLocaleString()}`}
                                        status={payment.status}
                                        color={['blue', 'purple', 'orange', 'red'][Math.floor(Math.random() * 4)]} // Just random for visual variety
                                    />
                                ))
                            )}
                        </div>

                        <div className="p-4 bg-muted/30 border-t border-border text-center">
                            <Button variant="link" className="text-sm text-muted-foreground">View All Activity</Button>
                        </div>
                    </div>
                </div >

            </div >
        </div >
    );
}

// --- Helper Components ---

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
        cyan: "bg-cyan-50 text-cyan-600",
    };

    const Content = () => (
        <div className={`bg-card p-6 rounded-xl shadow-sm border border-border transition-all ${href ? 'hover:shadow-md cursor-pointer hover:border-primary/20' : 'hover:shadow-md'}`}>
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
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <div className="text-2xl font-bold text-foreground mt-1">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}><Content /></Link>;
    }

    return <Content />;
}

function PaymentRow({ initials, name, detail, amount, status, color }: any) {
    const bgColors: Record<string, string> = {
        blue: "bg-blue-100 text-blue-700",
        purple: "bg-purple-100 text-purple-700",
        orange: "bg-orange-100 text-orange-700",
        red: "bg-red-100 text-red-700",
    };

    return (
        <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs ${bgColors[color]}`}>
                    {initials}
                </div>
                <div>
                    <h4 className="font-medium text-sm text-foreground">{name}</h4>
                    <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-sm text-foreground">{amount}</p>
                <p className={`text-[10px] font-medium uppercase tracking-wide ${status === 'Success' ? 'text-green-600' :
                    status === 'Pending' ? 'text-amber-600' : 'text-red-600'
                    }`}>{status}</p>
            </div>
        </div>
    );
}

function TicketItem({ title, status, statusColor, description, meta, icon: Icon, iconColor }: any) {
    const bgColors: Record<string, string> = {
        red: "bg-red-100 text-red-600",
        amber: "bg-amber-100 text-amber-600",
        green: "bg-green-100 text-green-600",
    };

    // Status badges
    const statusBadges: Record<string, string> = {
        red: "bg-red-50 text-red-700",
        amber: "bg-amber-50 text-amber-700",
        green: "bg-green-50 text-green-700",
    }

    return (
        <div className="p-4 hover:bg-muted/50 transition-colors flex items-start gap-4 group cursor-pointer">
            <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${bgColors[iconColor]}`}>
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-foreground text-sm">{title}</h4>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusBadges[statusColor]}`}>{status}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{meta}</span>
                </div>
            </div>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={16} />
            </Button>
        </div>
    )
}
