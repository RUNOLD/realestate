"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    User as UserIcon,
    LogOut,
    LayoutDashboard,
    Building2,
    Users,
    Ticket,
    DollarSign,
    Settings,
    Package,
    FileText,
    CheckCircle,
    Wrench,
    CreditCard,
    Mail
} from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { handleSignOut } from "@/actions/auth";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About Us" },
    { href: "/materials", label: "Materials" },
    { href: "/contact", label: "Contact" },
];

const ADMIN_LINKS = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/inbox", label: "Inbox", icon: Mail },
    { href: "/admin/properties", label: "Properties", icon: Building2 },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/team", label: "Team", icon: Users },
    { href: "/admin/tickets", label: "Tickets", icon: Ticket },
    { href: "/admin/materials", label: "Materials", icon: Package },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

const TENANT_LINKS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
    { href: "/dashboard/maintenance", label: "Maintenance", icon: Wrench },
    { href: "/dashboard/documents", label: "Documents", icon: FileText },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Navbar({ user }: { user?: any }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const pathname = usePathname();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu on navigation
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const isAdminPath = pathname?.startsWith("/admin");
    const isDashboardPath = pathname?.startsWith("/dashboard");
    const userRole = user?.role;

    const getMobileLinks = () => {
        if (isAdminPath) {
            const links = [...ADMIN_LINKS];
            if (userRole === 'ADMIN') {
                links.push(
                    { href: "/admin/approvals", label: "Approvals", icon: CheckCircle },
                    { href: "/admin/financials", label: "Financials", icon: DollarSign }
                );
            }
            return links;
        }
        if (isDashboardPath) return TENANT_LINKS;
        return NAV_LINKS.map(link => ({ ...link, icon: null }));
    };

    const mobileLinks = getMobileLinks();
    const logoSrc = mounted && resolvedTheme === 'light' ? '/logo_light_new.png' : '/logo-white.png';

    const navbarBg = mounted && resolvedTheme === 'light'
        ? (isScrolled || isOpen ? "bg-[#E3EEEF]/95" : "bg-[#E3EEEF]/80")
        : (isScrolled || isOpen ? "bg-background/95" : "bg-background/80");

    return (
        <nav
            className={cn(
                "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out border-b py-3 md:py-4 backdrop-blur-md",
                navbarBg,
                (isScrolled || isOpen) ? "shadow-md border-border" : "border-transparent"
            )}
        >
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8">
                <div className="flex items-center justify-between h-14 sm:h-20">
                    {/* Brand Logo Section */}
                    <Link href="/" className="flex items-center gap-2 sm:gap-4 group min-w-0">
                        <div className="relative h-10 w-10 sm:h-16 sm:w-16 shrink-0">
                            {mounted && (
                                <Image
                                    src={logoSrc}
                                    alt="Ayoola Logo"
                                    fill
                                    className="object-contain transition-opacity duration-300"
                                    priority
                                />
                            )}
                        </div>

                        <div className="flex flex-col justify-center border-l border-border/60 pl-3 sm:pl-4 h-8 sm:h-12 min-w-0">
                            <span className="text-lg sm:text-2xl font-black tracking-tighter uppercase leading-none truncate block text-foreground">
                                Ayoola
                            </span>
                            <span className="text-[7px] sm:text-[9px] font-bold tracking-[0.05em] sm:tracking-[0.15em] text-muted-foreground uppercase mt-0.5 block">
                                Property Management & Sourcing Services LTD.
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Visible on XL (1280px+) */}
                    <div className="hidden xl:flex items-center gap-8">
                        <div className="flex items-center gap-6">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "text-sm font-bold transition-all hover:text-primary whitespace-nowrap relative group",
                                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {link.label}
                                    <span className={cn(
                                        "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                                        pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                                    )} />
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 pl-6 border-l border-border">
                            {user?.id && <NotificationPanel userId={user.id} />}
                            <ModeToggle />
                            {!(isAdminPath || isDashboardPath) ? (
                                <Button asChild size="sm" className="gap-2 px-5 font-bold rounded-lg shadow-sm">
                                    <Link href="/login">
                                        <UserIcon size={14} />
                                        Portal Login
                                    </Link>
                                </Button>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="bg-primary text-primary-foreground font-black">
                                                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1 p-2">
                                                <p className="text-sm font-bold leading-none text-foreground">{user?.name || user?.email}</p>
                                                <p className="text-xs leading-none text-muted-foreground uppercase tracking-widest font-black pt-1">
                                                    {user?.role || "User"}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                                            <Link href={isAdminPath ? "/admin/settings" : "/dashboard/settings"} className="flex items-center w-full">
                                                <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                                                Account Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 font-bold"
                                            onClick={() => handleSignOut()}
                                        >
                                            <LogOut className="mr-3 h-4 w-4" />
                                            Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle Button - Visible below XL */}
                    <div className="xl:hidden flex items-center gap-2">
                        {user?.id && <NotificationPanel userId={user.id} />}
                        {!(isAdminPath || isDashboardPath) && <ModeToggle />}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            className="hover:bg-primary/10 h-10 w-10 transition-colors"
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? (
                                <X size={24} className="text-primary" />
                            ) : (
                                <Menu size={24} className="text-foreground" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={cn(
                "xl:hidden absolute top-full left-0 w-full border-b shadow-2xl transition-all duration-300 ease-in-out overflow-hidden z-[60]",
                isOpen ? "max-h-[100vh] opacity-100 border-border" : "max-h-0 opacity-0 border-transparent",
                mounted && resolvedTheme === 'light' ? "bg-[#E3EEEF]" : "bg-background"
            )}>
                <div className="px-6 py-8 space-y-8 backdrop-blur-xl">
                    {(isAdminPath || isDashboardPath) && (
                        <div className="flex items-center justify-between pb-6 border-b border-border/50">
                            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Appearance</span>
                            <ModeToggle />
                        </div>
                    )}
                    <div className="space-y-1">
                        {mobileLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-4 text-xl font-bold tracking-tight transition-colors p-3 rounded-xl",
                                    pathname === link.href
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-foreground hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                {link.icon && <link.icon size={22} className={pathname === link.href ? "text-primary-foreground" : "text-primary"} />}
                                <span className="uppercase">{link.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-border/50">
                        {!(isAdminPath || isDashboardPath) ? (
                            <Button asChild className="w-full gap-3 px-6 font-black text-xl py-7 rounded-xl shadow-xl shadow-primary/20">
                                <Link href="/login">
                                    <UserIcon size={24} />
                                    Portal Login
                                </Link>
                            </Button>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-lg mb-4">
                                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black">
                                        {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold truncate text-foreground">{user?.name || user?.email}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{user?.role || 'User'}</p>
                                    </div>
                                </div>
                                <form action={handleSignOut} className="w-full">
                                    <Button type="submit" variant="destructive" className="w-full gap-3 px-6 font-black text-xl py-7 rounded-xl shadow-xl shadow-destructive/20 active:scale-95 transition-transform">
                                        <LogOut size={24} />
                                        Sign Out
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
