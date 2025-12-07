"use client";

import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { handleSignOut } from "@/app/lib/actions";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navbar({ user }: { user?: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const showSignOut = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard');

    return (
        <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-serif font-bold text-accent tracking-wider">
                            AYOOLA
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        {!showSignOut && (
                            <div className="ml-10 flex items-baseline space-x-8">
                                <Link href="/" className="hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">
                                    Home
                                </Link>
                                <Link href="/properties" className="hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">
                                    Properties
                                </Link>
                                <Link href="/materials" className="hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">
                                    Materials
                                </Link>
                                <Link href="/contact" className="hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">
                                    Contact
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="hidden md:block">
                        {showSignOut ? (
                            <form action={handleSignOut}>
                                <button type="submit" className="flex items-center gap-2 bg-destructive/90 text-destructive-foreground hover:bg-destructive px-4 py-2 rounded-md font-medium transition-colors">
                                    <LogOut size={18} />
                                    <span>Sign Out</span>
                                </button>
                            </form>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 bg-accent text-accent-foreground hover:bg-yellow-600 px-4 py-2 rounded-md font-medium transition-colors">
                                <User size={18} />
                                <span>Portal Login</span>
                            </Link>
                        )}
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-primary-foreground hover:text-accent focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-primary border-t border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {!showSignOut && (
                            <>
                                <Link href="/" className="block hover:text-accent px-3 py-2 rounded-md text-base font-medium">
                                    Home
                                </Link>
                                <Link href="/properties" className="block hover:text-accent px-3 py-2 rounded-md text-base font-medium">
                                    Properties
                                </Link>
                                <Link href="/materials" className="block hover:text-accent px-3 py-2 rounded-md text-base font-medium">
                                    Materials
                                </Link>
                                <Link href="/contact" className="block hover:text-accent px-3 py-2 rounded-md text-base font-medium">
                                    Contact
                                </Link>
                            </>
                        )}
                        {showSignOut ? (
                            <form action={handleSignOut} className="w-full">
                                <button type="submit" className="flex w-full items-center gap-2 text-left hover:text-accent px-3 py-2 rounded-md text-base font-medium text-destructive-foreground">
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </form>
                        ) : (
                            <Link href="/login" className="block hover:text-accent px-3 py-2 rounded-md text-base font-medium">
                                Portal Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
