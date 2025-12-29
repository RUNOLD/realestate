'use client';

import { Building, MapPin, Wallet, FileText, CheckCircle, Upload, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "@/components/tenant/DocumentUpload";
import Link from "next/link";

interface LandlordDetailProps {
    user: any; // Using any for flexibility with the Prisma include, but ideally typed
    properties: any[];
}

export function LandlordDetail({ user, properties }: LandlordDetailProps) {
    const { landlordProfile } = user;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {/* LEFT COLUMN: Profile & Financials */}
            <div className="lg:col-span-1 space-y-6">

                {/* Profile Card */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-primary border-b border-border pb-2 flex items-center gap-2">
                        <Shield size={18} /> Profile Details
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium text-right">{landlordProfile?.landlordType || '-'}</span>

                            <span className="text-muted-foreground">ID Type:</span>
                            <span className="font-medium text-right">{landlordProfile?.idType || '-'}</span>

                            <span className="text-muted-foreground">Relationship:</span>
                            <span className="font-medium text-right">{landlordProfile?.relationshipToProperty || '-'}</span>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-1">Residential Address</p>
                            <p className="text-sm font-medium">{landlordProfile?.residentialAddress || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                {/* Financials Card */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-primary border-b border-border pb-2 flex items-center gap-2">
                        <Wallet size={18} /> Financial Info
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Bank Details</p>
                            <div>
                                <p className="text-sm font-bold">{landlordProfile?.bankName || 'No Bank Added'}</p>
                                <p className="text-sm font-mono">{landlordProfile?.accountNumber}</p>
                                <p className="text-xs text-muted-foreground">{landlordProfile?.accountName}</p>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Preferred Contact: <span className="font-medium text-foreground">{landlordProfile?.preferredContactMethod || 'Any'}</span>
                        </div>
                    </div>
                </div>

                {/* Consent Status */}
                <div className={`p-4 rounded-xl border ${landlordProfile?.isConsentGiven ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}>
                    <div className="flex items-start gap-3">
                        <CheckCircle size={20} className={landlordProfile?.isConsentGiven ? 'text-green-600' : 'text-yellow-600'} />
                        <div>
                            <h4 className={`font-bold text-sm ${landlordProfile?.isConsentGiven ? 'text-green-800' : 'text-yellow-800'}`}>
                                {landlordProfile?.isConsentGiven ? 'Authority Confirmed' : 'Consent Pending'}
                            </h4>
                            <p className={`text-xs mt-1 ${landlordProfile?.isConsentGiven ? 'text-green-700' : 'text-yellow-700'}`}>
                                {landlordProfile?.isConsentGiven
                                    ? `Consent given on ${new Date(landlordProfile.consentDate).toLocaleDateString()}`
                                    : 'Landlord has not yet digitally signed the authority consent.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Properties & Documents */}
            <div className="lg:col-span-2 space-y-8">

                {/* Properties Portfolio */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                            <Building size={20} /> Property Portfolio
                        </h3>
                        <Link href="/admin/properties/check-in">
                            <Button size="sm" variant="outline" className="gap-2">
                                <Building size={14} /> Add Property
                            </Button>
                        </Link>
                    </div>

                    <div className="divide-y divide-border">
                        {properties.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <Building size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-medium">No properties assigned yet.</p>
                                <p className="text-sm">Link properties to this landlord to see them here.</p>
                            </div>
                        ) : (
                            properties.map((property) => (
                                <div key={property.id} className="p-4 hover:bg-muted/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                            <Building size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground">{property.title}</h4>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <MapPin size={14} />
                                                <span>{property.location}</span>
                                            </div>
                                            <div className="mt-2 flex gap-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${property.status === 'AVAILABLE' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        property.status === 'RENTED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            'bg-gray-50 text-gray-700 border-gray-200'
                                                    }`}>
                                                    {property.status}
                                                </span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                                    {property.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">₦{property.price.toLocaleString()}</p>
                                        <Button variant="ghost" size="sm" asChild className="mt-1">
                                            <Link href={`/admin/properties/${property.id}`}>Manage Property</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Documents Section (Reused) */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                            <FileText size={20} /> Agreements & IDs
                        </h3>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                            {user.documents.length} Files
                        </span>
                    </div>
                    <div className="p-6 space-y-6">
                        <DocumentUpload userId={user.id} />

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
                            {user.documents.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No documents uploaded yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {user.documents.map((doc: any) => (
                                        <div key={doc.id} className="flex items-start justify-between gap-3 p-3 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors group">
                                            <div className="flex items-start gap-3 overflow-hidden">
                                                <div className="h-10 w-10 bg-amber-500/10 text-amber-600 rounded flex items-center justify-center shrink-0">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-medium text-sm text-foreground truncate" title={doc.name}>{doc.name}</p>
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
                                                    <Upload size={16} />
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
    );
}
