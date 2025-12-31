import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
    Mail,
    Phone,
    Shield,
    Ticket,
    CreditCard,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Clock,
    FileText,
    Coins,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentUpload } from "@/components/tenant/DocumentUpload";
import { CreateLeaseModal } from "@/components/admin/properties/CreateLeaseModal";
import { ResetPasswordButton } from "@/components/admin/users/ResetPasswordButton";
import { TenantProfileDetail } from "@/components/admin/users/TenantProfileDetail";
import { LandlordDetail } from "@/components/admin/users/LandlordDetail";
import { TenantSnapshot } from "@/components/admin/users/TenantSnapshot";
import { TenantAdminQuickActions } from "@/components/admin/users/TenantAdminQuickActions";
import { TenantLeaseSection } from "@/components/admin/users/TenantLeaseSection";
import { getTenantFinancials } from "@/actions/financials";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function UserDetailPage(props: PageProps) {
    const params = await props.params;
    const { id } = params;
    const session = await auth();
    const isSuperAdmin = (session?.user as any)?.role === 'ADMIN';

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
            },
            landlordProfile: true,
            tenantProfile: true,
            ownedProperties: true
        }
    });

    if (!user) {
        notFound();
    }

    // Fetch tenant specific financials if applicable
    const financials = user.role === 'TENANT' ? await getTenantFinancials(id) : null;

    // Fetch available properties for lease creation
    const availableProperties = await prisma.property.findMany({
        where: { status: 'AVAILABLE' }
    });

    // Masking helpers
    const maskData = (val: string | null, visible: number = 4) => {
        if (!val) return "N/A";
        if (isSuperAdmin) return val;
        if (val.length <= visible) return val;
        return "****" + val.slice(-visible);
    };

    if (user.role === 'ADMIN' || user.role === 'STAFF') {
        const { redirect } = await import("next/navigation");
        redirect(`/admin/users/${id}/staff`);
    }

    const getTicketStatusBadge = (status: string) => {
        const styles = {
            RESOLVED: "bg-green-100 text-green-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            OPEN: "bg-blue-100 text-blue-800",
            CLOSED: "bg-gray-100 text-gray-800",
            IN_PROGRESS: "bg-indigo-100 text-indigo-800",
            AWAITING_CONFIRMATION: "bg-amber-100 text-amber-800"
        };
        const style = styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
        return <Badge variant="outline" className={style}>{status.replace('_', ' ')}</Badge>;
    };

    const getPriorityBadge = (priority: string) => {
        const styles = {
            HIGH: "bg-red-100 text-red-700 border-red-200",
            MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
            LOW: "bg-green-100 text-green-700 border-green-200"
        };
        const style = styles[priority as keyof typeof styles] || "bg-gray-100";
        return <Badge variant="outline" className={`text-[10px] font-bold ${style}`}>{priority}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href={user.role === 'LANDLORD' ? '/admin/team' : '/admin/users'}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-serif font-bold text-primary">{user.name || "Unknown User"}</h1>
                            <Badge variant={user.role === 'TENANT' ? "default" : "secondary"}>{user.role}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Member since {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                {user.role === 'TENANT' && (
                    <TenantAdminQuickActions tenantId={user.id} hasLease={!!financials?.lease} />
                )}
            </div>

            {user.role === 'LANDLORD' ? (
                <LandlordDetail user={user} properties={user.ownedProperties} />
            ) : (
                <div className="space-y-6">
                    {/* Snapshot */}
                    {financials && <TenantSnapshot financials={financials as any} />}

                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6 space-x-6">
                            <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2 px-1 font-bold">Overview</TabsTrigger>
                            <TabsTrigger value="lease" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2 px-1 font-bold">Lease</TabsTrigger>
                            <TabsTrigger value="fees" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2 px-1 font-bold">Fees & Deposits</TabsTrigger>
                            <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2 px-1 font-bold">Documents</TabsTrigger>
                            <TabsTrigger value="tickets" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2 px-1 font-bold">Tickets ({user.tickets.length})</TabsTrigger>
                            <TabsTrigger value="profile" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2 px-1 font-bold">Full Profile</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6 mt-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Card>
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg mb-4 text-primary border-b pb-2">Contact Details</h3>
                                        <div className="space-y-4 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground flex items-center gap-2"><Mail size={14} /> Email</span>
                                                <span className="font-medium">{user.email}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground flex items-center gap-2"><Phone size={14} /> Phone</span>
                                                <span className="font-medium">{maskData(user.phone)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground flex items-center gap-2"><Shield size={14} /> ID Number</span>
                                                <span className="font-mono text-xs">{maskData(user.uniqueId || user.id)}</span>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-4 border-t">
                                            <ResetPasswordButton email={user.email} />
                                        </div>
                                    </div>
                                </Card>

                                <Card className="lg:col-span-2">
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
                                            <Shield size={18} /> Customer Service Note
                                        </h3>
                                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg">
                                            <p className="text-sm text-blue-800 leading-relaxed">
                                                This tenant is currently in <span className="font-bold underline uppercase">{financials?.status}</span> status.
                                                When resolving tickets, prioritize high-impact maintenance issues.
                                                Outstanding balance: <span className="font-bold text-red-600">₦{financials?.balance.toLocaleString()}</span>.
                                            </p>
                                        </div>

                                        {!financials?.lease && (
                                            <div className="mt-6 p-6 border-2 border-dashed rounded-xl text-center space-y-4">
                                                <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                    <Clock size={20} className="text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Assign to Property</p>
                                                    <p className="text-xs text-muted-foreground">This user is not active yet.</p>
                                                </div>
                                                <CreateLeaseModal userId={user.id} properties={availableProperties} />
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="lease" className="space-y-6 mt-0">
                            <TenantLeaseSection lease={financials?.lease} />
                        </TabsContent>

                        <TabsContent value="fees" className="space-y-6 mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <div className="p-6 border-b">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            <Coins className="text-amber-500" size={20} /> Service Charge
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg">
                                            <span className="text-sm font-medium">Standard Amount</span>
                                            <span className="font-black">₦{financials?.lease?.property?.serviceCharge?.toLocaleString() || 0}</span>
                                        </div>
                                        <div className="divide-y border rounded-lg">
                                            {user.payments.filter(p => p.category === 'SERVICE_CHARGE').length === 0 ? (
                                                <div className="p-8 text-center text-xs text-muted-foreground italic">No service charge payments recorded.</div>
                                            ) : (
                                                user.payments.filter(p => p.category === 'SERVICE_CHARGE').map(p => (
                                                    <div key={p.id} className="p-3 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-bold text-sm">₦{p.amount.toLocaleString()}</p>
                                                            <p className="text-[10px] text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">Paid ✔</Badge>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </Card>

                                <Card>
                                    <div className="p-6 border-b">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            <ShieldCheck className="text-blue-500" size={20} /> Caution Deposit
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg">
                                            <span className="text-sm font-medium">Required Deposit</span>
                                            <span className="font-black">₦{financials?.lease?.property?.cautionDeposit?.toLocaleString() || 0}</span>
                                        </div>
                                        <div className="divide-y border rounded-lg">
                                            {user.payments.filter(p => p.category === 'CAUTION_DEPOSIT').length === 0 ? (
                                                <div className="p-8 text-center text-xs text-muted-foreground italic">No caution deposit recorded.</div>
                                            ) : (
                                                user.payments.filter(p => p.category === 'CAUTION_DEPOSIT').map(p => (
                                                    <div key={p.id} className="p-3 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-bold text-sm">₦{p.amount.toLocaleString()}</p>
                                                            <p className="text-[10px] text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">Held ✔</Badge>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <Card>
                                <div className="p-6 border-b flex justify-between items-center">
                                    <h3 className="font-bold text-lg">Detailed Payment History</h3>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="text-right">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Due (Rent)</p>
                                            <p className="font-bold">₦{financials?.totalDue.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Paid (Rent)</p>
                                            <p className="font-bold text-green-600">₦{financials?.totalPaid.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="divide-y">
                                    {user.payments.length === 0 ? (
                                        <div className="p-12 text-center text-muted-foreground italic">
                                            No payment records found.
                                        </div>
                                    ) : (
                                        user.payments.map(payment => (
                                            <div key={payment.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${payment.status === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                        }`}>
                                                        <CreditCard size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-sm tracking-tight">{payment.method} Payment</p>
                                                            <Badge variant="outline" className="text-[9px] uppercase font-bold">{(payment as any).category || 'RENT'}</Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            Ref: {payment.reference} • {new Date(payment.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-sm">₦{payment.amount.toLocaleString()}</p>
                                                    <Badge variant={payment.status === 'SUCCESS' ? "default" : "destructive"} className="text-[10px] h-4 px-1">
                                                        {payment.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents" className="space-y-6 mt-0">
                            <Card>
                                <div className="p-6 border-b flex justify-between items-center">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <FileText size={20} /> KYC & Agreements
                                    </h3>
                                    <Badge variant="secondary">{user.documents.length} Files</Badge>
                                </div>
                                <div className="p-6 space-y-8">
                                    <DocumentUpload userId={user.id} />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {user.documents.map(doc => (
                                            <div key={doc.id} className="p-4 border rounded-xl flex items-center justify-between group hover:border-primary/50 transition-all">
                                                <div className="flex items-center gap-4 overflow-hidden">
                                                    <div className="h-10 w-10 bg-primary/5 text-primary rounded-lg flex items-center justify-center shrink-0">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="font-bold text-sm truncate">{doc.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-bold uppercase">{doc.category || 'DOC'}</span>
                                                            <Badge variant="outline" className="text-[9px] h-4 px-1 bg-green-50 text-green-700 border-green-200">Verified ✔</Badge>
                                                            <span className="text-[9px] text-muted-foreground">Expires in 180 days</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={`/api/documents/download?url=${encodeURIComponent(doc.url)}&name=${encodeURIComponent(doc.name)}`} target="_blank">
                                                        <Download size={16} />
                                                    </a>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="tickets" className="space-y-6 mt-0">
                            <Card>
                                <div className="divide-y">
                                    {user.tickets.length === 0 ? (
                                        <div className="p-12 text-center text-muted-foreground">No complaints filed by this tenant.</div>
                                    ) : (
                                        user.tickets.map(ticket => (
                                            <div key={ticket.id} className="p-6 hover:bg-muted/30 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-black text-lg text-primary">{ticket.subject}</h4>
                                                            {getPriorityBadge(ticket.priority)}
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <Badge variant="outline" className="text-[10px] uppercase">{ticket.category}</Badge>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    {getTicketStatusBadge(ticket.status)}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-4 line-clamp-2">{ticket.description}</p>
                                                <div className="mt-6 flex justify-end">
                                                    <Link href={`/admin/tickets/${ticket.id}`}>
                                                        <Button variant="outline" size="sm" className="font-bold">View Details</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="profile" className="mt-0">
                            <TenantProfileDetail profile={user.tenantProfile} />
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
}
