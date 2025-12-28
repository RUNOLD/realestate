import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
    Mail,
    Phone,
    Shield,
    FileText,
    ArrowLeft,
    Briefcase,
    Calendar,
    Building2,
    Wallet,
    Landmark
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentUpload } from "@/components/tenant/DocumentUpload";
import { CheckCircle } from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function StaffProfilePage(props: PageProps) {
    const params = await props.params;
    const { id } = params;

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            documents: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
        // Technically this page is for staff/admin only, but if data exists and they are not, handle gracefully or show generic view (but routing handles that).
        // If user doesn't exist at all:
        if (!user) notFound();
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <Link href="/admin/users">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold uppercase border-2 border-primary/20">
                        {user.image ? (
                            <img src={user.image} alt={user.name || "User"} className="h-full w-full rounded-full object-cover" />
                        ) : (
                            (user.name?.charAt(0) || user.email?.charAt(0) || "U")
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-foreground">{user.name || "Unknown Staff"}</h1>
                        <p className="text-muted-foreground flex items-center gap-2 text-sm">
                            <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">{user.jobTitle || "No Job Title"}</span>
                            <span>•</span>
                            <span>{user.role}</span>
                            <span>•</span>
                            <span>ID: <span className="font-mono text-xs">{user.id}</span></span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT COLUMN: Personal & Employment Info */}
                <div className="space-y-6">

                    {/* Contact Information */}
                    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4 text-foreground border-b border-border pb-2 flex items-center gap-2">
                            <Phone size={18} className="text-primary" /> Contact Information
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase text-muted-foreground/70">Email Address</p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Mail size={14} className="text-muted-foreground" /> {user.email}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase text-muted-foreground/70">Phone Number</p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Phone size={14} className="text-muted-foreground" /> {user.phone || "Not provided"}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1 pt-2">
                                <p className="text-xs font-bold uppercase text-muted-foreground/70">Home Address</p>
                                <p className="text-sm font-medium text-foreground">{user.homeAddress || "Not provided"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4 text-foreground border-b border-border pb-2 flex items-center gap-2">
                            <Briefcase size={18} className="text-blue-500" /> Employment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-muted-foreground/70">Values Alignment</p>
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <Shield size={14} className="text-muted-foreground" /> {user.role}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-muted-foreground/70">Department</p>
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <Building2 size={14} className="text-muted-foreground" /> {user.department || "Not assigned"}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-muted-foreground/70">Hire Date</p>
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <Calendar size={14} className="text-muted-foreground" />
                                    {user.hireDate ? new Date(user.hireDate).toLocaleDateString() : "Not set"}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-muted-foreground/70">Annual Compensation</p>
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <Wallet size={14} className="text-emerald-500" />
                                    {user.salary ? `₦${user.salary.toLocaleString()}` : "Not set"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4 text-foreground border-b border-border pb-2 flex items-center gap-2">
                            <Landmark size={18} className="text-purple-500" /> Bank Details
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase text-muted-foreground/70">Bank Name</p>
                                    <p className="text-sm font-medium text-foreground">{user.bankName || "Not provided"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase text-muted-foreground/70">Account Number</p>
                                    <p className="text-sm font-medium text-foreground font-mono">{user.accountNumber || "Not provided"}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-muted-foreground/70">Account Name</p>
                                <p className="text-sm font-medium text-foreground">{user.accountName || "Not provided"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Documents */}
                <div className="space-y-6">
                    <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col h-full">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/5">
                            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                                <FileText size={20} className="text-orange-500" /> Contract & KYC Documents
                            </h3>
                            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                {user.documents.length} Files
                            </span>
                        </div>
                        <div className="p-6 space-y-6 flex-1">
                            <DocumentUpload userId={user.id} />

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-foreground/80">Uploaded Files</h4>
                                {user.documents.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">No contract or KYC documents uploaded yet.</p>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {user.documents.map(doc => (
                                            <div key={doc.id} className="flex items-start justify-between gap-3 p-3 border border-border rounded-lg bg-background hover:bg-muted/30 transition-colors group">
                                                <div className="flex items-start gap-3 overflow-hidden">
                                                    <div className="h-10 w-10 bg-orange-500/10 text-orange-600 rounded flex items-center justify-center shrink-0">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="font-medium text-sm text-foreground truncate">{doc.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded uppercase">{doc.category || 'DOC'}</span>
                                                            <span className="text-xs text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {doc.url && (
                                                    <a
                                                        href={`/api/documents/download?url=${encodeURIComponent(doc.url)}&name=${encodeURIComponent(doc.name)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Download Document"
                                                    >
                                                        <CheckCircle size={16} className="hidden" />
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
