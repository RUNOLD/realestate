import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { ChatBox } from "@/components/admin/tickets/ChatBox";
import { Badge } from "@/components/ui/badge"; // Ensure this exists or use standard badge
import { Button } from "@/components/ui/button"; // Reused
import Link from "next/link";
import { ArrowLeft, Clock, User, Tag, AlertCircle } from "lucide-react";
import { approveTicket } from "@/actions/ticket";

// Small Badge Component if not exists
function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        IN_PROGRESS: "bg-blue-100 text-blue-800",
        RESOLVED: "bg-green-100 text-green-800",
        CLOSED: "bg-gray-100 text-gray-800",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
}

export default async function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) redirect('/login');

    const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
            user: {
                select: { name: true, email: true, role: true } // Requester info
            },
            comments: {
                include: {
                    user: { select: { name: true, role: true, id: true } }
                },
                orderBy: { createdAt: 'asc' }
            }
        }
    });

    if (!ticket) notFound();

    // Check permissions: Admin/Staff can see all, Users can only see their own
    const userRole = (session.user as any).role;
    if (userRole === 'USER' && ticket.userId !== session.user.id && userRole !== 'TENANT') {
        // Tenants are effectively users here, assuming role name is consistent
        if (ticket.userId !== session.user.id) redirect('/dashboard');
    }

    return (
        <div className="space-y-6">
            <Link href="/admin/tickets" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                <ArrowLeft size={14} /> Back to Tickets
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 mb-2">{ticket.subject}</h1>
                            <div className="flex flex-wrap gap-2">
                                <StatusBadge status={ticket.status} />
                                <span className="text-xs px-2.5 py-0.5 bg-gray-100 rounded-full text-gray-600 font-medium">
                                    {ticket.category}
                                </span>
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${ticket.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                                    ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                        'bg-blue-50 text-blue-800'
                                    }`}>
                                    {ticket.priority} Priority
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-start gap-3">
                                <User className="w-4 h-4 text-gray-400 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{ticket.user.name}</p>
                                    <p className="text-xs text-gray-500">{ticket.user.email}</p>
                                    <p className="text-xs text-gray-400 uppercase">{ticket.user.role}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="w-4 h-4 text-gray-400 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Created on</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                {ticket.description}
                            </p>
                        </div>

                        {/* Actions for Admin */}
                        {userRole === 'ADMIN' && ticket.status !== 'RESOLVED' && (
                            <div className="pt-4 border-t border-gray-100">
                                <form action={async () => {
                                    'use server';
                                    await approveTicket(ticket.id, 'ADMIN'); // Reusing approval for "Resolve/Work" flow
                                }}>
                                    <Button className="w-full" variant="outline">
                                        Mark as In Progress / Approved
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Chat */}
                <div className="lg:col-span-2">
                    <ChatBox
                        ticketId={ticket.id}
                        initialComments={ticket.comments.map(c => ({
                            ...c,
                            user: {
                                name: c.user.name,
                                role: c.user.role,
                                id: c.user.id
                            }
                        }))}
                        currentUserIds={session.user.id!}
                    />
                </div>
            </div>
        </div>
    );
}
