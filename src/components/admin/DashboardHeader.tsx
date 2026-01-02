'use client'

import { Button } from "@/components/ui/button";
import { Plus, Search, Building2, Users, Ticket as TicketIcon, Wallet, Layers } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { handleSignOut } from "@/actions/auth";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
    currentDate: string;
    userName?: string | null;
}

export function DashboardHeader({ currentDate, userName }: DashboardHeaderProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/admin/properties?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-1">
                <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase opacity-80">{currentDate}</p>
                <h1 className="text-3xl font-black tracking-tight text-foreground">Welcome back, {userName || 'Admin'}</h1>
                <p className="text-muted-foreground font-medium">Here is what's happening with your portfolio today.</p>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" className="group" onClick={() => setIsSearchOpen(true)}>
                    <Search className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    <span className="hidden sm:inline">Search Portfolio</span>
                    <span className="sm:hidden">Find</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="font-bold shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" /> Quick Action
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2">
                        <DropdownMenuLabel className="text-xs uppercase text-gray-400 font-bold tracking-wider">Create New</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                            <Link href="/admin/properties/new" className="flex items-center w-full">
                                <Building2 className="mr-3 h-4 w-4 text-blue-500" /> Property
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                            <Link href="/admin/tenants/new" className="flex items-center w-full">
                                <Users className="mr-3 h-4 w-4 text-indigo-500" /> User / Tenant
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                            <Link href="/admin/materials/new" className="flex items-center w-full">
                                <Layers className="mr-3 h-4 w-4 text-amber-500" /> Material
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                            <Link href="/admin/tickets" className="flex items-center w-full">
                                <TicketIcon className="mr-3 h-4 w-4 text-red-500" /> View Tickets
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={() => handleSignOut()}
                        >
                            <LogOut className="mr-3 h-4 w-4" /> Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogContent className="sm:max-w-[500px] border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Search Portfolio</DialogTitle>
                        <DialogDescription>
                            Find properties, tenants, or maintenance records instantly.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSearch} className="space-y-6 pt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Start typing name, address, or ID..."
                                className="pl-11 h-12 text-lg focus-visible:ring-gray-900"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="text-xs text-gray-400">Search is case-insensitive</span>
                            <Button type="submit" size="sm" className="bg-gray-900">Search Now</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
