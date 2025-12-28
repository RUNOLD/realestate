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
        PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/20",
        IN_PROGRESS: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/20",
        RESOLVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/20",
        CLOSED: "bg-muted text-muted-foreground border-border",
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${styles[status] || 'bg-muted text-muted-foreground border-border'}`}>
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
            <Link href="/admin/tickets" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                <ArrowLeft size={14} /> Back to Tickets
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <div>
                            <h1 className="text-xl font-bold text-foreground mb-2">{ticket.subject}</h1>
                            <div className="flex flex-wrap gap-2">
                                <StatusBadge status={ticket.status} />
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                                    {ticket.category}
                                </span>
                                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${ticket.priority === 'URGENT' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                                    ticket.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                                        'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                    }`}>
                                    {ticket.priority} Priority
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5">
                                    <User size={14} />
                                </div>
                                <div>
                                    <Link href={`/admin/users?query=${encodeURIComponent(ticket.user.email)}`} className="text-sm font-bold text-foreground hover:text-primary hover:underline transition-colors block">
                                        {ticket.user.name}
                                    </Link>
                                    <p className="text-xs text-muted-foreground">{ticket.user.email}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest mt-1">{ticket.user.role}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground mt-0.5">
                                    <Clock size={14} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Created on</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Description</h3>
                            <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/50">
                                {ticket.description}
                            </p>
                        </div>

                        {/* Actions for Admin */}
                        {userRole === 'ADMIN' && ticket.status !== 'RESOLVED' && (
                            <div className="pt-4 border-t border-border">
                                <form action={async () => {
                                    'use server';
                                    await approveTicket(ticket.id, 'ADMIN'); // Reusing approval for "Resolve/Work" flow
                                }}>
                                    <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-primary/20" variant="outline">
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
                        claimedById={(ticket as any).claimedById}
                        isTenant={false}
                    />
                </div>
            </div>
        </div>
    );
}
