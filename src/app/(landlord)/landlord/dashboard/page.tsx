
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Building,
    CreditCard,
    Users,
    Calendar,
    Settings,
    Wrench,
    ClipboardList,
    CheckCircle2,
    Home,
    MapPin,
    Banknote,
    ArrowUpRight
} from "lucide-react";

export default async function LandlordDashboard() {
    const session = await auth();
    if (!session?.user) return null;

    const properties = await prisma.property.findMany({
        where: { ownerId: session.user.id },
        include: {
            leases: {
                include: { user: true }
            },
            payments: {
                take: 5,
                orderBy: { createdAt: 'desc' },
                where: { approvalStatus: 'APPROVED' },
                include: { user: true }
            }
        }
    });

    // Extract Tenant IDs to fetch their maintenance tickets
    const myTenantIds = Array.from(new Set(
        // @ts-ignore
        properties.flatMap(p => p.leases.filter(l => l.isActive).map(l => l.userId))
    ));

    const tickets = await prisma.ticket.findMany({
        where: { userId: { in: myTenantIds } },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    // --- Stats Calculation ---
    const totalProperties = properties.length;
    const activeLeases = properties.reduce((acc, p) => acc + p.leases.filter(l => l.isActive).length, 0);

    // Revenue
    const totalRevenue = properties.reduce((acc, p) => {
        // @ts-ignore
        return acc + p.payments.reduce((sum, pay) => sum + pay.amount, 0);
    }, 0);

    // Open Maintenance Tickets (Count from fetched tickets, or fetch raw count if needed for accuracy globally)
    // For dashboard stats, strict accuracy of ALL open tickets for these tenants:
    const openTicketsCount = await prisma.ticket.count({
        where: {
            userId: { in: myTenantIds },
            status: { in: ['OPEN', 'IN_PROGRESS'] }
        }
    });

    // --- Aggregated Lists ---
    const allPayments = properties
        // @ts-ignore
        .flatMap(p => p.payments.map(pay => ({
            ...pay,
            propertyTitle: p.title,
            tenantName: pay.user?.name || 'Unknown'
        })))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

    // Map tickets to potential properties (best effort via current lease)
    // A tenant might have multiple active leases? Unlikely but possible.
    const allTickets = tickets.map(t => {
        // Find property this user is renting
        // @ts-ignore
        const userProperty = properties.find(p => p.leases.some(l => l.userId === t.userId && l.isActive));
        return {
            ...t,
            propertyTitle: userProperty?.title || 'General Request',
            tenantName: t.user?.name || 'Unknown'
        };
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">Landlord Portal</h1>
                    <p className="text-muted-foreground">Welcome back, {session.user.name}. Here's what's happening with your portfolio.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/landlord/settings">
                        <Button variant="outline" className="gap-2 bg-card border-border hover:bg-muted font-medium text-foreground">
                            <Settings size={16} /> Settings
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Properties</CardTitle>
                        <Building className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{totalProperties}</div>
                        <p className="text-xs text-muted-foreground mt-1">Units in your portfolio</p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active Tenants</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{activeLeases}</div>
                        <p className="text-xs text-muted-foreground mt-1">Currently occupied units</p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Maintenance</CardTitle>
                        <Wrench className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{openTicketsCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active requests requiring attention</p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">₦{totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Recorded income to date</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left Column: Properties & Tickets (2/3 width) */}
                <div className="xl:col-span-2 space-y-8">

                    {/* Maintenance Updates Section (New Transparency Feature) */}
                    <Card className="bg-card border-border shadow-md">
                        <CardHeader className="border-b border-border/50 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <ClipboardList className="h-5 w-5 text-orange-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold text-foreground">Maintenance Transparency</CardTitle>
                                    <CardDescription>Track fixes and requests for your properties to ensure fairness.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {allTickets.length > 0 ? (
                                    allTickets.map(ticket => (
                                        <div key={ticket.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-foreground text-sm">{ticket.subject}</span>
                                                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 h-auto ${ticket.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                            'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                                        }`}>
                                                        {ticket.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Property: <span className="font-medium text-foreground">{ticket.propertyTitle}</span> • Tenant: {ticket.tenantName}
                                                </p>
                                                <p className="text-xs text-muted-foreground/80 italic">
                                                    "{(ticket.description || '').length > 60 ? (ticket.description || '').substring(0, 60) + '...' : (ticket.description || 'No description')}"
                                                </p>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-1">
                                                <span className="text-xs font-mono text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                {ticket.status === 'RESOLVED' && (
                                                    <div className="flex items-center text-xs text-emerald-500 font-medium">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" /> Fixed
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="inline-flex h-12 w-12 rounded-full bg-muted/50 items-center justify-center mb-3">
                                            <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground font-medium">No recent maintenance tickets.</p>
                                        <p className="text-xs text-muted-foreground/70">Your properties are in good shape!</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Properties List */}
                    <Card className="bg-card border-border shadow-md">
                        <CardHeader className="border-b border-border/50 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Home className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-lg font-bold text-foreground">Your Portfolio</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {properties.map(property => (
                                    <div key={property.id} className="group flex items-center justify-between p-4 border border-border rounded-xl bg-muted/10 hover:bg-muted/30 transition-all hover:shadow-sm">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-foreground text-sm">{property.title}</p>
                                                {(property as any).isMultiUnit && (
                                                    <Badge variant="secondary" className="text-[10px] h-5">Multi-Unit</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {property.location}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={
                                                property.status === 'AVAILABLE' ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20" :
                                                    property.status === 'RENTED' ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20" :
                                                        "bg-muted text-muted-foreground border-border"
                                            }>
                                                {property.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Financials (1/3 width) */}
                <div className="space-y-8">
                    <Card className="bg-card border-border shadow-lg h-full">
                        <CardHeader className="border-b border-border/50 pb-4 bg-muted/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                                        <Banknote className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <CardTitle className="text-lg font-bold text-foreground">Recent Payments</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 p-0">
                            <div className="divide-y divide-border/50">
                                {allPayments.map(payment => (
                                    <div key={payment.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                                <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground text-sm">₦{payment.amount.toLocaleString()}</p>
                                                <p className="text-xs text-muted-foreground">{payment.propertyTitle}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString()}</p>
                                            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase font-bold tracking-wider">
                                                Paid
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {allPayments.length === 0 && (
                                    <div className="p-8 text-center">
                                        <p className="text-sm text-muted-foreground">No payment history available.</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-muted/20 border-t border-border/50">
                                <Link href="/landlord/financials" className="flex items-center justify-center text-xs font-medium text-primary hover:underline">
                                    View Full Financial Report <ArrowUpRight className="ml-1 h-3 w-3" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
