import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AlertCircle, CheckCircle, Clock, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TicketForm } from "@/components/dashboard/TicketForm";

export default async function MaintenancePage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const tickets = await prisma.ticket.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Maintenance</h1>
                    <p className="text-muted-foreground">Report issues and track repair status.</p>
                </div>
                {/* <Button className="flex items-center gap-2">
                    <Plus size={16} /> New Request
                </Button> */}
            </div>

            {/* Create New Ticket Section */}
            <div className="max-w-2xl">
                <TicketForm />
            </div>

            {/* Ticket History */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary">Request History</h3>

                {tickets.length === 0 ? (
                    <div className="bg-card p-12 rounded-xl border border-border flex flex-col items-center justify-center text-center">
                        <div className="bg-muted p-4 rounded-full mb-4">
                            <CheckCircle className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h4 className="font-semibold text-lg">No Maintenance Requests</h4>
                        <p className="text-muted-foreground max-w-sm mt-1">
                            You haven't reported any issues yet. If something needs attention, use the form above.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:shadow-md transition-shadow">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-lg">{ticket.subject}</h4>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${ticket.status === 'RESOLVED' ? 'bg-green-50 text-green-700 border-green-200' :
                                                ticket.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    'bg-gray-50 text-gray-700 border-gray-200'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-sm line-clamp-1">{ticket.description}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Tag size={12} /> {ticket.category}
                                        </span>
                                    </div>
                                </div>
                                {ticket.adminResponse && (
                                    <div className="bg-muted/50 p-3 rounded-lg text-sm border border-border max-w-md">
                                        <span className="font-semibold text-xs uppercase text-muted-foreground block mb-1">Admin Response</span>
                                        {ticket.adminResponse}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
