'use client';

import { Search, MapPin, Home, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SearchFilter() {
    const router = useRouter();
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");
    const [priceRange, setPriceRange] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Construct query params
        const params = new URLSearchParams();
        if (location) params.set("location", location);
        if (type) params.set("type", type);
        // Simple redirection to properties page for now
        router.push(`/properties?${params.toString()}`);
    };

    return (
        <div className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 pointer-events-none">
            <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50 p-6 pointer-events-auto">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

                    {/* Location Input */}
                    <div className="md:col-span-4 space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-foreground ml-1 flex items-center gap-1">
                            <MapPin size={14} /> Location
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="E.g. Bodija, Akala Express, Jericho"
                                className="w-full pl-4 pr-4 py-3 bg-muted/30 dark:bg-muted/10 border-2 border-border/50 focus:border-primary/40 hover:bg-muted/40 rounded-xl outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Type Select */}
                    <div className="md:col-span-3 space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-foreground ml-1 flex items-center gap-1">
                            <Home size={14} /> Property Type
                        </label>
                        <div className="relative">
                            <select
                                className="w-full pl-4 pr-10 py-3 bg-muted/30 dark:bg-muted/10 border-2 border-border/50 focus:border-primary/40 hover:bg-muted/40 rounded-xl outline-none transition-all font-bold text-foreground appearance-none cursor-pointer"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="" className="bg-background text-foreground">All Property Types</option>
                                <option value="apartment" className="bg-background text-foreground">Apartment</option>
                                <option value="house" className="bg-background text-foreground">House</option>
                                <option value="villa" className="bg-background text-foreground">Villa</option>
                                <option value="office" className="bg-background text-foreground">Office Space</option>
                            </select>
                            {/* Custom Arrow */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Price Range Select */}
                    <div className="md:col-span-3 space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-foreground ml-1 flex items-center gap-1">
                            <Banknote size={14} /> Price Range
                        </label>
                        <div className="relative">
                            <select
                                className="w-full pl-4 pr-10 py-3 bg-muted/30 dark:bg-muted/10 border-2 border-border/50 focus:border-primary/40 hover:bg-muted/40 rounded-xl outline-none transition-all font-bold text-foreground appearance-none cursor-pointer"
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                            >
                                <option value="" className="bg-background text-foreground">Any Price</option>
                                <option value="low" className="bg-background text-foreground">Under ₦1M</option>
                                <option value="mid" className="bg-background text-foreground">₦1M - ₦5M</option>
                                <option value="high" className="bg-background text-foreground">Above ₦5M</option>
                            </select>
                            {/* Custom Arrow */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="md:col-span-2">
                        <Button type="submit" className="w-full h-[52px] rounded-xl text-base shadow-lg hover:shadow-primary/20 sm:mb-[1px]">
                            <Search size={20} className="mr-2" />
                            Search
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}
