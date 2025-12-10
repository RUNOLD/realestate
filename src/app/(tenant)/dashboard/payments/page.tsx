import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreditCard, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PaymentsPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const payments = await prisma.payment.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
    });

    const totalPaid = payments.filter(p => p.status === 'SUCCESS').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Payments</h1>
                    <p className="text-muted-foreground">View your payment history and download receipts.</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Download size={16} /> Export Statement
                </Button>
            </div>

            {/* Payment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <p className="text-sm text-muted-foreground font-medium mb-1">Total Paid (Lifetime)</p>
                    <h3 className="text-3xl font-bold text-primary">₦{totalPaid.toLocaleString()}</h3>
                </div>
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <p className="text-sm text-muted-foreground font-medium mb-1">Next Payment Due</p>
                    <h3 className="text-3xl font-bold text-primary">--</h3>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">No pending payments</p>
                </div>
            </div>

            {/* Payment History Table */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h3 className="text-lg font-bold text-primary">Transaction History</h3>
                    <Button variant="ghost" size="icon">
                        <Filter size={18} className="text-muted-foreground" />
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Reference</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center">
                                            <CreditCard className="h-10 w-10 text-muted-foreground/30 mb-3" />
                                            <p>No payment history records found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {new Date(payment.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">{payment.reference}</td>
                                        <td className="px-6 py-4">Rent Payment</td>
                                        <td className="px-6 py-4 font-medium">₦{payment.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                                                    payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                                                Download
                                            </Button>
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
