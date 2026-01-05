import { createProperty } from "@/app/actions/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
    ArrowLeft,
    Save,
    Home,
    MapPin,
    DollarSign,
    FileText,
    ImageIcon,
    Activity,
    Users,
    Building
} from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default async function NewPropertyPage() {
    const landlords = await prisma.user.findMany({
        where: { role: "LANDLORD" as any },
        select: { id: true, name: true, email: true }
    });

    return (
        <div className="min-h-screen bg-muted/10 py-8 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header with clear navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/properties">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                                <ArrowLeft size={18} />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">New Property Listing</h1>
                            <p className="text-sm text-muted-foreground">Fill in the details to publish a new property.</p>
                        </div>
                    </div>
                </div>

                <form action={createProperty}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT COLUMN - Main Details (2/3 width) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Section 1: Basic Info */}
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
                                            placeholder="e.g. Modern 4-Bedroom Duplex in Lekki Phase 1"
                                            required
                                            className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all font-medium placeholder:text-muted-foreground/50"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Property Type</label>
                                            <div className="relative">
                                                <select
                                                    id="type"
                                                    name="type"
                                                    required
                                                    defaultValue=""
                                                    className="flex h-12 w-full rounded-md border border-transparent bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus:bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-all font-medium text-foreground"
                                                >
                                                    <option value="" disabled>Select Type...</option>
                                                    <option value="Apartment">Apartment / Flat</option>
                                                    <option value="House">House / Duplex</option>
                                                    <option value="Land">Land</option>
                                                    <option value="Commercial">Commercial / Office</option>
                                                    <option value="Building">Multi-Unit Building</option>
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
                                                    placeholder="City, State"
                                                    required
                                                    className="pl-9 h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all font-medium placeholder:text-muted-foreground/50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="bedrooms" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Bedrooms</label>
                                            <Input id="bedrooms" name="bedrooms" type="number" placeholder="0" min="0" className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all text-center" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="bathrooms" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Bathrooms</label>
                                            <Input id="bathrooms" name="bathrooms" type="number" placeholder="0" min="0" className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all text-center" />
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
                                                className="flex w-full rounded-md border border-transparent bg-muted/50 pl-9 pr-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus:bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all text-foreground"
                                                placeholder="Describe the key features, amenities, and neighborhood..."
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Owner & Structure */}
                            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                                <div className="flex items-center gap-2 mb-6 text-foreground font-semibold border-b border-border pb-2">
                                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <h2>Ownership & Structure</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="ownerId" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Landlord <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select
                                                id="ownerId"
                                                name="ownerId"
                                                required
                                                defaultValue=""
                                                className="flex h-12 w-full rounded-md border border-transparent bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus:bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none transition-all font-medium text-foreground"
                                            >
                                                <option value="" disabled>Select Landlord...</option>
                                                {landlords.map(l => (
                                                    <option key={l.id} value={l.id}>{l.name || l.email}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-4 pointer-events-none text-muted-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground/70 ml-1">Select the verified property owner.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                                            <input type="checkbox" id="isMultiUnit" name="isMultiUnit" className="h-5 w-5 rounded border-muted-foreground/30 text-primary focus:ring-primary bg-background" />
                                            <label htmlFor="isMultiUnit" className="text-sm font-medium text-foreground cursor-pointer select-none">Multi-Unit Property?</label>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="unitCount" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Number of Units</label>
                                            <Input id="unitCount" name="unitCount" type="number" placeholder="e.g. 4" min="0" className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Section 3: Media */}
                            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                                <div className="flex items-center gap-2 mb-6 text-foreground font-semibold border-b border-border pb-2">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                        <ImageIcon className="h-4 w-4" />
                                    </div>
                                    <h2>Gallery</h2>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Cover Image</label>
                                    <ImageUpload name="images" />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Status & Actions (1/3 width) */}
                        <div className="space-y-6">

                            <div className="bg-card rounded-xl shadow-sm border border-border p-6 sticky top-6">
                                <div className="flex items-center gap-2 mb-6 text-foreground font-semibold border-b border-border pb-2">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                        <Activity className="h-4 w-4" />
                                    </div>
                                    <h2>Status & Value</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Annual Price</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₦</div>
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                placeholder="0.00"
                                                required
                                                className="pl-8 h-12 text-lg font-bold bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label htmlFor="serviceCharge" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Service Charge (Annual)</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₦</div>
                                                <Input
                                                    id="serviceCharge"
                                                    name="serviceCharge"
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="pl-8 h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="cautionDeposit" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Caution Fee (One-time)</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₦</div>
                                                <Input
                                                    id="cautionDeposit"
                                                    name="cautionDeposit"
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="pl-8 h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="managementFee" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Mgt Fee (%)</label>
                                            <div className="relative">
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">%</div>
                                                <Input
                                                    id="managementFee"
                                                    name="managementFee"
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="10"
                                                    className="pr-8 h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Listing Status</label>
                                        <div className="relative">
                                            <select
                                                id="status"
                                                name="status"
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
                            <div className="flex flex-col gap-3 sticky top-80">
                                <Button type="submit" className="w-full h-14 text-base font-bold shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 rounded-xl">
                                    <Save className="mr-2 h-5 w-5" /> Publish Property
                                </Button>
                                <Link href="/admin/properties" className="w-full">
                                    <Button variant="outline" type="button" className="w-full h-14 rounded-xl border-border hover:bg-muted font-bold text-muted-foreground hover:text-foreground">Cancel</Button>
                                </Link>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
