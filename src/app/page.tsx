
import { Hero } from "@/components/home/Hero";
import { SearchFilter } from "@/components/home/SearchFilter";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  ArrowRight,
  Search,
  Star,
  Quote,
  CheckCircle2,
  Map as MapIcon,
  Compass
} from "lucide-react";
import Image from "next/image";

import { PropertyStatus } from "@prisma/client";

export const dynamic = 'force-dynamic';

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Real Estate & Property Management in Lagos",
  description: "Discover premium rental properties, expert property management, and specialized sourcing services in the most sought-after locations in Lagos.",
  alternates: {
    canonical: "https://ayoolarealestate.com",
  }
};

export default async function Home() {
  // Fetch featured properties
  const featuredProperties = await prisma.property.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    where: { status: PropertyStatus.AVAILABLE }
  });

  return (
    <main className="min-h-screen bg-background font-sans text-foreground">


      {/* Hero Section */}
      <div className="relative">
        <Hero />
        <SearchFilter />
      </div>

      {/* Featured Properties Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <span className="text-accent font-semibold tracking-wider text-sm uppercase">Exclusive Offers</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-2">Featured Listings</h2>
            <p className="text-muted-foreground mt-3">
              Explore our hand-picked selection of premium properties available for rent.
            </p>
          </div>
          <Link href="/properties" className="hidden md:flex items-center text-primary font-medium hover:text-accent transition-colors">
            View All Properties <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.length > 0 ? (
            featuredProperties.map((property) => (
              <div key={property.id} className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2070&auto=format&fit=crop"}
                    alt={`Property ${property.title} in ${property.location}`}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-md text-xs font-bold shadow-sm z-10">
                    FOR RENT
                  </div>
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {property.status}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-primary line-clamp-1 group-hover:text-accent transition-colors">{property.title}</h3>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm mb-6">
                    <MapPin size={14} className="mr-1 text-accent" />
                    {property.location}
                  </div>

                  {/* Amenities Row */}
                  <div className="flex items-center justify-between py-4 border-t border-border/60 mt-auto">
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <BedDouble size={16} />
                      <span className="font-medium text-foreground">{property.bedrooms ?? 0}</span> <span className="text-xs">Beds</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Bath size={16} />
                      <span className="font-medium text-foreground">{property.bathrooms ?? 0}</span> <span className="text-xs">Baths</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Maximize size={16} />
                      <span className="font-medium text-foreground">{property.sqft?.toLocaleString() ?? 0}</span> <span className="text-xs">sqft</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-border/60">
                    <div>
                      <span className="text-xs text-muted-foreground block">Price</span>
                      <span className="text-lg font-bold text-primary">₦{property.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">/year</span>
                    </div>
                    <Link
                      href={`/properties/${property.id}`}
                      className="px-4 py-2 bg-muted hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-all"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-20 bg-muted/20 rounded-xl">
              <p className="text-muted-foreground">No featured properties available at the moment.</p>
            </div>
          )}
        </div>

        <div className="mt-10 md:hidden text-center">
          <Link href="/properties" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90">
            View All Properties
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-semibold tracking-wider text-sm uppercase">Our Expertise</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-2 mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive real estate solutions, from property sourcing to full-scale management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Property Sourcing",
                desc: "We use our extensive network to find properties that perfectly match your lifestyle and budget requirements.",
                icon: <Search className="w-8 h-8 text-accent" />
              },
              {
                title: "Property Management",
                desc: "End-to-end management of your assets, ensuring optimal returns, maintenance handling, and tenant satisfaction.",
                icon: <CheckCircle2 className="w-8 h-8 text-accent" />
              },
              {
                title: "Premium Materials",
                desc: "Direct supply of high-quality construction materials for your renovation or building projects at competitive rates.",
                icon: <Star className="w-8 h-8 text-accent" />
              },
            ].map((service, index) => (
              <div key={index} className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="bg-accent/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section (New) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Client Success Stories</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card p-8 rounded-xl border border-border relative">
              <Quote className="text-accent/20 absolute top-6 right-6 w-12 h-12" />
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-muted-foreground italic mb-6">"I found my dream apartment within days. The team was incredibly professional and the paperwork process was seamless."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-bold text-sm text-primary">Happy Tenant</h4>
                  <p className="text-xs text-muted-foreground">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Local SEO Area Guide Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-left max-w-2xl">
              <span className="text-accent font-semibold tracking-wider text-sm uppercase flex items-center gap-2">
                <Compass size={16} /> Neighborhood Discovery
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mt-4">Explore Lagos Living</h2>
              <p className="text-muted-foreground mt-4 text-lg">
                Discover the perfect location for your next chapter. From the vibrant energy of the mainland to the coastal luxury of the island.
              </p>
            </div>
            <Link href="/properties" className="group flex items-center gap-2 px-6 py-3 bg-primary text-white dark:bg-accent dark:text-accent-foreground rounded-full font-bold hover:opacity-90 transition-all">
              Discover All Areas <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Lekki Phase 1",
                slug: "lekki",
                desc: "Modern luxury living with the best entertainment and lifestyle hubs in Lagos.",
                image: "https://images.unsplash.com/photo-1590059300624-9b8ae2517869?q=80&w=800&auto=format&fit=crop",
                tag: "Bustling & Modern"
              },
              {
                name: "Old Ikoyi",
                slug: "ikoyi",
                desc: "The pinnacle of prestige and tranquility. Home to diplomacy and heritage.",
                image: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?q=80&w=800&auto=format&fit=crop",
                tag: "Elite & Serene"
              },
              {
                name: "Ikeja GRA",
                slug: "ikeja",
                desc: "Centrally located with lush greenery and premium residential accessibility.",
                image: "https://images.unsplash.com/photo-1610410091802-5321527494f3?q=80&w=800&auto=format&fit=crop",
                tag: "Connected & Green"
              }
            ].map((area, index) => (
              <div key={index} className="group relative h-[450px] rounded-2xl overflow-hidden shadow-lg border border-border/50">
                <Image
                  src={area.image}
                  alt={area.name}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent"></div>

                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter">
                    {area.tag}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{area.name}</h3>
                  <p className="text-white/80 text-sm mb-6 line-clamp-2">{area.desc}</p>
                  <Link
                    href={`/properties?location=${area.slug}`}
                    className="flex items-center gap-2 text-white font-bold hover:text-accent transition-colors"
                  >
                    View Properties <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact Section (New) */}
      <section className="bg-primary text-primary-foreground dark:bg-card dark:text-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-primary-foreground dark:text-foreground">Ready to find your new home?</h2>
          <p className="text-lg text-primary-foreground/80 dark:text-muted-foreground mb-10 max-w-2xl mx-auto">
            Browse our latest listings or contact our agents to help you navigate the market with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="px-8 py-4 bg-primary-foreground text-primary dark:bg-primary dark:text-primary-foreground rounded-lg hover:bg-primary-foreground/90 transition-colors font-bold w-full sm:w-auto text-center"
            >
              Browse Properties
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-primary-foreground text-primary-foreground dark:border-primary dark:text-primary rounded-lg hover:bg-primary-foreground/10 transition-colors font-bold w-full sm:w-auto text-center"
            >
              Contact Us
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
