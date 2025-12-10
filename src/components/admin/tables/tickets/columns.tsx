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

export type Ticket = {
    id: string
    subject: string
    priority: string
    status: string
    category: string
    createdAt: Date
}

export const columns: ColumnDef<Ticket>[] = [
    {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row }) => <div className="font-medium line-clamp-1">{row.getValue("subject")}</div>,
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "priority",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Priority
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const priority = row.getValue("priority") as string
            return (
                <Badge variant={priority === 'HIGH' || priority === 'EMERGENCY' ? "destructive" : "outline"}>
                    {priority}
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
                <Badge variant={
                    status === 'RESOLVED' || status === 'CLOSED' ? "secondary" :
                        status === 'IN_PROGRESS' ? "default" : "outline"
                }>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
            return <div className="text-muted-foreground text-xs">{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const ticket = row.original

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
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/tickets/${ticket.id}`}>View Ticket</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
