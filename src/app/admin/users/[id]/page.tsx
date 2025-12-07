import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import {
    Mail,
    Phone,
    Calendar,
    Shield,
    Ticket,
    CreditCard,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Clock,
    FileText
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentUpload } from "@/components/dashboard/DocumentUpload";
import { LogPaymentModal } from "@/components/dashboard/LogPaymentModal";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            tickets: {
                orderBy: { createdAt: 'desc' }
            },
            payments: {
                orderBy: { createdAt: 'desc' }
            },
            documents: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user) {
        notFound();
    }

    // Helper for status badges
    const getTicketStatusBadge = (status: string) => {
        const styles = {
            RESOLVED: "bg-green-100 text-green-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            OPEN: "bg-blue-100 text-blue-800",
            CLOSED: "bg-gray-100 text-gray-800"
        };
        const style = styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";

        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border border-transparent ${style}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/users">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">{user.name || "Unknown User"}</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'TENANT' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
                            }`}>
                            {user.role}
                        </span>
                        <span>•</span>
                        <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Contact Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-primary border-b border-border pb-2">Contact Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Email Address</p>
                                    <p className="text-sm font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Phone Number</p>
                                    <p className="text-sm font-medium">{user.phone || "Not provided"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <Shield size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Tenant ID</p>
                                    <p className="text-sm font-medium font-mono text-xs">{user.id}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border">
                            <Button className="w-full" variant="outline">Reset Password</Button>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <Shield size={18} /> Customer Service Note
                        </h3>
                        <p className="text-sm text-blue-800">
                            When speaking with this tenant, remember to check for any outstanding high-priority tickets first.
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Tickets & Payments */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Documents Section */}
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                                <FileText size={20} /> Documents
                            </h3>
                            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                {user.documents.length} Files
                            </span>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Upload Area */}
                            <DocumentUpload userId={user.id} />

                            {/* Document List */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
                                {user.documents.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">No documents uploaded yet.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {user.documents.map(doc => (
                                            <div key={doc.id} className="flex items-start gap-3 p-3 border border-border rounded-lg bg-white">
                                                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-medium text-sm truncate" title={doc.name}>{doc.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase">{doc.category || 'DOC'}</span>
                                                        <span className="text-xs text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Complaints / Tickets Section */}
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                                <Ticket size={20} /> Outstanding Complaints / Tickets
                            </h3>
                            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                {user.tickets.length} Total
                            </span>
                        </div>
                        <div className="divide-y divide-border">
                            {user.tickets.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    No tickets found for this user.
                                </div>
                            ) : (
                                user.tickets.map(ticket => (
                                    <div key={ticket.id} className="p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-foreground">{ticket.subject}</h4>
                                            {getTicketStatusBadge(ticket.status)}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{ticket.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="bg-muted px-2 py-0.5 rounded uppercase font-bold text-[10px]">
                                                {ticket.category}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Payments History Section */}
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                                <CreditCard size={20} /> Payment History
                            </h3>
                            <LogPaymentModal tenantId={user.id} />
                        </div>
                        <div className="divide-y divide-border">
                            {user.payments.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    No payment records found.
                                </div>
                            ) : (
                                user.payments.map(payment => (
                                    <div key={payment.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${payment.approvalStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {payment.approvalStatus === 'PENDING' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-foreground">{payment.method} Payment</p>
                                                <p className="text-xs text-muted-foreground">Ref: {payment.reference}</p>
                                                {payment.approvalStatus === 'PENDING' && (
                                                    <span className="text-[10px] text-amber-600 font-bold">Pending Approval</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-foreground">₦{payment.amount.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
