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
import { TicketApprovalActions } from "@/components/admin/tickets/TicketApprovalActions";
import { CreateTicketModal } from "@/components/admin/tickets/CreateTicketModal";
import { ExportTicketsButton } from "@/components/admin/tickets/ExportTicketsButton";

export default async function AdminTicketsPage() {
    // 1. Fetch Data
    const tickets = await prisma.ticket.findMany({
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

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Support Tickets</h1>
                        <p className="text-gray-500 mt-1">Manage maintenance requests and tenant issues.</p>
                    </div>
                    <div className="flex gap-2">
                        <ExportTicketsButton tickets={tickets} />
                        <CreateTicketModal tenants={tenants} />
                    </div>
                </div>

                {/* KPI Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Issues</p>
                            <h3 className="text-3xl font-bold text-gray-900">{openTickets}</h3>
                        </div>
                        <div className="h-12 w-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Resolved</p>
                            <h3 className="text-3xl font-bold text-gray-900">{resolvedTickets}</h3>
                        </div>
                        <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Volume</p>
                            <h3 className="text-3xl font-bold text-gray-900">{totalTickets}</h3>
                        </div>
                        <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <MessageSquare size={24} />
                        </div>
                    </div>
                </div>



                [Image of financial dashboard wireframe layout]


                {/* Main Ticket List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/30">
                        {/* Tabs */}
                        <div className="flex bg-gray-100/80 p-1 rounded-lg">
                            <button className="px-4 py-1.5 text-sm font-medium bg-white shadow-sm rounded-md text-gray-900">All</button>
                            <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">Pending</button>
                            <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">Resolved</button>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by subject or ID..."
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                                />
                            </div>
                            <Button variant="ghost" size="icon" className="text-gray-500 border border-gray-200 rounded-lg">
                                <Filter size={16} />
                            </Button>
                        </div>
                    </div>

                    {/* Rich Table List */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Ticket Details</th>
                                    <th className="px-6 py-4">Requester</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Last Updated</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tickets.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <CheckCircle className="h-10 w-10 text-green-500 mb-3" />
                                                <p className="font-medium text-gray-900">All caught up!</p>
                                                <p className="text-sm mt-1">No pending tickets found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    tickets.map((ticket) => (
                                        <tr key={ticket.id} className="group hover:bg-blue-50/30 transition-colors">

                                            {/* Column 1: Subject & ID */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 text-base">{ticket.subject}</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="font-mono text-xs text-gray-400">#{ticket.id.substring(0, 6)}</span>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                            {ticket.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 2: Requester */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                                        <User size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{ticket.user?.name || 'Unknown'}</div>
                                                        <div className="text-xs text-gray-500">{ticket.user?.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 3: Status Badge */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <StatusBadge status={ticket.status} />
                                                    {ticket.requiresApproval && (
                                                        <div className="text-xs">
                                                            <span className="font-medium text-gray-500 mr-1">Approval:</span>
                                                            <span className={`font-mono 
                                                                ${ticket.approvalStatus === 'APPROVED' ? 'text-green-600' :
                                                                    ticket.approvalStatus?.includes('PENDING') ? 'text-amber-600' : 'text-gray-500'}`}>
                                                                {ticket.approvalStatus}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column 4: Date */}
                                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>

                                            {/* Column 5: Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 items-center">
                                                    {ticket.requiresApproval && (
                                                        <TicketApprovalActions ticketId={ticket.id} approvalStatus={ticket.approvalStatus} />
                                                    )}
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal size={16} className="text-gray-400" />
                                                    </Button>
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
        PENDING: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
        IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20",
        RESOLVED: "bg-green-50 text-green-700 border-green-200 ring-green-500/20",
        CLOSED: "bg-gray-50 text-gray-700 border-gray-200 ring-gray-500/20",
    };

    const label = status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ring-1 ring-inset ${styles[status as keyof typeof styles] || styles.CLOSED}`}>
            {status === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>}
            {status === 'RESOLVED' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>}
            {label}
        </span>
    );
}
