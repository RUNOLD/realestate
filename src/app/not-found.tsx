import Link from "next/link";
import { Search, Home, ArrowRight, MapPin, BedDouble, Bath } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function NotFound() {
    // Fetch 3 featured/latest available properties to keep users on site
    const featuredProperties = await prisma.property.findMany({
        where: { status: "AVAILABLE" },
        take: 3,
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center py-20 px-4">
            <div className="max-w-4xl w-full text-center">
                {/* 404 Hero */}
                <div className="mb-12">
                    <h1 className="text-9xl font-serif font-black text-primary/10 select-none">404</h1>
                    <div className="relative -mt-16 sm:-mt-20">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4">Page Not Found</h2>
                        <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
                            Oops! It seems the property or page you're looking for has moved or is no longer available.
                        </p>
                    </div>
                </div>

                {/* Search Bar - SEO requirement */}
                <div className="max-w-2xl mx-auto mb-20">
                    <form action="/properties" method="GET" className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            name="location"
                            placeholder="Try searching for a location (e.g., Lekki, Victoria Island)..."
                            className="w-full pl-12 pr-32 py-4 rounded-2xl bg-muted/50 border border-border focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all text-lg"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 px-6 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg text-sm sm:text-base"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Featured Properties Section - Keep bots & users on site */}
                <div className="text-left">
                    <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                        <h3 className="text-2xl font-serif font-bold text-primary">Featured Listings</h3>
                        <Link href="/properties" className="text-accent font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredProperties.map((property) => (
                            <Link href={`/properties/${property.id}`} key={property.id} className="group">
                                <article className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300">
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2070&auto=format&fit=crop"}
                                            alt={property.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm text-primary-foreground px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                            {property.status}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-primary mb-1 line-clamp-1">{property.title}</h4>
                                        <div className="flex items-center text-muted-foreground text-xs mb-3">
                                            <MapPin size={12} className="mr-1 text-accent" />
                                            {property.location}
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-bold text-primary pt-3 border-t border-border/50">
                                            <span>₦{property.price.toLocaleString()}</span>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <span className="flex items-center gap-1"><BedDouble size={14} /> {property.bedrooms || 0}</span>
                                                <span className="flex items-center gap-1"><Bath size={14} /> {property.bathrooms || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Back Home Button */}
                <div className="mt-20">
                    <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-muted text-foreground font-bold rounded-2xl hover:bg-muted/80 transition-all border border-border shadow-sm group">
                        <Home size={20} className="group-hover:text-accent transition-colors" />
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </main>
    );
}
