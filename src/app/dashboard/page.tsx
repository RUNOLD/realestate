import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TicketForm } from "@/components/dashboard/TicketForm";
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
        const [tickets, payments] = await Promise.all([
            prisma.ticket.findMany({
                where: { userId: session.user.id },
                orderBy: { createdAt: 'desc' },
                take: 5
            }),
            prisma.payment.findMany({
                where: { userId: session.user.id },
                orderBy: { createdAt: 'desc' },
                take: 10
            })
        ]);

        const activeTickets = tickets.filter(t => t.status !== 'CLOSED' && t.status !== 'RESOLVED');

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
                        <div className="text-2xl font-bold text-primary mb-1">₦0.00</div>
                        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle size={14} /> You are up to date!
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
    // Mock Date for the header
    const currentDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="space-y-8">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{currentDate}</p>
                    <h1 className="text-3xl font-serif font-bold text-primary">Welcome back, {session.user.name ?? 'Staff'}</h1>
                    <p className="text-muted-foreground">Here is what's happening with the portfolio today.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-background hover:bg-accent/10">
                        <Search className="mr-2 h-4 w-4" /> Search
                    </Button>
                    <Button variant="luxury" className="shadow-lg">
                        <Plus className="mr-2 h-4 w-4" /> Quick Action
                    </Button>
                </div>
            </div>

            {/* 2. KPI Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Total Properties"
                    value="24"
                    subtext="18 Occupied • 6 Vacant"
                    icon={Building2}
                    trend="+12%"
                    color="blue"
                    href="/admin/properties"
                />
                <DashboardCard
                    title="Active Tenants"
                    value="142"
                    subtext="98% collection rate"
                    icon={Users}
                    trend="+5%"
                    color="indigo"
                    href="/admin/users?role=TENANT"
                />
                <DashboardCard
                    title="Open Tickets"
                    value="8"
                    subtext="3 High Priority"
                    icon={Ticket}
                    trend="+2"
                    trendColor="text-red-600"
                    trendBg="bg-red-50"
                    color="amber"
                    color="amber"
                    href="/admin/tickets"
                />
                <DashboardCard
                    title="Materials In Stock"
                    value="124"
                    subtext="Low stock alert: 3 items"
                    icon={Package}
                    trend="Stable"
                    color="cyan"
                    href="/admin/materials"
                />

                {/* REVENUE - ADMIN ONLY */}
                {isAdmin && (
                    <DashboardCard
                        title="Monthly Revenue"
                        value="₦4.2M"
                        subtext="vs ₦3.8M last month"
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
                    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-foreground">Recent Maintenance Requests</h3>
                                <p className="text-sm text-muted-foreground">You have 8 requests pending review.</p>
                            </div>
                            <Button variant="ghost" className="text-sm text-primary hover:text-primary/80">View All</Button>
                        </div>

                        <div className="divide-y divide-border">
                            {/* Static Data from Admin Page - Ideally this comes from DB */}
                            <TicketItem
                                title="Major Leak in Unit 4B"
                                status="High Priority"
                                statusColor="red"
                                description="Kitchen sink pipe burst. Tenant reports flooding."
                                meta="Reported by Sarah J. • 2 hours ago"
                                icon={AlertCircle}
                                iconColor="red"
                            />
                            <TicketItem
                                title="AC Maintenance Required"
                                status="Pending"
                                statusColor="amber"
                                description="Scheduled seasonal maintenance for Block C."
                                meta="Assigned to Tech A. • 5 hours ago"
                                icon={Ticket}
                                iconColor="amber"
                            />
                            <TicketItem
                                title="Lobby Light Replacement"
                                status="Resolved"
                                statusColor="green"
                                description="Replaced 4 halogen bulbs with LED."
                                meta="Fixed by Mike • Yesterday"
                                icon={CheckCircle}
                                iconColor="green"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Finances or Quick Stats (1/3 width) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden h-full">
                        <div className="p-6 border-b border-border">
                            <h3 className="font-bold text-foreground">Recent Activity</h3>
                        </div>

                        <div className="divide-y divide-border">
                            {/* Reusing PaymentRow logic but maybe adapting for generic activity if not admin? 
                                 Admin page showed Payments. Staying consistent. */}
                            <PaymentRow
                                initials="OJ"
                                name="Ola Johnson"
                                detail="Unit 12 • Rent"
                                amount="₦120,000"
                                status="Success"
                                color="blue"
                            />
                            <PaymentRow
                                initials="MA"
                                name="Mary Adebayo"
                                detail="Unit 5A • Service"
                                amount="₦45,000"
                                status="Success"
                                color="purple"
                            />
                            <PaymentRow
                                initials="DK"
                                name="David King"
                                detail="Unit 2B • Utility"
                                amount="₦15,000"
                                status="Failed"
                                color="red"
                            />
                        </div>

                        <div className="p-4 bg-muted/30 border-t border-border text-center">
                            <Button variant="link" className="text-sm text-muted-foreground">View All Activity</Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
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
