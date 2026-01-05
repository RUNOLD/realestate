import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Building,
    CheckCircle2,
    Clock,
    Wallet,
    Ticket,
    Shield,
    FileCheck
} from "lucide-react";

interface LandlordSnapshotProps {
    user: any;
    properties: any[];
}

export function LandlordSnapshot({ user, properties }: LandlordSnapshotProps) {
    const { landlordProfile } = user;

    const assetValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);
    const openTickets = properties.reduce((sum, p) =>
        sum + (p.tickets?.filter((t: any) => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length || 0), 0
    );
    const isVerified = landlordProfile?.isConsentGiven;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sticky top-0 z-10 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Status Card */}
            <Card className="shadow-sm border-2 border-primary/10">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {user.status === 'ACTIVE' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                        <p className="text-[11px] uppercase font-black text-foreground/80 tracking-tight">Status</p>
                        <Badge variant={user.status === 'ACTIVE' ? "default" : "outline"} className="mt-1 font-bold">
                            {user.status}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Portfolio Card */}
            <Card className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Building size={20} />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase font-black text-foreground/80 tracking-tight">Portfolio</p>
                        <p className="text-base font-black text-foreground">
                            {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
                        </p>
                        <p className="text-[9px] font-medium text-muted-foreground uppercase">Managed Assets</p>
                    </div>
                </CardContent>
            </Card>

            {/* Asset Value Card */}
            <Card className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase font-black text-foreground/80 tracking-tight">Asset Value</p>
                        <p className="text-base font-black text-foreground">₦{assetValue.toLocaleString()}</p>
                        <p className="text-[9px] font-medium text-muted-foreground uppercase">Estimated Value</p>
                    </div>
                </CardContent>
            </Card>

            {/* Verification Card */}
            <Card className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isVerified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {isVerified ? <FileCheck size={20} /> : <Shield size={20} />}
                    </div>
                    <div>
                        <p className="text-[11px] uppercase font-black text-foreground/80 tracking-tight">Verification</p>
                        <p className={`text-sm font-bold ${isVerified ? 'text-green-700' : 'text-red-700'}`}>
                            {isVerified ? "Consent Given" : "Pending Signature"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
