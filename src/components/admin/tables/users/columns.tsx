"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export type User = {
    id: string
    uniqueId: string | null
    name: string | null
    email: string | null
    role: "USER" | "TENANT" | "ADMIN" | "STAFF"
    status: "ACTIVE" | "PENDING" | "SUSPENDED" | "REJECTED"
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "uniqueId",
        header: "User ID",
        cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("uniqueId") || "N/A"}</div>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("name") || "N/A"}</div>,
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role") as string
            return (
                <Badge variant="outline">
                    {role}
                </Badge>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === 'ACTIVE' ? "default" : "secondary"}>
                    {status}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original
            const isStaff = user.role === 'ADMIN' || user.role === 'STAFF';
            const detailsLink = isStaff ? `/admin/users/${user.id}/staff` : `/admin/users/${user.id}`;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(user.uniqueId || user.id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={detailsLink}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/users/${user.id}/edit`}>Edit User</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu >
            )
        },
    },
]
