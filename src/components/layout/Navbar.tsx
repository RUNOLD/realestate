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
    const [isVisible, setIsVisible] = React.useState(true);
    const pathname = usePathname();

    React.useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY < 10);
            if (window.scrollY >= 10) setIsOpen(false);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out border-b py-4",
                isVisible
                    ? "translate-y-0 opacity-100 bg-background/80 backdrop-blur-md border-border"
                    : "-translate-y-full opacity-0 pointer-events-none border-transparent"
            )}
        >
            {/* Adjusted max-width and padding to push content further left */}
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Brand Logo Section: Increased gap and left-alignment */}
                    <Link href="/" className="flex items-center gap-6 group">
                        <div className="relative h-16 w-16 sm:h-24 sm:w-24 shrink-0">
                            <Image
                                src="/logo-white.png"
                                alt="Ayoola Logo"
                                fill
                                className="object-contain invert dark:invert-0 transition-transform group-hover:scale-105"
                                priority
                            />
                        </div>

                        {/* Added whitespace-nowrap to prevent sub-text from breaking */}
                        <div className="flex flex-col justify-center border-l-2 border-border/60 pl-6 h-14 whitespace-nowrap">
                            <span className="text-3xl font-black tracking-tighter uppercase leading-none">
                                Ayoola
                            </span>
                            <span className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase mt-1">
                                Property Management & Sourcing LTD.
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-10">
                        <div className="flex items-center gap-8">
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
                                        "absolute -bottom-2 left-0 h-0.5 bg-primary transition-all duration-300",
                                        pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                                    )} />
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 pl-8 border-l border-border">
                            <ModeToggle />
                            {!(pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) ? (
                                <Button asChild size="sm" className="gap-2 px-6 font-bold">
                                    <Link href="/login">
                                        <UserIcon size={14} />
                                        Portal Login
                                    </Link>
                                </Button>
                            ) : (
                                <form action={handleSignOut}>
                                    <Button type="submit" variant="destructive" size="sm" className="gap-2 px-6 font-bold transition-all hover:bg-red-600">
                                        <LogOut size={14} />
                                        Sign Out
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="lg:hidden flex items-center gap-3">
                        <ModeToggle />
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "lg:hidden absolute w-full bg-background border-b transition-all duration-300",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            )}>
                <div className="px-8 py-10 space-y-6">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block text-2xl font-bold whitespace-nowrap"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-6 border-t border-border/50">
                        {!(pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) ? (
                            <Button asChild className="w-full gap-2 px-6 font-bold text-lg py-6">
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <UserIcon size={18} />
                                    Portal Login
                                </Link>
                            </Button>
                        ) : (
                            <form action={handleSignOut}>
                                <Button type="submit" variant="destructive" className="w-full gap-2 px-6 font-bold text-lg py-6 transition-all hover:bg-red-600">
                                    <LogOut size={18} />
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
