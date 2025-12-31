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
    // Allow ADMIN, STAFF, and LANDLORD
    if (!session?.user || !['ADMIN', 'STAFF', 'LANDLORD'].includes(session.user.role)) {
        redirect("/login");
    }

    const role = session.user.role;
    const userId = session.user.id;

    // Analytics Service
    const { AnalyticsService } = await import("@/lib/analytics");
    // Dynamic import to avoid circular dep issues during build if any, mostly cleanliness

    // 1. Fetch Aggregated Metrics
    const metrics = await AnalyticsService.getDashboardMetrics(userId, role);

    // 2. Fetch Real-time Lists (RBAC)
    const whereMap = role === 'LANDLORD' ? { landlordId: userId } : {};
    const propWhereMap = role === 'LANDLORD' ? { ownerId: userId } : {};

    const [
        totalProperties,
        occupiedProperties,
        activeTenants,
        openTicketsCount,
        highPriorityTickets,
        recentTickets,
        recentPayments
    ] = await Promise.all([
        prisma.property.count({ where: propWhereMap }),
        prisma.lease.count({
            where: { isActive: true, property: propWhereMap }
        }),
        // Active Tenants: For admin, all. For Landlord, unique tenants in their properties.
        role === 'LANDLORD'
            ? prisma.lease.findMany({
                where: { isActive: true, property: propWhereMap },
                select: { userId: true },
                distinct: ['userId']
            }).then(res => res.length)
            : prisma.user.count({ where: { role: 'TENANT', status: 'ACTIVE' } }),

        prisma.ticket.count({
            where: {
                status: { notIn: ['RESOLVED', 'CLOSED'] },
                ...whereMap
            }
        }),
        prisma.ticket.count({
            where: {
                status: { notIn: ['RESOLVED', 'CLOSED'] },
                priority: { in: ['HIGH', 'URGENT'] } as any,
                ...whereMap
            }
        }),

        prisma.ticket.findMany({
            where: {
                status: { notIn: ['RESOLVED', 'CLOSED'] },
                ...whereMap
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
            include: { user: true }
        }),

        prisma.payment.findMany({
            where: role === 'LANDLORD'
                ? { property: { ownerId: userId } } // Landlord sees payments for their properties
                : {},
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { user: true }
        })
    ]);

    // Revenue (from Metrics or fresh calculation)
    const monthlyRevenue = metrics?.current?.totalRentCollected || 0;
    const occupancyRate = metrics?.current?.occupancyRate || 0;
    const trends = metrics?.trends;

    const vacantProperties = totalProperties - occupiedProperties;

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
        <div className="min-h-screen bg-background p-6 sm:p-8">
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
                        trend={trends?.occupancy} // Using occupancy trend as proxy for property health? Or N/A?
                        // Actually trend for totalProperties is static usually. Let's use Occupancy trend here?
                        // Or just hardcode logic if needed. The Requirement said "visual trend indicators".
                        color="blue"
                        href="/admin/properties"
                    />
                    <DashboardCard
                        title="Active Tenants"
                        value={activeTenants.toString()}
                        subtext="Across all properties"
                        icon={Users}
                        trend={trends?.occupancy} // Occupancy trend correlates with tenants
                        color="indigo"
                        href="/admin/users?role=TENANT"
                    />
                    <DashboardCard
                        title="Open Tickets"
                        value={openTicketsCount.toString()}
                        subtext={`${highPriorityTickets} High Priority`}
                        icon={Ticket}
                        trend={trends?.tickets}
                        trendColor={openTicketsCount > (metrics?.current?.activeTickets || 0) ? "text-red-600" : "text-green-600"}
                        // Simple logic: if Open > last month active, BAD (Red)?
                        // Actually trend string includes +/-.
                        color="amber"
                        href="/admin/tickets"
                    />
                    {session?.user.role !== 'TENANT' && ( // Allow Landlords to see Wallet?
                        <DashboardCard
                            title="Monthly Revenue"
                            value={formatCurrency(monthlyRevenue)}
                            subtext="Paid this month"
                            icon={Wallet}
                            trend={trends?.rent}
                            color="green"
                            href="/admin/financials"
                        />
                    )}
                </div>

                {/* 3. Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Maintenance (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <div>
                                    <h3 className="font-extrabold text-foreground tracking-tight">Recent Maintenance Requests</h3>
                                    <p className="text-sm text-muted-foreground">You have {openTicketsCount} requests pending review.</p>
                                </div>
                                <Link href="/admin/tickets">
                                    <Button variant="ghost" className="text-sm text-blue-600 hover:text-blue-700">View All</Button>
                                </Link>
                            </div>

                            <div className="divide-y divide-border">
                                {recentTickets.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground/50 text-sm">No maintenance requests found.</div>
                                ) : recentTickets.map((ticket) => (
                                    <Link key={ticket.id} href={`/admin/tickets/${ticket.id}`}>
                                        <div className="p-4 hover:bg-muted/50 transition-all flex items-start gap-4 group cursor-pointer relative overflow-hidden">
                                            <div className="absolute left-0 top-0 w-1 h-full bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                            <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                                }`}>
                                                <AlertCircle size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-foreground text-sm uppercase tracking-tight">{ticket.subject}</h4>
                                                    <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                                                        }`}>
                                                        {ticket.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors mt-1 line-clamp-1 italic">{ticket.description || 'No description provided'}</p>
                                                <div className="flex items-center gap-3 mt-2 text-[11px] font-semibold text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
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
                        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden h-full">
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h3 className="font-extrabold text-foreground tracking-tight">Recent Payments</h3>
                                <Link href="/admin/financials">
                                    <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/5">View All</Button>
                                </Link>
                            </div>

                            <div className="divide-y divide-border">
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
        blue: "bg-blue-500/20 text-blue-500",
        indigo: "bg-indigo-500/20 text-indigo-500",
        amber: "bg-amber-500/20 text-amber-500",
        green: "bg-green-500/20 text-green-500",
    };

    const Content = () => (
        <div className={`bg-card p-6 rounded-xl shadow-sm border border-border transition-all ${href ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer hover:border-primary/50' : 'hover:shadow-md'}`}>
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
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 mb-1">{title}</h3>
                <div className="text-2xl font-black text-foreground tracking-tight">{value}</div>
                <p className="text-xs font-medium text-muted-foreground mt-1.5">{subtext}</p>
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
        blue: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
        orange: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
        red: "bg-red-500/10 text-red-500 border border-red-500/20",
    };

    return (
        <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-all cursor-pointer group relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
            <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-xs ${bgColors[color as keyof typeof bgColors]}`}>
                    {initials}
                </div>
                <div>
                    <h4 className="font-bold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors">{name}</h4>
                    <p className="text-xs font-medium text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">{detail}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-black text-sm text-foreground tracking-tight">{amount}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${status === 'SUCCESS' ? 'text-blue-500' :
                    status === 'PENDING' ? 'text-amber-500' : 'text-red-500'
                    }`}>{status}</p>
            </div>
        </div>
    );
}
