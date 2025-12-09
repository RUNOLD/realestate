
import Link from "next/link";
import { signOut, auth } from "../../../auth";
import {
    LayoutDashboard,
    Building2,
    Users,
    Ticket,
    DollarSign,
    LogOut,
    Settings,
    Package,
    FileText,
    CheckCircle
} from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const userRole = (session?.user as any)?.role || 'USER';
    const isSuperAdmin = userRole === 'ADMIN';

    return (
        <div className="min-h-screen bg-background flex flex-col">

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
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <LayoutDashboard size={20} />
                                Dashboard
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
                            {/* Materials - Allow Staff? Assuming yes as it is operational */}
                            <Link href="/admin/materials" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <Package size={20} />
                                Materials
                            </Link>

                            {/* Super Admin / Owner Only Links */}
                            {isSuperAdmin && (
                                <>
                                    <Link href="/admin/approvals" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <CheckCircle size={20} />
                                        Approvals
                                    </Link>
                                    <Link href="/admin/financials" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <DollarSign size={20} />
                                        Financials
                                    </Link>
                                    <Link href="/admin/activity-logs" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                        <FileText size={20} />
                                        Activity Logs
                                    </Link>
                                </>
                            )}

                            {/* Settings - Available to All (Profile, Notifications etc) */}
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
