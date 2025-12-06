
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
  CheckCircle2
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch featured properties
  const featuredProperties = await prisma.property.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    where: { status: 'AVAILABLE' }
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
                  <img
                    src={property.images && property.images.length > 5 ? property.images : "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2070&auto=format&fit=crop"}
                    alt={property.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-md text-xs font-bold shadow-sm">
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

                  {/* Amenities Row - Mock data if not in DB, assuming standard fields */}
                  <div className="flex items-center justify-between py-4 border-t border-border/60 mt-auto">
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <BedDouble size={16} />
                      <span className="font-medium text-foreground">3</span> <span className="text-xs">Beds</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Bath size={16} />
                      <span className="font-medium text-foreground">2</span> <span className="text-xs">Baths</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Maximize size={16} />
                      <span className="font-medium text-foreground">1,200</span> <span className="text-xs">sqft</span>
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

      {/* CTA / Contact Section (New) */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to find your new home?</h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Browse our latest listings or contact our agents to help you navigate the market with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <button className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-bold w-full sm:w-auto">
                Browse Properties
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-bold w-full sm:w-auto">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}