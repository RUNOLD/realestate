
import Link from "next/link";
import { LayoutDashboard, CreditCard, Wrench, FileText, LogOut, User, Settings } from "lucide-react";



export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="min-h-screen bg-background flex flex-col">

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
                                JD
                            </div>
                            <div>
                                <p className="font-medium text-foreground">John Doe</p>
                                <p className="text-xs text-muted-foreground">Tenant</p>
                            </div>
                        </div>
                        <nav className="space-y-2">
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-md font-medium">
                                <LayoutDashboard size={20} />
                                Dashboard
                            </Link>
                            <Link href="/dashboard/payments" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <CreditCard size={20} />
                                Payments
                            </Link>
                            <Link href="/dashboard/maintenance" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <Wrench size={20} />
                                Maintenance
                            </Link>
                            <Link href="/dashboard/documents" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <FileText size={20} />
                                Documents
                            </Link>
                            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
                                <Settings size={20} />
                                Settings
                            </Link>
                        </nav>
                    </div>
                    <div className="mt-auto p-6 border-t border-border">
                        {/* Sign Out Removed */}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
