"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, User, Home, Download } from "lucide-react";
import Link from "next/link";

interface TransactionActionsProps {
    payment: {
        id: string;
        userId: string;
        propertyId: string | null;
        amount: number;
        status: string;
    }
}

export function TransactionActions({ payment }: TransactionActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href={`/admin/users/${payment.userId}`} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>View Tenant</span>
                    </Link>
                </DropdownMenuItem>

                {payment.propertyId && (
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/properties/${payment.propertyId}`} className="cursor-pointer">
                            <Home className="mr-2 h-4 w-4" />
                            <span>View Property</span>
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer text-primary">
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download Receipt</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
