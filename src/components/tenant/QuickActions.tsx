'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Plus, Building2, UserPlus, FileText, LogOut } from "lucide-react";
import { handleSignOut } from "@/actions/auth";

export function QuickActions() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    return (
        <div className="relative" ref={menuRef}>
            <Button

                className="shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Plus className="mr-2 h-4 w-4" /> Quick Action
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <Link
                            href="/admin/properties/new"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                        >
                            <Building2 className="mr-3 h-4 w-4 text-slate-500" />
                            Add Property
                        </Link>
                        <Link
                            href="/admin/users/new"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                        >
                            <UserPlus className="mr-3 h-4 w-4 text-slate-500" />
                            Add User
                        </Link>
                        <Link
                            href="/admin/properties"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                        >
                            <FileText className="mr-3 h-4 w-4 text-slate-500" />
                            View Reports
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                handleSignOut();
                            }}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                            role="menuitem"
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
