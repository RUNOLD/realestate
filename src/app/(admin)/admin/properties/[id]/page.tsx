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
            }
        }
    });

    if (!property) return notFound();

    const activeLease = property.leases[0];
    const tenant = activeLease?.user;

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/properties">
                            <Button variant="outline" size="icon" className="h-10 w-10 bg-white shadow-sm border-gray-200">
                                <ArrowLeft size={18} className="text-gray-600" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{property.title}</h1>
                            <div className="flex items-center text-gray-500 mt-1">
                                <MapPin size={16} className="mr-1 text-blue-600" />
                                <span className="text-sm">{property.location}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={`/admin/properties/${property.id}/edit`}>
                            <Button variant="outline" className="gap-2 bg-white">
                                <Edit size={16} /> Edit Details
                            </Button>
                        </Link>
                        <Badge className={`text-sm px-3 py-1 ${property.status === 'AVAILABLE' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                property.status === 'RENTED' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                                    'bg-gray-100 text-gray-700 hover:bg-gray-100'
                            }`}>
                            {property.status}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Image Gallery (Placeholder for now) */}
                        <Card className="overflow-hidden border-none shadow-md">
                            <CardContent className="p-0">
                                <div className="aspect-video bg-gray-200 relative group overflow-hidden">
                                    <img
                                        src={property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Property Specs */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="text-center p-4 border-none shadow-sm bg-white">
                                <div className="flex flex-col items-center">
                                    <BedDouble className="text-blue-600 mb-2" size={24} />
                                    <span className="text-xl font-bold text-gray-900">{property.bedrooms ?? 0}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Bedrooms</span>
                                </div>
                            </Card>
                            <Card className="text-center p-4 border-none shadow-sm bg-white">
                                <div className="flex flex-col items-center">
                                    <Bath className="text-blue-600 mb-2" size={24} />
                                    <span className="text-xl font-bold text-gray-900">{property.bathrooms ?? 0}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Bathrooms</span>
                                </div>
                            </Card>
                            <Card className="text-center p-4 border-none shadow-sm bg-white">
                                <div className="flex flex-col items-center">
                                    <Maximize className="text-blue-600 mb-2" size={24} />
                                    <span className="text-xl font-bold text-gray-900">{(property.sqft ?? 0).toLocaleString()}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Sqft Area</span>
                                </div>
                            </Card>
                        </div>

                        {/* Description */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText size={20} className="text-gray-400" />
                                    Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {property.description}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-8">

                        {/* Financial Info */}
                        <Card className="border-none shadow-md bg-white overflow-hidden">
                            <div className="bg-blue-600 p-4 text-white">
                                <span className="text-sm opacity-90 block">Annual Rent</span>
                                <div className="text-3xl font-bold mt-1">
                                    ₦{property.price.toLocaleString()}
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between text-sm py-2 border-b">
                                    <span className="text-gray-500">Property Type</span>
                                    <span className="font-semibold">{property.type}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b">
                                    <span className="text-gray-500">Listed On</span>
                                    <span className="font-semibold">{property.createdAt.toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2">
                                    <span className="text-gray-500">Property ID</span>
                                    <span className="font-mono text-xs">{property.id.toUpperCase()}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tenant Info Section */}
                        <Card className="border-none shadow-md bg-white">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User size={20} className="text-blue-600" />
                                    {property.status === 'RENTED' ? 'Active Tenant' : 'Lease Status'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {tenant ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                                                {tenant.name?.[0]?.toUpperCase() ?? 'U'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{tenant.name}</div>
                                                <div className="text-sm text-gray-500">{tenant.email}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-3 text-sm">
                                                <Calendar size={16} className="text-gray-400" />
                                                <span className="text-gray-600">Started: </span>
                                                <span className="font-medium">{activeLease.startDate.toLocaleDateString()}</span>
                                            </div>
                                            {activeLease.endDate && (
                                                <div className="flex items-center gap-3 text-sm">
                                                    <Calendar size={16} className="text-gray-400" />
                                                    <span className="text-gray-600">Expires: </span>
                                                    <span className="font-medium">{activeLease.endDate.toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Link href={`/admin/users/${tenant.id}`} className="block">
                                            <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                                                View Tenant Profile
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 space-y-4">
                                        <div className="inline-flex h-12 w-12 rounded-full bg-gray-50 items-center justify-center text-gray-400">
                                            <Info size={24} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">No Active Tenant</div>
                                            <p className="text-sm text-gray-500 mt-1 uppercase tracking-tight">Property is currently listed as {property.status.toLowerCase()}</p>
                                        </div>
                                        <Link href="/admin/users?role=TENANT" className="block">
                                            <Button className="w-full bg-gray-900 hover:bg-black text-white">
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
