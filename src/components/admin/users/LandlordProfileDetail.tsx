import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, LandlordProfile } from "@prisma/client";
import { User as UserIcon, Wallet, MapPin, Shield, CheckCircle2, AlertCircle } from "lucide-react";

interface LandlordProfileDetailProps {
    profile: LandlordProfile | null;
}

export function LandlordProfileDetail({ profile }: LandlordProfileDetailProps) {
    if (!profile) return (
        <div className="p-8 text-center bg-muted/20 rounded-xl border border-dashed">
            <p className="text-muted-foreground italic">No landlord profile found for this user.</p>
        </div>
    );

    const formatValue = (val: string | number | Date | null | undefined) => {
        if (val === null || val === undefined) return <span className="text-muted-foreground italic">Not provided</span>;
        if (val instanceof Date) return new Date(val).toLocaleDateString();
        if (typeof val === 'boolean') return val ? 'Yes' : 'No';
        if (val === "") return <span className="text-muted-foreground italic">Not provided</span>;
        return <span className="font-medium text-foreground">{val.toString()}</span>;
    };

    const InfoRow = ({ label, value }: { label: string, value: any }) => (
        <div className="flex flex-col gap-1 py-1">
            <span className="text-[11px] font-black text-foreground/75 uppercase tracking-tight">{label}</span>
            <div className="text-sm font-bold">{formatValue(value)}</div>
        </div>
    );

    const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
            <Icon className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg text-primary">{title}</h3>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Verification Status Banner */}
            <div className={`p-4 rounded-xl border-2 flex items-center gap-4 ${profile.isConsentGiven ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                <div className={`p-2 rounded-full ${profile.isConsentGiven ? 'bg-green-100' : 'bg-red-100'}`}>
                    {profile.isConsentGiven ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                </div>
                <div>
                    <h4 className="font-black uppercase tracking-tight text-sm">Landlord Authority Status</h4>
                    <p className="text-xs font-medium opacity-80">
                        {profile.isConsentGiven
                            ? `Consent digitally signed on ${new Date(profile.consentDate!).toLocaleDateString()}`
                            : "Digital consent and authority signature pending."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* KYC & Identity */}
                <Card>
                    <CardContent className="pt-6">
                        <SectionHeader icon={Shield} title="KYC & Identity" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoRow label="Landlord Type" value={profile.landlordType} />
                            <InfoRow label="Relationship to Property" value={profile.relationshipToProperty} />
                            <InfoRow label="ID Means" value={profile.idType} />
                            <InfoRow label="ID Number" value={profile.idNumber} />
                            <div className="col-span-full">
                                <InfoRow label="Residential Address" value={profile.residentialAddress} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Financial & Contact */}
                <Card>
                    <CardContent className="pt-6">
                        <SectionHeader icon={Wallet} title="Financial & Payout Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoRow label="Bank Name" value={profile.bankName} />
                            <InfoRow label="Account Number" value={profile.accountNumber} />
                            <div className="col-span-full">
                                <InfoRow label="Account Name" value={profile.accountName} />
                            </div>
                            <div className="col-span-full h-px bg-border my-2" />
                            <InfoRow label="Preferred Contact" value={profile.preferredContactMethod} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
