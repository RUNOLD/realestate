
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
    Truck,
    ShieldCheck,
    Phone,
    Search,
    Filter,
    ArrowRight,
    MessageCircle,
    PackageCheck
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MaterialsPage() {
    const materials = await prisma.material.findMany({
        orderBy: { createdAt: 'desc' },
        where: { inStock: true }
    });

    // Extract unique categories for the filter bar
    const categories = Array.from(new Set(materials.map(m => m.category))).slice(0, 6);

    return (
        <main className="min-h-screen bg-muted/10 dark:bg-background font-sans">


            {/* 1. Industrial Hero Section */}
            <div className="relative bg-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    {/* Abstract grid pattern */}
                    <svg className="h-full w-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" /></pattern></defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-sm font-bold border border-yellow-500/30 mb-6">
                            <Truck size={14} /> Nationwide Delivery Available
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                            Premium Construction <br /> <span className="text-yellow-500">Materials Supply</span>
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl">
                            Source high-grade cement, steel, blocks, and finishing materials directly from the warehouse. Bulk discounts available for contractors.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/contact?subject=Bulk Quote Supply" className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 text-black font-bold rounded-md hover:bg-yellow-400 transition-colors">
                                Request Bulk Quote <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <a href="tel:+2348050758674" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-md hover:bg-white/20 transition-colors">
                                <Phone className="mr-2 w-5 h-5" /> Call for Pricing
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Category Navigation Bar (Sticky-ish feel) */}
            <div className="bg-white dark:bg-card border-b border-border sticky top-0 z-10 shadow-sm overflow-x-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="flex items-center text-sm font-bold text-muted-foreground mr-4 shrink-0">
                        <Filter size={16} className="mr-2" /> Filter by:
                    </span>
                    <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium shrink-0 whitespace-nowrap transition-colors">
                        All Materials
                    </button>
                    {categories.map((cat, i) => (
                        <button key={i} className="px-4 py-1.5 bg-muted/50 dark:bg-muted/20 text-foreground dark:text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-muted/40 rounded-full text-sm font-medium shrink-0 whitespace-nowrap border border-transparent hover:border-border transition-all">
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Materials Grid */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-bold text-slate-900">Available Stock</h2>
                    <span className="text-sm text-muted-foreground">{materials.length} items listed</span>
                </div>

                {materials.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-card rounded-xl border border-dashed border-slate-300 dark:border-border">
                        <PackageCheck className="mx-auto h-12 w-12 text-slate-300 dark:text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium text-foreground">Inventory Updating</h3>
                        <p className="text-muted-foreground mt-2">New stock is arriving. Please check back in a few hours.</p>
                        <Link href="/contact" className="inline-block mt-6 text-primary dark:text-primary font-bold hover:underline">
                            Contact Sales Team
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {materials.map((material) => (
                            <div key={material.id} className="group bg-white dark:bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-border flex flex-col h-full">
                                {/* Image Area */}
                                <div className="relative h-64 bg-slate-100 overflow-hidden">
                                    <img
                                        src={material.images.length > 0 ? material.images[0] : "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?q=80&w=2000&auto=format&fit=crop"}
                                        alt={material.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                        <PackageCheck size={12} /> IN STOCK
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <p className="text-white text-xs font-medium uppercase tracking-wider opacity-90">{material.category}</p>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-foreground mb-2 leading-tight">{material.name}</h3>
                                    <p className="text-slate-500 dark:text-muted-foreground text-sm mb-6 line-clamp-2 flex-grow">{material.description}</p>

                                    <div className="border-t border-slate-100 dark:border-border pt-4 mt-auto">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <p className="text-xs text-slate-400 dark:text-muted-foreground font-medium uppercase">Unit Price</p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                                                    {material.price ? `₦${material.price.toLocaleString()}` : 'Ask for Price'}
                                                </p>
                                            </div>
                                            {/* Mock Unit display */}
                                            <span className="text-xs font-medium bg-slate-100 dark:bg-muted text-slate-600 dark:text-muted-foreground px-2 py-1 rounded">
                                                Per Unit
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <a
                                                href={`https://wa.me/2348050758674?text=I'm interested in buying ${material.name}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                                            >
                                                <MessageCircle size={16} /> WhatsApp
                                            </a>
                                            <Link
                                                href="/contact"
                                                className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-muted text-slate-900 dark:text-foreground py-2.5 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-muted/80 transition-colors"
                                            >
                                                Enquire
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. Trust/Process Section */}
            <section className="bg-white dark:bg-card border-t border-slate-200 dark:border-border py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-foreground">Why Contractors Choose Us</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-700 dark:text-yellow-500">
                                <Truck size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-2 dark:text-foreground">Fast Site Delivery</h3>
                            <p className="text-muted-foreground">We deliver directly to your construction site within 24-48 hours of order confirmation.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-700 dark:text-blue-500">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-2 dark:text-foreground">Quality Guaranteed</h3>
                            <p className="text-muted-foreground">All materials are sourced from verified manufacturers and checked for quality assurance.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 dark:text-green-500">
                                <PackageCheck size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-2 dark:text-foreground">Bulk Discounts</h3>
                            <p className="text-muted-foreground">Large project? Get special pricing tiers when you order heavy duty materials in bulk.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
