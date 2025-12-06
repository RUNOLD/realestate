import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { 
    Plus, 
    Edit, 
    Trash2, 
    MapPin, 
    Search, 
    Filter, 
    Home, 
    BedDouble, 
    Maximize,
    MoreVertical
} from "lucide-react";

export default async function AdminPropertiesPage() {
    // Fetch data
    const properties = await prisma.property.findMany({
        orderBy: { createdAt: 'desc' }
    });

    // Calculate stats for the header
    const totalProperties = properties.length;
    const availableCount = properties.filter(p => p.status === 'AVAILABLE').length;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* 1. Header & Stats */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Properties</h1>
                        <p className="text-gray-500 mt-1">Manage your portfolio and track listing status.</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                            <span><strong>{totalProperties}</strong> Total Listings</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-green-600"><strong>{availableCount}</strong> Active on Market</span>
                        </div>
                    </div>
                    <Link href="/admin/properties/new">
                        <Button className="gap-2 bg-gray-900 hover:bg-black text-white shadow-md">
                            <Plus size={16} /> Add Property
                        </Button>
                    </Link>
                </div>

                {/* 2. Filters & Search Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                    {/* Tabs (Visual only for now) */}
                    <div className="flex p-1 bg-gray-100 rounded-md">
                        <button className="px-4 py-1.5 text-sm font-medium bg-white shadow-sm rounded-sm text-gray-900">All</button>
                        <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">Available</button>
                        <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">Rented</button>
                        <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">Sold</button>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search by address..." 
                                className="w-full pl-9 pr-4 py-1.5 text-sm border-none bg-transparent focus:outline-none focus:ring-0"
                            />
                        </div>
                        <div className="h-6 w-px bg-gray-200 mx-2"></div>
                        <Button variant="ghost" size="icon" className="text-gray-500">
                            <Filter size={16} />
                        </Button>
                    </div>
                </div>

                {/* 3. Property Grid (Better than a table for Real Estate) */}
                {properties.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Helper Components ---

function PropertyCard({ property }) {
    return (
        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
            {/* Image Area */}
            <div className="relative h-48 bg-gray-100">
                {property.images ? (
                    <img 
                        src={property.images} 
                        alt={property.title} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Home size={32} />
                    </div>
                )}
                
                {/* Status Badge Overlay */}
                <div className="absolute top-3 right-3">
                    <StatusBadge status={property.status} />
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{property.type}</p>
                        <h3 className="font-bold text-gray-900 line-clamp-1">{property.title}</h3>
                    </div>
                    {/* Menu Button */}
                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                    <MapPin size={14} />
                    <span className="truncate">{property.location}</span>
                </div>

                {/* Metrics Row (Mock data for visual example, replace with real columns if you have them) */}
                <div className="flex gap-4 border-t border-gray-100 pt-4 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <BedDouble size={14} /> 4 Beds
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Maximize size={14} /> 2,400 sqft
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                        ₦{property.price.toLocaleString()}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <Edit size={14} />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50 hover:border-red-200">
                            <Trash2 size={14} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        AVAILABLE: "bg-green-100 text-green-700 backdrop-blur-md bg-opacity-90",
        RENTED: "bg-blue-100 text-blue-700 backdrop-blur-md bg-opacity-90",
        SOLD: "bg-gray-800 text-white backdrop-blur-md bg-opacity-90",
        MAINTENANCE: "bg-orange-100 text-orange-700 backdrop-blur-md bg-opacity-90",
    };

    return (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold shadow-sm ${styles[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Home size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No properties yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first listing.</p>
            <div className="mt-6">
                <Link href="/admin/properties/new">
                    <Button>Add Property</Button>
                </Link>
            </div>
        </div>
    );
}