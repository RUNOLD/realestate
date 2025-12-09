import { createProperty } from "@/app/actions/property";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import {
    ArrowLeft,
    Save,
    Home,
    MapPin,
    DollarSign,
    FileText,
    ImageIcon,
    Activity
} from "lucide-react";

export default function NewPropertyPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header with clear navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/properties">
                            <Button variant="outline" size="icon" className="h-10 w-10 bg-white hover:bg-gray-100 border-gray-200">
                                <ArrowLeft size={18} className="text-gray-600" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">New Property Listing</h1>
                            <p className="text-sm text-gray-500">Fill in the details to publish a new property.</p>
                        </div>
                    </div>
                </div>

                <form action={createProperty}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT COLUMN - Main Details (2/3 width) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Section 1: Basic Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold border-b border-gray-100 pb-2">
                                    <Home className="h-4 w-4 text-blue-600" />
                                    <h2>Property Details</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="title" className="text-sm font-medium text-gray-700">Listing Title <span className="text-red-500">*</span></label>
                                        <Input id="title" name="title" placeholder="e.g. Modern 4-Bedroom Duplex in Lekki Phase 1" required className="h-11" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="type" className="text-sm font-medium text-gray-700">Property Type</label>
                                            <div className="relative">
                                                <select
                                                    id="type"
                                                    name="type"
                                                    required
                                                    defaultValue=""
                                                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
                                                >
                                                    <option value="" disabled>Select Type...</option>
                                                    <option value="Apartment">Apartment / Flat</option>
                                                    <option value="House">House / Duplex</option>
                                                    <option value="Land">Land</option>
                                                    <option value="Commercial">Commercial / Office</option>
                                                </select>
                                                {/* Dropdown Chevron */}
                                                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                                <Input id="location" name="location" placeholder="City, State" required className="pl-9 h-11" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows={6}
                                                className="flex w-full rounded-md border border-input bg-background pl-9 pr-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                                placeholder="Describe the key features, amenities, and neighborhood..."
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Media */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold border-b border-gray-100 pb-2">
                                    <ImageIcon className="h-4 w-4 text-purple-600" />
                                    <h2>Gallery</h2>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="images" className="text-sm font-medium text-gray-700">Cover Image URL</label>
                                    <Input id="images" name="images" placeholder="https://..." className="h-11 font-mono text-xs" />
                                    <p className="text-xs text-muted-foreground">We currently support one main cover image.</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Status & Actions (1/3 width) */}
                        <div className="space-y-6">

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold border-b border-gray-100 pb-2">
                                    <Activity className="h-4 w-4 text-green-600" />
                                    <h2>Status & Value</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="price" className="text-sm font-medium text-gray-700">Price</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">₦</div>
                                            <Input id="price" name="price" type="number" placeholder="0.00" required className="pl-8 h-11 text-lg font-semibold" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="status" className="text-sm font-medium text-gray-700">Listing Status</label>
                                        <div className="relative">
                                            <select
                                                id="status"
                                                name="status"
                                                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
                                            >
                                                <option value="AVAILABLE">🟢 Available</option>
                                                <option value="RENTED">🔴 Rented</option>
                                                <option value="SOLD">🔵 Sold</option>
                                                <option value="MAINTENANCE">🟠 Maintenance</option>
                                            </select>
                                            <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <Button type="submit" variant="luxury" className="w-full h-12 text-base shadow-md bg-gray-900 hover:bg-black text-white">
                                    <Save className="mr-2 h-4 w-4" /> Publish Property
                                </Button>
                                <Link href="/admin/properties" className="w-full">
                                    <Button variant="outline" type="button" className="w-full h-12">Cancel</Button>
                                </Link>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}