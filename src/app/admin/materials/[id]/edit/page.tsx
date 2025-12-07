import { updateMaterial } from "@/app/actions/material";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    Save,
    Package,
    Tag,
    DollarSign,
    ImageIcon,
    FileText,
    Info
} from "lucide-react";

export default async function EditMaterialPage({ params }: { params: { id: string } }) {
    const material = await prisma.material.findUnique({
        where: { id: params.id }
    });

    if (!material) return notFound();

    const updateAction = updateMaterial.bind(null, material.id);

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/materials">
                            <Button variant="outline" size="icon" className="h-10 w-10 bg-white hover:bg-gray-100 border-gray-200">
                                <ArrowLeft size={18} className="text-gray-600" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Material</h1>
                            <p className="text-sm text-gray-500">Update inventory item details.</p>
                        </div>
                    </div>

                    <div className="hidden sm:flex gap-3">
                        <Link href="/admin/materials">
                            <Button variant="ghost" type="button" className="text-gray-600">Cancel</Button>
                        </Link>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <form action={updateAction} className="p-6 sm:p-8 space-y-8">

                        {/* Section 1: Basic Information */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
                                    <Package size={18} />
                                </div>
                                <h3 className="font-semibold text-gray-900">Product Details</h3>
                            </div>

                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                        Material Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={material.name}
                                        required
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="description" className="text-sm font-medium text-gray-700">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            defaultValue={material.description}
                                            className="flex w-full rounded-md border border-input bg-background pl-10 pr-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[100px]"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Classification & Pricing */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <div className="p-1.5 bg-green-50 rounded-md text-green-600">
                                    <Tag size={18} />
                                </div>
                                <h3 className="font-semibold text-gray-900">Classification & Pricing</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="category" className="text-sm font-medium text-gray-700">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="category"
                                            name="category"
                                            defaultValue={material.category}
                                            required
                                            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                        >
                                            <option value="" disabled>Select a category...</option>
                                            <option value="Cement">Cement</option>
                                            <option value="Steel">Steel / Iron Rods</option>
                                            <option value="Sand">Sand & Gravel</option>
                                            <option value="Wood">Wood & Roofing</option>
                                            <option value="Plumbing">Plumbing</option>
                                            <option value="Electrical">Electrical</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="price" className="text-sm font-medium text-gray-700">
                                        Unit Price (Optional)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            defaultValue={material.price || ""}
                                            className="pl-9 h-11"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Info size={12} />
                                        Leave empty to show "Contact for Price"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Media */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <div className="p-1.5 bg-purple-50 rounded-md text-purple-600">
                                    <ImageIcon size={18} />
                                </div>
                                <h3 className="font-semibold text-gray-900">Material Image</h3>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="images" className="text-sm font-medium text-gray-700">
                                    Image URL
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            id="images"
                                            name="images"
                                            defaultValue={material.images}
                                            className="h-11 font-mono text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <Link href="/admin/materials" className="w-full sm:w-auto">
                                <Button variant="outline" type="button" className="w-full h-11">Cancel</Button>
                            </Link>
                            <Button type="submit" className="w-full sm:w-auto gap-2 h-11 bg-gray-900 hover:bg-black text-white">
                                <Save size={16} /> Save Changes
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
