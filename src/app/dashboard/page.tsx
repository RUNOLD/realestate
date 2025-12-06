import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle, Clock, Plus } from "lucide-react";
import { TicketForm } from "@/components/dashboard/TicketForm";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const [tickets, payments] = await Promise.all([
        prisma.ticket.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 5
        }),
        prisma.payment.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 10
        })
    ]);

    const activeTickets = tickets.filter(t => t.status !== 'CLOSED' && t.status !== 'RESOLVED');

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Welcome, {session.user.name ?? 'Tenant'}</h1>
                    <p className="text-muted-foreground">Manage your tenancy and requests.</p>
                </div>
                <form action={async () => {
                    'use server';
                    // Placeholder for logout if needed here, but it's in sidebar
                }}>
                </form>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Next Rent Payment</h3>
                    <div className="text-2xl font-bold text-primary mb-1">₦0.00</div>
                    <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle size={14} /> You are up to date!
                    </div>
                </div>

                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Tickets</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{activeTickets.length} Open</div>
                    {activeTickets.length > 0 && (
                        <div className="text-sm text-yellow-600 font-medium flex items-center gap-1">
                            <AlertCircle size={14} /> {activeTickets[0].status}
                        </div>
                    )}
                </div>
            </div>

            {/* New Ticket Form */}
            <TicketForm />

            {/* Recent Activity */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-bold text-primary">Payment History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Transaction Ref</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {payments.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">No payments found.</td></tr>
                            ) : (
                                payments.map(pay => (
                                    <tr key={pay.id} className="bg-card hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">{new Date(pay.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{pay.reference}</td>
                                        <td className="px-6 py-4">₦{pay.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${pay.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {pay.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
