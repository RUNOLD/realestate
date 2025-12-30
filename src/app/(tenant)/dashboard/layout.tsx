
import Link from "next/link";
import {
    LayoutDashboard,
    CreditCard,
    Wrench,
    FileText,
    LogOut,
    User,
    Settings,
    Building2,
    Users,
    Ticket,
    Package,
    CheckCircle,
    DollarSign,
    Mail
} from "lucide-react";
import { SessionTimeout } from "@/components/auth/SessionTimeout";
import { handleSignOut } from "@/actions/auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function BadgeWrapper({ userId }: { userId: string }) {
    const unreadCount = await prisma.notification.count({
        where: {
            userId,
            isRead: false,
            type: 'CHAT',
            ticketId: { not: null }
        } // specifically checking new replies/chats for the maintenance dot AND ensure ticket exists
    });

    if (unreadCount === 0) return null;

    return (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
    );
}



export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // REDUNDANT CHECK: Ensure session exists
    if (!session?.user) {
        redirect('/login');
    }

    const userRole = (session?.user as any)?.role;
    const userName = session?.user?.name || session?.user?.email || 'User';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SessionTimeout />

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
                                {userInitial}
                            </div>
                            <div>
                                <p className="font-medium text-foreground truncate max-w-[150px]">{userName}</p>
                                <p className="text-xs text-muted-foreground">{userRole || 'Tenant'}</p>
                            </div>
                        </div>
                        <nav className="space-y-2">
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-md font-medium">
                                <LayoutDashboard size={20} />
                                Dashboard
                            </Link>

                            {/* TENANT VIEW */}
                            {userRole === 'TENANT' && (
                                <>
                                    <Link href="/dashboard/payments" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <CreditCard size={20} />
                                        Payments
                                    </Link>
                                    <Link href="/dashboard/maintenance" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors relative">
                                        <Wrench size={20} />
                                        Maintenance
                                        {/* Red Dot for Unread Admin Replies */}
                                        <BadgeWrapper userId={session.user.id!} />
                                    </Link>
                                    <Link href="/dashboard/documents" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <FileText size={20} />
                                        Documents
                                    </Link>
                                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <Settings size={20} />
                                        Settings
                                    </Link>
                                </>
                            )}

                            {/* STAFF & ADMIN VIEW */}
                            {userRole !== 'TENANT' && (
                                <>
                                    <Link href="/admin/inbox" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <Mail size={20} />
                                        Inbox
                                    </Link>
                                    <Link href="/admin/properties" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <Building2 size={20} />
                                        Properties
                                    </Link>
                                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <Users size={20} />
                                        Users
                                    </Link>
                                    <Link href="/admin/team" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <Users size={20} />
                                        Team
                                    </Link>
                                    <Link href="/admin/tickets" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <Ticket size={20} />
                                        Tickets
                                    </Link>
                                    <Link href="/admin/materials" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <Package size={20} />
                                        Materials
                                    </Link>
                                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <Settings size={20} />
                                        Settings
                                    </Link>
                                </>
                            )}

                            {/* ADMIN ONLY VIEW */}
                            {userRole === 'ADMIN' && (
                                <>
                                    <Link href="/admin/approvals" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <CheckCircle size={20} />
                                        Approvals
                                    </Link>
                                    <Link href="/admin/financials" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <DollarSign size={20} />
                                        Financials
                                    </Link>

                                </>
                            )}
                        </nav>
                    </div>
                    <div className="mt-auto p-6 border-t border-border">
                        <form action={handleSignOut}>
                            <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-md font-medium transition-colors">
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div >
        </div >
    );
}
