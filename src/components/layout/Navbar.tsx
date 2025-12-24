"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { handleSignOut } from "@/app/lib/actions";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About Us" }, // Now explicitly handled to stay on one line
    { href: "/materials", label: "Materials" },
    { href: "/contact", label: "Contact" },
];

export function Navbar({ user }: { user?: any }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
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

    return (
        <nav
            className={cn(
                "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out border-b py-3 md:py-4",
                isScrolled || isOpen
                    ? "bg-background/95 backdrop-blur-md shadow-md border-border"
                    : "bg-background/80 backdrop-blur-sm border-transparent"
            )}
        >
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8">
                <div className="flex items-center justify-between h-14 sm:h-20">
                    {/* Brand Logo Section */}
                    <Link href="/" className="flex items-center gap-2 sm:gap-4 group min-w-0">
                        <div className="relative h-10 w-10 sm:h-16 sm:w-16 shrink-0">
                            <Image
                                src="/logo-white.png"
                                alt="Ayoola Logo"
                                fill
                                className="object-contain invert dark:invert-0 transition-opacity"
                                priority
                            />
                        </div>

                        <div className="flex flex-col justify-center border-l border-border/60 pl-3 sm:pl-4 h-8 sm:h-12 min-w-0">
                            <span className="text-lg sm:text-2xl font-black tracking-tighter uppercase leading-none truncate block">
                                Ayoola
                            </span>
                            <span className="text-[7px] sm:text-[9px] font-bold tracking-[0.05em] sm:tracking-[0.15em] text-muted-foreground uppercase mt-0.5 truncate block max-w-[120px] sm:max-w-none">
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
                            <ModeToggle />
                            {!(pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) ? (
                                <Button asChild size="sm" className="gap-2 px-5 font-bold rounded-lg shadow-sm">
                                    <Link href="/login">
                                        <UserIcon size={14} />
                                        Portal Login
                                    </Link>
                                </Button>
                            ) : (
                                <form action={handleSignOut}>
                                    <Button type="submit" variant="destructive" size="sm" className="gap-2 px-5 font-bold rounded-lg shadow-sm">
                                        <LogOut size={14} />
                                        Sign Out
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle Button - Visible below XL */}
                    <div className="xl:hidden flex items-center gap-2">
                        <ModeToggle />
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
                "xl:hidden absolute top-full left-0 w-full bg-background border-b shadow-2xl transition-all duration-300 ease-in-out overflow-hidden z-[60]",
                isOpen ? "max-h-[100vh] opacity-100 border-border" : "max-h-0 opacity-0 border-transparent"
            )}>
                <div className="px-6 py-8 space-y-8 bg-background/50 backdrop-blur-xl">
                    <div className="space-y-4">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "block text-2xl font-black tracking-tighter uppercase transition-colors p-2 rounded-lg",
                                    pathname === link.href ? "bg-primary/5 text-primary" : "text-foreground hover:text-primary hover:bg-muted"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-border/50">
                        {!(pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) ? (
                            <Button asChild className="w-full gap-3 px-6 font-black text-xl py-7 rounded-xl shadow-xl shadow-primary/20">
                                <Link href="/login">
                                    <UserIcon size={24} />
                                    Portal Login
                                </Link>
                            </Button>
                        ) : (
                            <form action={handleSignOut} className="w-full">
                                <Button type="submit" variant="destructive" className="w-full gap-3 px-6 font-black text-xl py-7 rounded-xl shadow-xl shadow-destructive/20">
                                    <LogOut size={24} />
                                    Sign Out
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
