import { updateProperty } from "@/app/actions/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
    ArrowLeft,
    Save,
    Home,
    MapPin,
    FileText,
    ImageIcon,
    Activity
} from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditPropertyPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const property = await prisma.property.findUnique({
        where: { id: params.id }
    });

    if (!property) return notFound();

    const updateAction = updateProperty.bind(null, property.id);

    return (
        <div className="min-h-screen bg-muted/10 py-8 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/properties">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                                <ArrowLeft size={18} />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">Edit Property</h1>
                            <p className="text-sm text-muted-foreground">Update property details and status.</p>
                        </div>
                    </div>
                </div>

                <form action={updateAction}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Basic Info */}
                            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                                <div className="flex items-center gap-2 mb-6 text-foreground font-semibold border-b border-border pb-2">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                        <Home className="h-4 w-4" />
                                    </div>
                                    <h2>Property Details</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Listing Title <span className="text-red-500">*</span></label>
                                        <Input
                                            id="title"
                                            name="title"
                                            defaultValue={property.title}
                                            required
                                            className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all font-medium placeholder:text-muted-foreground/50 text-foreground"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Property Type</label>
                                            <div className="relative">
                                                <select
                                                    id="type"
                                                    name="type"
                                                    defaultValue={property.type ?? ""}
                                                    required
                                                    className="flex h-12 w-full rounded-md border border-transparent bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus:bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-all font-medium text-foreground"
                                                >
                                                    <option value="" disabled>Select Type...</option>
                                                    <option value="Apartment">Apartment / Flat</option>
                                                    <option value="House">House / Duplex</option>
                                                    <option value="Land">Land</option>
                                                    <option value="Commercial">Commercial / Office</option>
                                                </select>
                                                <div className="absolute right-3 top-4 pointer-events-none text-muted-foreground">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="location"
                                                    name="location"
                                                    defaultValue={property.location}
                                                    required
                                                    className="pl-9 h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all font-medium placeholder:text-muted-foreground/50 text-foreground"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="bedrooms" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Bedrooms</label>
                                            <Input id="bedrooms" name="bedrooms" type="number" defaultValue={property.bedrooms ?? ""} placeholder="0" min="0" className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all text-center text-foreground" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="bathrooms" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Bathrooms</label>
                                            <Input id="bathrooms" name="bathrooms" type="number" defaultValue={property.bathrooms ?? ""} placeholder="0" min="0" className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all text-center text-foreground" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="sqft" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Sqft</label>
                                            <Input id="sqft" name="sqft" type="number" defaultValue={property.sqft ?? ""} placeholder="0" min="0" className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all text-center text-foreground" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows={6}
                                                defaultValue={property.description}
                                                className="flex w-full rounded-md border border-transparent bg-muted/50 pl-9 pr-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus:bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all text-foreground"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Media */}
                            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                                <div className="flex items-center gap-2 mb-6 text-foreground font-semibold border-b border-border pb-2">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                        <ImageIcon className="h-4 w-4" />
                                    </div>
                                    <h2>Gallery</h2>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="images" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Cover Image URL</label>
                                    <Input id="images" name="images" defaultValue={property.images && property.images.length > 0 ? property.images[0] : ""} placeholder="https://..." className="h-12 font-mono text-xs bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all text-foreground" />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-6">

                            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                                <div className="flex items-center gap-2 mb-6 text-foreground font-semibold border-b border-border pb-2">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                        <Activity className="h-4 w-4" />
                                    </div>
                                    <h2>Status & Value</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Price</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₦</div>
                                            <Input id="price" name="price" type="number" defaultValue={property.price} required className="pl-8 h-12 text-lg font-bold bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all text-foreground" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Listing Status</label>
                                        <div className="relative">
                                            <select
                                                id="status"
                                                name="status"
                                                defaultValue={property.status}
                                                className="flex h-12 w-full rounded-md border border-transparent bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus:bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none transition-all font-medium text-foreground"
                                            >
                                                <option value="AVAILABLE">🟢 Available</option>
                                                <option value="RENTED">🔴 Rented</option>
                                                <option value="SOLD">🔵 Sold</option>
                                                <option value="MAINTENANCE">🟠 Maintenance</option>
                                            </select>
                                            <div className="absolute right-3 top-4 pointer-events-none text-muted-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full h-12 text-base shadow-md bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </Button>
                                <Link href="/admin/properties" className="w-full">
                                    <Button variant="outline" type="button" className="w-full h-12 border-border hover:bg-muted text-muted-foreground hover:text-foreground">Cancel</Button>
                                </Link>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
