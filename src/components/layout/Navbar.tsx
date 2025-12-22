"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { handleSignOut } from "@/app/lib/actions";
import { usePathname } from "next/navigation";

export function Navbar({ user }: { user?: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const showSignOut = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard');

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/properties", label: "Properties" },
        { href: "/services", label: "Services" },
        { href: "/about", label: "About Us" },
        { href: "/materials", label: "Materials" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 bg-[#0f172a]/90 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">
                    {/* Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="hover:opacity-80 transition-opacity duration-300">
                            <Image
                                src="/logo.png"
                                alt="Ayoola Property Management Logo"
                                width={180}
                                height={60}
                                className="h-16 w-auto object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:block">
                        {!showSignOut && (
                            <div className="ml-10 flex items-baseline space-x-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="group relative px-1 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
                                    >
                                        {link.label}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Auth Button */}
                    <div className="hidden lg:block">
                        {showSignOut ? (
                            <form action={handleSignOut}>
                                <button type="submit" className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg">
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </button>
                            </form>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 bg-accent text-[#0f172a] hover:bg-white hover:text-[#0f172a] px-5 py-2.5 rounded-md text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                <UserIcon size={18} />
                                <span>Portal Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "lg:hidden bg-[#0f172a] border-t border-white/10 transition-all duration-300 ease-in-out overflow-hidden",
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {!showSignOut && navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-4 pb-2">
                        {showSignOut ? (
                            <form action={handleSignOut} className="w-full">
                                <button type="submit" className="flex w-full items-center justify-center gap-2 bg-red-500/10 text-red-500 px-3 py-3 rounded-md text-base font-medium hover:bg-red-500/20 transition-colors">
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </form>
                        ) : (
                            <Link
                                href="/login"
                                className="flex w-full items-center justify-center gap-2 bg-accent text-[#0f172a] px-3 py-3 rounded-md text-base font-semibold hover:bg-white transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <UserIcon size={18} />
                                Portal Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
