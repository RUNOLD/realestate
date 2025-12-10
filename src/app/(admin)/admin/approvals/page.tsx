
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, User, CreditCard } from "lucide-react";
import { approveUser, approvePayment } from "@/app/lib/actions";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function ApprovalQueuePage() {
    const session = await auth();
    if ((session?.user as any).role !== 'ADMIN') {
        redirect('/admin');
    }

    // Fetch Pending Users
    const pendingUsers = await prisma.user.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' }
    });

    // Fetch Pending Payments
    const pendingPayments = await prisma.payment.findMany({
        where: { approvalStatus: 'PENDING' },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-primary">Approval Queue</h1>
                <p className="text-muted-foreground">Review and approve pending actions from Staff.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Pending Tenants */}
                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="text-primary" />
                        <h2 className="text-xl font-bold">Pending Tenants</h2>
                    </div>

                    {pendingUsers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No pending tenants.</div>
                    ) : (
                        <div className="space-y-4">
                            {pendingUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                                    <div>
                                        <p className="font-medium text-foreground">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <form action={async () => {
                                        'use server';
                                        await approveUser(user.id);
                                    }}>
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                            <CheckCircle size={16} className="mr-1" /> Approve
                                        </Button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pending Payments */}
                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="text-primary" />
                        <h2 className="text-xl font-bold">Pending Payments</h2>
                    </div>

                    {pendingPayments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No pending payments.</div>
                    ) : (
                        <div className="space-y-4">
                            {pendingPayments.map(payment => (
                                <div key={payment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                                    <div>
                                        <p className="font-medium text-foreground">{payment.user.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg">${payment.amount.toLocaleString()}</span>
                                            <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">{payment.method}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-mono">{payment.reference}</p>
                                    </div>
                                    <form action={async () => {
                                        'use server';
                                        await approvePayment(payment.id);
                                    }}>
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                            <CheckCircle size={16} className="mr-1" /> Approve
                                        </Button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
