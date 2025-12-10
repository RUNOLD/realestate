
import Link from "next/link";
import {
    MapPin,
    BedDouble,
    Bath,
    Maximize,
    Search,
    SlidersHorizontal,
    ArrowRight,
    Calendar,
    Phone
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SearchFilter } from "@/components/home/SearchFilter";

export const dynamic = 'force-dynamic';

export default async function PropertiesPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const params = await searchParams;
    const location = params?.location as string | undefined;
    const type = params?.type as string | undefined;
    const priceRange = params?.priceRange as string | undefined;

    const where: any = {
        status: "AVAILABLE",
    };

    if (location) {
        where.location = { contains: location };
    }

    if (type) {
        where.type = { equals: type };
    }

    if (priceRange) {
        if (priceRange === 'low') {
            where.price = { lt: 1000000 };
        } else if (priceRange === 'mid') {
            where.price = { gte: 1000000, lte: 5000000 };
        } else if (priceRange === 'high') {
            where.price = { gt: 5000000 };
        }
    }

    const properties = await prisma.property.findMany({
        where,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <main className="min-h-screen bg-background font-sans">


            {/* 1. Enhanced Hero Section with Lead Focus */}
            <div className="relative bg-primary py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Abstract Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
                        Find Your Next <span className="text-accent">Dream Home</span>
                    </h1>
                    <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg md:text-xl mb-10 leading-relaxed">
                        Browse our exclusive collection of premium rental properties.
                        From modern city apartments to serene suburban villas.
                    </p>

                    {/* Search/Filter Bar */}
                    <div className="max-w-4xl mx-auto text-left text-foreground bg-white p-4 rounded-xl shadow-xl">
                        <form action="/properties" method="GET" className="flex flex-col md:flex-row gap-4">
                            <div className="flex-grow relative text-gray-800">
                                <Search className="absolute left-3 top-3.5 text-muted-foreground w-5 h-5" />
                                <input
                                    name="location"
                                    type="text"
                                    placeholder="Search by location..."
                                    defaultValue={location}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/20"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select name="type" defaultValue={type} className="px-4 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 border border-transparent">
                                    <option value="">Any Type</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="house">House</option>
                                    <option value="villa">Villa</option>
                                </select>
                                <button type="submit" className="px-8 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-yellow-600 transition-colors shadow-md whitespace-nowrap">
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-border pb-6">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary">Available Properties</h2>
                        <p className="text-muted-foreground mt-1">Showing {properties.length} active listings</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <span className="text-sm text-muted-foreground">Sort by:</span>
                        <select className="bg-transparent font-medium text-foreground focus:outline-none cursor-pointer">
                            <option>Newest Added</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {properties.length === 0 ? (
                    <div className="text-center py-24 bg-card rounded-2xl border border-border/60 shadow-sm">
                        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">No matches found</h3>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto mb-8">
                            We currently don't have properties matching {location ? `"${location}"` : 'your criteria'}, but our inventory changes daily.
                        </p>
                        <Link href="/properties" className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors inline-block">
                            Clear Filters
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((property) => {
                            // Logic to determine if "New" (within 7 days)
                            const isNew = (new Date().getTime() - new Date(property.createdAt).getTime()) / (1000 * 3600 * 24) < 7;

                            return (
                                <Link href={`/properties/${property.id}`} key={property.id} className="group block h-full">
                                    <article className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-border h-full flex flex-col">
                                        <div className="relative h-72 overflow-hidden">
                                            <img
                                                src={property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2070&auto=format&fit=crop"}
                                                alt={property.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                                            <div className="absolute top-4 right-4 flex gap-2">
                                                <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 text-xs font-bold rounded-md uppercase shadow-sm">
                                                    {property.type}
                                                </span>
                                            </div>

                                            {isNew && (
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-md shadow-sm flex items-center gap-1">
                                                        <Calendar size={12} /> New
                                                    </span>
                                                </div>
                                            )}

                                            <div className="absolute bottom-4 left-4 text-white">
                                                <p className="text-2xl font-bold">₦{property.price.toLocaleString()}<span className="text-sm font-normal opacity-80">/yr</span></p>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-primary mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                                                {property.title}
                                            </h3>
                                            <div className="flex items-center text-muted-foreground text-sm mb-6">
                                                <MapPin size={16} className="mr-1 text-accent" />
                                                {property.location}
                                            </div>

                                            <div className="flex items-center justify-between py-4 border-t border-border/60 mt-auto">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground" title="Bedrooms">
                                                    <BedDouble size={18} />
                                                    <span className="font-medium text-foreground">3</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground" title="Bathrooms">
                                                    <Bath size={18} />
                                                    <span className="font-medium text-foreground">2</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground" title="Square Footage">
                                                    <Maximize size={18} />
                                                    <span className="font-medium text-foreground">1,200</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-border/60">
                                                <span className="w-full flex items-center justify-center text-sm font-bold text-primary bg-muted/50 py-3 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                                                    View Details
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 3. "Not Found" Lead Capture Section */}
            <section className="bg-muted/30 py-20 border-t border-border">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-4">Can't find what you're looking for?</h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Our off-market inventory is constantly changing. Tell us what you need, and we'll find it for you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all">
                            Request Specific Property
                        </Link>
                        <a href="tel:+234000000000" className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-base font-medium rounded-lg text-primary bg-transparent hover:bg-primary/5 transition-all">
                            <Phone size={18} className="mr-2" /> Call an Agent
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
