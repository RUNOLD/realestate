import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Edit,
    Trash2,
    Filter,
    Package,
    MoreHorizontal,
    AlertCircle
} from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Search } from "@/components/admin/Search";

interface PageProps {
    searchParams: Promise<{ query?: string }>;
}

export default async function AdminMaterialsPage({ searchParams }: PageProps) {
    const { query } = await searchParams;

    const where = query ? {
        OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { category: { contains: query, mode: 'insensitive' as const } },
            { uniqueId: { contains: query, mode: 'insensitive' as const } }
        ]
    } : {};

    // Fetch data
    const materials = await prisma.material.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    });

    // Calculate quick stats
    const totalItems = materials.length;
    const outOfStock = materials.filter(m => !m.inStock).length;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* 1. Page Header & Stats */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Materials</h1>
                        <p className="text-gray-500 mt-1">Manage construction inventory and pricing.</p>

                        <div className="flex gap-4 mt-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <span className="font-semibold text-gray-900">{totalItems}</span> Total Items
                            </div>
                            {outOfStock > 0 && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                    <AlertCircle size={14} />
                                    <span className="font-semibold">{outOfStock}</span> Out of Stock
                                </div>
                            )}
                        </div>
                    </div>

                    <Link href="/admin/materials/new">
                        <Button className="gap-2 bg-gray-900 text-white hover:bg-black shadow-sm">
                            <Plus size={16} /> Add Material
                        </Button>
                    </Link>
                </div>

                {/* 2. Controls Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-80">
                        <Search placeholder="Search materials..." />
                    </div>
                    <Button variant="outline" className="border-gray-200 text-gray-700 bg-white gap-2">
                        <Filter size={16} /> Filter
                    </Button>
                </div>

                {/* 3. The Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-[40%]">Item Details</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price / Unit</th>
                                    <th className="px-6 py-4">Inventory Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {materials.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                    <Package className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <p className="font-medium text-gray-900">No materials found</p>
                                                <p className="text-sm mt-1 mb-4">Get started by adding items to your inventory.</p>
                                                <Link href="/admin/materials/new">
                                                    <Button variant="outline">Add First Material</Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    materials.map((material) => (
                                        <tr key={material.id} className="group hover:bg-gray-50/50 transition-colors">
                                            {/* Name & Image Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                                        {material.images ? (
                                                            <img
                                                                src={material.images && material.images.length > 0 ? material.images[0] : '/placeholder.png'}
                                                                alt={material.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <Package className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{material.name}</div>
                                                        <div className="text-xs text-gray-500 font-mono mt-0.5">ID: {(material as any).uniqueId || material.id.substring(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category Column */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {material.category}
                                                </span>
                                            </td>

                                            {/* Price Column */}
                                            <td className="px-6 py-4 font-medium text-gray-700">
                                                {material.price ? (
                                                    `₦${material.price.toLocaleString()}`
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs">Contact for Price</span>
                                                )}
                                            </td>

                                            {/* Status Column */}
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${material.inStock
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-red-50 text-red-700 border-red-200'
                                                    }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${material.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    {material.inStock ? 'In Stock' : 'Out of Stock'}
                                                </div>
                                            </td>

                                            {/* Actions Column */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/admin/materials/${material.id}/edit`}>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                                                            <Edit size={16} />
                                                        </Button>
                                                    </Link>
                                                    <DeleteButton id={material.id} type="MATERIAL" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Simple Pagination Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                        <span>Showing all items</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled className="h-7 text-xs bg-white">Prev</Button>
                            <Button variant="outline" size="sm" disabled className="h-7 text-xs bg-white">Next</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
