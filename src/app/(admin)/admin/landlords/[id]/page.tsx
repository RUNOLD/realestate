
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Mail,
    Phone,
    Building2,
    MapPin,
    DollarSign,
    User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function LandlordDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Fetch Landlord and their properties
    const landlordRaw = await prisma.user.findUnique({
        where: { id },
        include: {
            // @ts-ignore: ownedProperties exists in schema but client might be stale
            ownedProperties: {
                include: {
                    leases: {
                        where: { isActive: true },
                        include: { user: true } // Active tenant
                    }
                }
            }
        }
    });

    // Cast to any to avoid "ownedProperties does not exist" if types are stale
    const landlord = landlordRaw as any;

    if (!landlord || landlord.role !== 'LANDLORD') {
        notFound();
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/landlords">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{landlord.name || "Landlord Details"}</h1>
                    <p className="text-muted-foreground text-sm">Landlord Profile & Portfolio</p>
                </div>
                <div className="ml-auto">
                    <Link href={`/admin/users/${landlord.id}/edit`}>
                        <Button variant="outline">Edit Profile</Button>
                    </Link>
                </div>
            </div>

            {/* Profile Card */}
            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                        <User className="h-5 w-5 text-muted-foreground" />
                        Contact Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                            <p className="text-base font-semibold text-foreground">{landlord.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                            <p className="text-base font-semibold text-foreground">{landlord.phone || "Not provided"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Properties Section (The Requested Feature) */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Owned Properties</h2>
                    <Badge variant="secondary" className="ml-2">{landlord.ownedProperties.length}</Badge>
                </div>

                {landlord.ownedProperties.length === 0 ? (
                    <div className="p-12 text-center bg-card rounded-xl border border-dashed border-border flex flex-col items-center justify-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-muted-foreground font-medium">No properties assigned to this landlord yet.</p>
                            <p className="text-xs text-muted-foreground/70">Assigning one will display it here.</p>
                        </div>

                        <Link href="/admin/properties/new">
                            <Button variant="outline" className="mt-2">
                                Assign a New Property
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {landlord.ownedProperties.map((property: any) => (
                            <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow border-border">
                                <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-base font-bold text-foreground">{property.title}</CardTitle>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                <MapPin className="h-3 w-3" />
                                                {property.location}
                                            </div>
                                        </div>
                                        <Badge
                                            variant={property.status === 'RENTED' ? 'destructive' : 'secondary'}
                                            className={property.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200' : ''}
                                        >
                                            {property.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Rent Price:</span>
                                        <span className="font-semibold text-foreground">₦{property.price.toLocaleString()}/yr</span>
                                    </div>

                                    {/* Tenant Info if Rented */}
                                    {property.leases.length > 0 ? (
                                        <div className="p-3 bg-primary/5 border border-primary/10 text-primary-foreground rounded-md text-sm mt-2">
                                            <p className="font-semibold flex items-center gap-1 text-foreground">
                                                <User className="h-3 w-3 text-primary" />
                                                Tenant: {property.leases[0].user?.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Active Lease: {new Date(property.leases[0].startDate).toLocaleDateString()} - {property.leases[0].endDate ? new Date(property.leases[0].endDate).toLocaleDateString() : 'Ongoing'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-muted text-muted-foreground rounded-md text-sm mt-2 text-center italic">
                                            No Active Tenant
                                        </div>
                                    )}

                                    <Link href={`/admin/properties/${property.id}`} className="block">
                                        <Button variant="outline" className="w-full mt-2 text-xs">
                                            Manage Property
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
