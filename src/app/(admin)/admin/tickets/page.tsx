import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    Edit,
    Clock,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    MoreHorizontal,
    User
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TicketApprovalActions } from "@/components/admin/tickets/TicketApprovalActions";
import { CreateTicketModal } from "@/components/admin/tickets/CreateTicketModal";
import { ExportTicketsButton } from "@/components/admin/tickets/ExportTicketsButton";

export default async function AdminTicketsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
    const { status: filterStatus } = await searchParams;

    // 1. Fetch Data
    const tickets = await prisma.ticket.findMany({
        where: filterStatus && filterStatus !== 'ALL' ? {
            OR: [
                { status: filterStatus as any },
                { approvalStatus: filterStatus as any }
            ]
        } : {},
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    // 2. Calculate Stats
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'OPEN').length;
    const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length;

    // 3. Fetch Tenants for Create Modal
    const tenants = await prisma.user.findMany({
        where: { role: 'TENANT' },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' }
    });

    // Serialize tickets for client component (Prisma Decimals cannot be passed directly)
    const serializedTickets = tickets.map(t => ({
        ...t,
        costEstimated: t.costEstimated ? Number(t.costEstimated) : null,
        costActual: t.costActual ? Number(t.costActual) : null,
    }));

    return (
        <div className="min-h-screen bg-muted/5 p-6 sm:p-8 space-y-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Support Tickets</h1>
                        <p className="text-muted-foreground mt-1">Manage maintenance requests and tenant issues.</p>
                    </div>
                    <div className="flex gap-2">
                        <ExportTicketsButton tickets={serializedTickets} />
                        <CreateTicketModal tenants={tenants} />
                    </div>
                </div>

                {/* KPI Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between transition-all hover:shadow-md">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Issues</p>
                            <h3 className="text-3xl font-black text-foreground mt-2">{openTickets}</h3>
                        </div>
                        <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between transition-all hover:shadow-md">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Resolved</p>
                            <h3 className="text-3xl font-black text-foreground mt-2">{resolvedTickets}</h3>
                        </div>
                        <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between transition-all hover:shadow-md">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Volume</p>
                            <h3 className="text-3xl font-black text-foreground mt-2">{totalTickets}</h3>
                        </div>
                        <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <MessageSquare size={24} />
                        </div>
                    </div>
                </div>

                {/* Main Ticket List */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">

                    {/* Toolbar */}
                    <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
                        {/* Tabs */}
                        <div className="flex bg-muted p-1 rounded-lg">
                            <Link
                                href="/admin/tickets?status=ALL"
                                className={cn(
                                    "px-4 py-1.5 text-sm font-semibold rounded-md transition-all",
                                    (!filterStatus || filterStatus === 'ALL') ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                All
                            </Link>
                            <Link
                                href="/admin/tickets?status=PENDING_MANAGER"
                                className={cn(
                                    "px-4 py-1.5 text-sm font-semibold rounded-md transition-all",
                                    filterStatus === 'PENDING_MANAGER' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Manager Review
                            </Link>
                            <Link
                                href="/admin/tickets?status=PENDING_ADMIN"
                                className={cn(
                                    "px-4 py-1.5 text-sm font-semibold rounded-md transition-all",
                                    filterStatus === 'PENDING_ADMIN' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Admin Review
                            </Link>
                            <Link
                                href="/admin/tickets?status=RESOLVED"
                                className={cn(
                                    "px-4 py-1.5 text-sm font-semibold rounded-md transition-all",
                                    filterStatus === 'RESOLVED' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Resolved
                            </Link>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search by subject or ID..."
                                    className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground border border-border rounded-lg hover:bg-muted hover:text-foreground">
                                <Filter size={16} />
                            </Button>
                        </div>
                    </div>

                    {/* Rich Table List */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Ticket Details</th>
                                    <th className="px-6 py-4">Requester</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Last Updated</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {tickets.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center">
                                                <CheckCircle className="h-10 w-10 text-emerald-500 mb-3" />
                                                <p className="font-semibold text-foreground">All caught up!</p>
                                                <p className="text-sm mt-1">No pending tickets found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    tickets.map((ticket) => (
                                        <tr
                                            key={ticket.id}
                                            className={cn(
                                                "group transition-colors bg-card",
                                                ticket.approvalStatus?.includes('PENDING') ? "hover:bg-amber-500/5 dark:hover:bg-amber-900/10" : "hover:bg-muted/50"
                                            )}
                                        >

                                            {/* Column 1: Subject & ID */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground text-base group-hover:text-primary transition-colors">{ticket.subject}</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="font-mono text-xs text-muted-foreground/70">#{ticket.id.substring(0, 6)}</span>
                                                        <span className="text-muted-foreground/30">•</span>
                                                        <span className="text-[10px] font-bold tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full uppercase">
                                                            {ticket.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 2: Requester */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <Link href={`/admin/users?query=${encodeURIComponent(ticket.user.email)}`} className="font-medium text-foreground hover:text-primary hover:underline transition-colors block">
                                                            {ticket.user?.name || 'Unknown'}
                                                        </Link>
                                                        <div className="text-xs text-muted-foreground">{ticket.user?.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 3: Status Badge */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2 items-start">
                                                    <StatusBadge status={ticket.status} />
                                                    {ticket.requiresApproval && (
                                                        <div className="text-xs flex items-center gap-1.5">
                                                            <span className="font-medium text-muted-foreground">Approval:</span>
                                                            <span className={`font-mono font-bold tracking-tight
                                                                ${ticket.approvalStatus === 'APPROVED' ? 'text-emerald-600 dark:text-emerald-400' :
                                                                    ticket.approvalStatus?.includes('PENDING') ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
                                                                {ticket.approvalStatus}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column 4: Date */}
                                            <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 font-medium text-xs">
                                                    <Clock size={14} className="text-primary/50" />
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>

                                            {/* Column 5: Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 items-center">
                                                    {ticket.requiresApproval && (
                                                        <TicketApprovalActions ticketId={ticket.id} approvalStatus={ticket.approvalStatus} />
                                                    )}
                                                    <Link href={`/admin/tickets/${ticket.id}`} passHref>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Component for Status Badges
function StatusBadge({ status }: { status: string }) {
    const styles = {
        PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/20 ring-amber-500/20",
        IN_PROGRESS: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/20 ring-blue-500/20",
        RESOLVED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/20 ring-emerald-500/20",
        CLOSED: "bg-muted text-muted-foreground border-border ring-border",
        OPEN: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200/20 ring-purple-500/20",
    };

    const label = status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ring-1 ring-inset ${styles[status as keyof typeof styles] || styles.CLOSED}`}>
            {status === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>}
            {status === 'OPEN' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5"></span>}
            {status === 'RESOLVED' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
            {label}
        </span>
    );
}
