import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
    Home, MapPin, BedDouble, Bath, Maximize,
    User, Calendar, DollarSign, ArrowLeft, Edit,
    ShieldCheck, Info, FileText, Activity
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DeletePropertyButton } from "@/components/admin/properties/DeletePropertyButton";

export default async function PropertyDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const property = await prisma.property.findUnique({
        where: { id: params.id },
        include: {
            leases: {
                where: { isActive: true },
                include: {
                    user: true
                },
                take: 1
            },
            units: true,
            parent: true
        }
    });

    if (!property) return notFound();

    const activeLease = property.leases[0];
    const tenant = activeLease?.user;

    return (
        <div className="min-h-screen bg-muted/10 py-8 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">

                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/properties">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                                <ArrowLeft size={18} />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">{property.title}</h1>
                            <div className="flex items-center text-muted-foreground mt-1">
                                <MapPin size={16} className="mr-1 text-primary" />
                                <span className="text-sm">{property.location}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={`/admin/properties/${property.id}/edit`}>
                            <Button variant="outline" className="gap-2 bg-card border-border hover:bg-muted font-medium text-foreground">
                                <Edit size={16} /> Edit Details
                            </Button>
                        </Link>
                        <DeletePropertyButton
                            propertyId={property.id}
                            hasUnits={property.units.length > 0}
                            isUnit={!!property.parentId}
                        />
                        <Badge className={`text-sm px-3 py-1 ${property.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            property.status === 'RENTED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                'bg-muted text-muted-foreground'
                            }`}>
                            {property.status}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Image Gallery (Placeholder for now) */}
                        <Card className="overflow-hidden border-border shadow-lg bg-card">
                            <CardContent className="p-0">
                                <div className="aspect-video bg-muted relative group overflow-hidden">
                                    <img
                                        src={property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"}
                                        alt={property.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Property Specs */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="text-center p-4 border-border shadow-sm bg-card">
                                <div className="flex flex-col items-center">
                                    <BedDouble className="text-primary mb-2" size={24} />
                                    <span className="text-xl font-bold text-foreground">{property.bedrooms ?? 0}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Bedrooms</span>
                                </div>
                            </Card>
                            <Card className="text-center p-4 border-border shadow-sm bg-card">
                                <div className="flex flex-col items-center">
                                    <Bath className="text-primary mb-2" size={24} />
                                    <span className="text-xl font-bold text-foreground">{property.bathrooms ?? 0}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Bathrooms</span>
                                </div>
                            </Card>
                            <Card className="text-center p-4 border-border shadow-sm bg-card">
                                <div className="flex flex-col items-center">
                                    <Maximize className="text-primary mb-2" size={24} />
                                    <span className="text-xl font-bold text-foreground">{(property.sqft ?? 0).toLocaleString()}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Sqft</span>
                                </div>
                            </Card>
                        </div>

                        {/* Description */}
                        <Card className="border-border shadow-sm bg-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                                    <FileText size={20} className="text-muted-foreground" />
                                    Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {property.description}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-8">

                        {/* Financial Info */}
                        <Card className="border-border shadow-lg bg-card overflow-hidden">
                            <div className="bg-primary p-6 text-primary-foreground">
                                <span className="text-sm font-medium opacity-90 block uppercase tracking-wide">Annual Rent</span>
                                <div className="text-4xl font-serif font-bold mt-2">
                                    ₦{property.price.toLocaleString()}
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between text-sm py-3 border-b border-border/50">
                                    <span className="text-muted-foreground font-medium">Service Charge</span>
                                    <span className="font-bold text-foreground">₦{property.serviceCharge?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm py-3 border-b border-border/50">
                                    <span className="text-muted-foreground font-medium">Caution Fee</span>
                                    <span className="font-bold text-foreground">₦{property.cautionDeposit?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm py-3 border-b border-border/50">
                                    <span className="text-muted-foreground font-medium">Management Fee</span>
                                    <span className="font-bold text-accent">{(property as any).managementFee || 10}%</span>
                                </div>
                                <div className="flex justify-between text-sm py-3">
                                    <span className="text-muted-foreground font-medium">Property ID</span>
                                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground">{property.uniqueId || 'N/A'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tenant Info Section */}
                        <Card className="border-border shadow-md bg-card">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                                    <User size={20} className="text-primary" />
                                    {property.status === 'RENTED' ? 'Active Tenant' : 'Lease Status'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {tenant ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                                {tenant.name?.[0]?.toUpperCase() ?? 'U'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-foreground">{tenant.name}</div>
                                                <div className="text-sm text-muted-foreground">{tenant.email}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-border/50">
                                            <div className="flex items-center gap-3 text-sm">
                                                <Calendar size={16} className="text-muted-foreground" />
                                                <span className="text-muted-foreground">Started: </span>
                                                <span className="font-medium text-foreground ml-auto">{activeLease.startDate.toLocaleDateString()}</span>
                                            </div>
                                            {activeLease.endDate && (
                                                <div className="flex items-center gap-3 text-sm">
                                                    <Calendar size={16} className="text-muted-foreground" />
                                                    <span className="text-muted-foreground">Expires: </span>
                                                    <span className="font-medium text-foreground ml-auto">{activeLease.endDate.toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Link href={`/admin/users/${tenant.id}`} className="block">
                                            <Button variant="outline" className="w-full text-primary hover:text-primary hover:bg-primary/5 border-primary/20">
                                                View Tenant Profile
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 space-y-4">
                                        <div className="inline-flex h-14 w-14 rounded-full bg-muted items-center justify-center text-muted-foreground animate-pulse">
                                            <Info size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-foreground">No Active Tenant</div>
                                            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">Status: {property.status.toLowerCase()}</p>
                                        </div>
                                        <Link href="/admin/users?role=TENANT" className="block">
                                            <Button className="w-full bg-foreground text-background hover:bg-foreground/90 font-bold">
                                                Assign a Tenant
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>

            </div>
        </div>
    );
}
