import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, TenantProfile } from "@prisma/client";
import { Briefcase, Home, Users, User as UserIcon, Building2, Calendar } from "lucide-react";

interface TenantProfileDetailProps {
    profile: TenantProfile | null;
}

export function TenantProfileDetail({ profile }: TenantProfileDetailProps) {
    if (!profile) return null;

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

    // Parse guarantors if it's a string (it might be JSON in DB)
    let guarantors: any[] = [];
    try {
        if (typeof profile.guarantors === 'string') {
            guarantors = JSON.parse(profile.guarantors);
        } else {
            guarantors = profile.guarantors as any;
        }
    } catch (e) {
        guarantors = [];
    }

    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <Card>
                <CardContent className="pt-6">
                    <SectionHeader icon={UserIcon} title="Personal Details" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoRow label="Nationality" value={profile.nationality} />
                        <InfoRow label="Date of Birth" value={profile.dateOfBirth} />
                        <InfoRow label="Gender" value={profile.gender} />
                        <InfoRow label="Marital Status" value={profile.maritalStatus} />
                        <InfoRow label="State of Origin" value={profile.stateOfOrigin} />
                        <InfoRow label="LGA" value={profile.lga} />
                        <InfoRow label="Place of Worship" value={profile.placeOfWorship} />
                        <div className="md:col-span-3">
                            <InfoRow label="Residential Address" value={profile.residentialAddress} />
                        </div>
                        <div className="md:col-span-3">
                            <InfoRow label="Home Town Address" value={profile.homeTownAddress} />
                        </div>
                        <InfoRow label="Nearest Bus Stop" value={profile.nearestBusStop} />
                        <InfoRow label="Spouse Name" value={profile.spouseName} />
                        <InfoRow label="Spouse Work" value={profile.spouseWork} />
                    </div>
                </CardContent>
            </Card>

            {/* Employment & Identity */}
            <Card>
                <CardContent className="pt-6">
                    <SectionHeader icon={Briefcase} title="Employment & Identity" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoRow label="Occupation" value={profile.occupation} />
                        <InfoRow label="Position Held" value={profile.positionHeld} />
                        <div className="md:col-span-3">
                            <InfoRow label="Place of Work" value={profile.placeOfWork} />
                        </div>

                        <div className="col-span-full h-px bg-border my-2" />

                        <InfoRow label="ID Means" value={profile.meansOfIdentification} />
                        <InfoRow label="ID Number" value={profile.idNumber} />
                        <InfoRow label="ID Expiry" value={profile.idExpiryDate} />

                        <div className="col-span-full h-px bg-border my-2" />

                        <div className="md:col-span-3">
                            <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Corporate Details (If Applicable)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InfoRow label="Company Name" value={profile.companyName} />
                                <InfoRow label="Incorporation Date" value={profile.incorporationDate} />
                                <InfoRow label="RC Number" value={profile.certificateNumber} />
                                <InfoRow label="Corporate Email" value={profile.corporateEmail} />
                                <InfoRow label="Contact Person" value={profile.contactPersonName} />
                                <InfoRow label="Contact Phone" value={profile.contactPersonPhone} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Property Requirements */}
            <Card>
                <CardContent className="pt-6">
                    <SectionHeader icon={Building2} title="Property Requirements & History" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoRow label="Type Required" value={profile.propertyTypeRequired} />
                        <InfoRow label="Location Required" value={profile.locationRequired} />
                        <InfoRow label="Nature of Tenancy" value={profile.tenancyNature} />
                        <InfoRow label="Budget (Per Annum)" value={`₦${Number(profile.budgetPerAnnum || 0).toLocaleString()}`} />
                        <InfoRow label="Commencement Date" value={profile.commencementDate} />
                        <InfoRow label="Lease Preference" value={profile.leasePreference} />
                        <InfoRow label="Service Charge Ability" value={profile.serviceChargeAffordability ? "Yes" : "No"} />
                        <InfoRow label="Caution Deposit Agreement" value={profile.cautionDepositAgreement ? "Yes" : "No"} />

                        <div className="col-span-full mt-4 bg-muted/30 p-4 rounded-lg">
                            <h4 className="font-bold text-sm mb-3">Previous Tenancy</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoRow label="Last Address" value={profile.lastAddress} />
                                <InfoRow label="Landlord" value={profile.lastLandlordNameAddress} />
                                <InfoRow label="Rent Paid" value={profile.lastRentPaid} />
                                <InfoRow label="Reason for Leaving" value={profile.reasonForLeaving} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Guarantors */}
            <Card>
                <CardContent className="pt-6">
                    <SectionHeader icon={Users} title="Guarantors" />
                    {guarantors.length === 0 ? (
                        <p className="text-muted-foreground italic">No guarantor information recorded.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {guarantors.map((g: any, idx: number) => (
                                <div key={idx} className="bg-muted/30 p-4 rounded-lg border border-border">
                                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                                        <Badge variant="outline" className="h-5 w-5 rounded-full flex items-center justify-center p-0">{idx + 1}</Badge>
                                        Guarantor
                                    </h4>
                                    <div className="space-y-3">
                                        <InfoRow label="Name" value={g.name} />
                                        <InfoRow label="Phone" value={g.phone} />
                                        <InfoRow label="Occupation" value={g.occupation} />
                                        <InfoRow label="Work Address" value={g.placeOfWork} />
                                        <InfoRow label="Residential Address" value={g.address} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
