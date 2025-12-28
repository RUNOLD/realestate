
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Building2,
    DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth"; // We might need a client component for signout or server action

export default async function LandlordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user || session.user.role !== "LANDLORD") {
        // Double check, though middleware should catch this
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-muted/10 flex flex-col">
            {/* Top Navigation */}
            <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
                <Link href="/landlord/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                        <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-serif font-bold text-xl text-foreground tracking-tight">Landlord Portal</span>
                </Link>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:inline-block">Welcome, <span className="font-medium text-foreground">{session.user.name}</span></span>
                    <form action={async () => {
                        "use server";
                        await signOut();
                    }}>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                            <LogOut className="h-4 w-4 mr-2" /> Sign Out
                        </Button>
                    </form>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="hidden md:block w-64 bg-card border-r border-border p-4">
                    <nav className="space-y-1">
                        <Link href="/landlord/dashboard">
                            <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                <LayoutDashboard className="h-5 w-5 mr-3" /> Dashboard
                            </Button>
                        </Link>

                        <Link href="/landlord/settings">
                            <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                <Settings className="h-5 w-5 mr-3" /> Settings
                            </Button>
                        </Link>
                        <Link href="/landlord/financials">
                            <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                <DollarSign className="h-5 w-5 mr-3" /> Financials
                            </Button>
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
