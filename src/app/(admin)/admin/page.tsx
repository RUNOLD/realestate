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

export default async function AdminDashboardPage() {
    const session = await auth();
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
        redirect("/login");
    }

    // Mock Date for the header
    const currentDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* 1. Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{currentDate}</p>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back, Admin</h1>
                        <p className="text-gray-500">Here is what's happening with your portfolio today.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="bg-white hover:bg-gray-50">
                            <Search className="mr-2 h-4 w-4" /> Search
                        </Button>
                        <Button className="bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/20">
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
                    />
                    {session?.user.role === 'ADMIN' && (
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-900">Recent Maintenance Requests</h3>
                                    <p className="text-sm text-gray-500">You have 8 requests pending review.</p>
                                </div>
                                <Button variant="ghost" className="text-sm text-blue-600 hover:text-blue-700">View All</Button>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {/* Ticket Item 1 */}
                                <div className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4 group">
                                    <div className="mt-1 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-gray-900 text-sm">Major Leak in Unit 4B</h4>
                                            <span className="text-xs font-medium bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full">High Priority</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Kitchen sink pipe burst. Tenant reports flooding.</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                            <span>Reported by Sarah J.</span>
                                            <span>•</span>
                                            <span>2 hours ago</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal size={16} />
                                    </Button>
                                </div>

                                {/* Ticket Item 2 */}
                                <div className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4 group">
                                    <div className="mt-1 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                        <Ticket size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-gray-900 text-sm">AC Maintenance Required</h4>
                                            <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full">Pending</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Scheduled seasonal maintenance for Block C.</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                            <span>Assigned to Tech A.</span>
                                            <span>•</span>
                                            <span>5 hours ago</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal size={16} />
                                    </Button>
                                </div>

                                {/* Ticket Item 3 */}
                                <div className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4 group">
                                    <div className="mt-1 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-gray-900 text-sm">Lobby Light Replacement</h4>
                                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">Resolved</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Replaced 4 halogen bulbs with LED.</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                            <span>Fixed by Mike</span>
                                            <span>•</span>
                                            <span>Yesterday</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Finances (1/3 width) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900">Recent Payments</h3>
                            </div>

                            <div className="divide-y divide-gray-100">
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
                                    initials="CN"
                                    name="Chinedu N."
                                    detail="Unit 8 • Rent"
                                    amount="₦95,000"
                                    status="Pending"
                                    color="orange"
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

                            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                                <Button variant="link" className="text-sm text-gray-600">View All Transactions</Button>
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
