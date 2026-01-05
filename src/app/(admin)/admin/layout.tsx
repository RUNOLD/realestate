
import Link from "next/link";
import { signOut, auth } from "@/auth";
import { redirect } from "next/navigation";
import {
    LayoutDashboard,
    Building2,
    Users,
    Ticket,
    DollarSign,
    TrendingUp,
    CreditCard,
    LogOut,
    Settings,
    Package,
    FileText,
    CheckCircle,
} from "lucide-react";
import { SessionTimeout } from "@/components/auth/SessionTimeout";

import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // REDUNDANT CHECK: Ensure session exists
    if (!session?.user) {
        redirect('/login');
    }

    const userId = session.user.id; // Define userId here for use in notification count

    let unreadCount = 0;
    try {
        unreadCount = await prisma.notification.count({
            where: {
                userId,
                isRead: false,
                type: 'CHAT',
                ticketId: { not: null }
            } // specifically checking new replies/chats for the maintenance dot AND ensure ticket exists
        });
    } catch (error) {
        console.error("Failed to fetch notification count, trying raw query:", error);
        try {
            const result = await prisma.$queryRaw<any[]>`SELECT COUNT(*)::int as count FROM "Notification" WHERE "userId" = ${userId} AND "isRead" = false AND "type" = 'CHAT' AND "ticketId" IS NOT NULL`;
            unreadCount = result[0]?.count || 0;
        } catch (rawError) {
            console.error("Raw query also failed:", rawError);
        }
    }

    let activeTicketCount = 0;
    try {
        activeTicketCount = await prisma.ticket.count({
            where: {
                status: {
                    notIn: ['RESOLVED', 'CLOSED']
                }
            }
        });
    } catch (error) {
        console.error("Failed to fetch admin ticket count, trying raw query:", error);
        try {
            const result = await prisma.$queryRaw<any[]>`SELECT COUNT(*)::int as count FROM "Ticket" WHERE status NOT IN ('RESOLVED', 'CLOSED')`;
            activeTicketCount = result[0]?.count || 0;
        } catch (rawError) {
            console.error("Raw query also failed:", rawError);
        }
    }

    const userRole = (session?.user as any)?.role || 'USER';

    const isSuperAdmin = userRole === 'ADMIN';

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SessionTimeout />

            <div className="flex flex-1">
                {/* Admin Sidebar */}
                <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                                {userRole.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-medium text-foreground">{session?.user?.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground">{userRole}</p>
                            </div>
                        </div>
                        <nav className="space-y-2">
                            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <LayoutDashboard size={20} />
                                Dashboard
                            </Link>
                            <Link href="/admin/properties" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <Building2 size={20} />
                                Properties
                            </Link>
                            <Link href="/admin/users?role=TENANT" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <Users size={20} />
                                Tenants
                            </Link>
                            <Link href="/admin/users?role=LANDLORD" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <Building2 size={20} />
                                Landlords
                            </Link>
                            <Link href="/admin/team" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <Users size={20} />
                                Staff & Team
                            </Link>
                            <Link href="/admin/financials" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <DollarSign size={20} />
                                Rent Payments
                            </Link>
                            <Link href="/admin/payouts" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <CreditCard size={20} />
                                Payouts
                            </Link>
                            <Link href="/admin/tickets" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors justify-between">
                                <div className="flex items-center gap-3">
                                    <Ticket size={20} />
                                    Maintenance
                                </div>
                                {activeTicketCount > 0 && (
                                    <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                                )}
                            </Link>
                            <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <TrendingUp size={20} />
                                Reports
                            </Link>

                            <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <Settings size={20} />
                                Settings
                            </Link>
                        </nav>
                    </div>
                    <div className="mt-auto p-6 border-t border-border">
                        <form action={async () => {
                            'use server';
                            await signOut();
                        }}>
                            <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-md font-medium transition-colors">
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto bg-muted/10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
