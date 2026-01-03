import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, MapPin, CheckCircle, Phone, Mail, BedDouble, Bath, Maximize, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";

interface PageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const property = await prisma.property.findUnique({
        where: { id }
    });

    if (!property) return { title: "Property Not Found" };

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ayoolarealestate.com";
    const propertyUrl = `${baseUrl}/properties/${property.id}`;
    const propertyImage = property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3";

    return {
        title: `${property.title} in ${property.location} | Ayoola Real Estate`,
        description: property.description.substring(0, 160),
        alternates: {
            canonical: propertyUrl,
        },
        openGraph: {
            title: property.title,
            description: property.description.substring(0, 160),
            url: propertyUrl,
            siteName: "Ayoola Property Management",
            images: [
                {
                    url: propertyImage,
                    width: 1200,
                    height: 630,
                    alt: property.title,
                },
            ],
            locale: "en_NG",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: property.title,
            description: property.description.substring(0, 160),
            images: [propertyImage],
        },
    };
}

export default async function PropertyDetailPage({ params }: PageProps) {
    const { id } = await params;

    const property = await prisma.property.findUnique({
        where: { id }
    });

    if (!property) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": property.title,
        "description": property.description,
        "image": property.images[0] || "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3",
        "offers": {
            "@type": "Offer",
            "price": property.price,
            "priceCurrency": "NGN",
            "availability": "https://schema.org/InStock"
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": property.location,
            "addressLocality": property.location,
            "addressRegion": "Lagos",
            "addressCountry": "NG"
        }
    };

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://ayoolarealestate.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Properties",
                "item": "https://ayoolarealestate.com/properties"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": property.location,
                "item": `https://ayoolarealestate.com/properties?location=${encodeURIComponent(property.location)}`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": property.title,
                "item": `https://ayoolarealestate.com/properties/${property.id}`
            }
        ]
    };

    return (
        <main className="min-h-screen bg-background">
            <Script
                id="property-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Script
                id="breadcrumb-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />

            {/* Hero Image Section */}
            <div className="relative h-[50vh] bg-gray-900">
                <Image
                    src={(property.images && property.images.length > 0 && (property.images[0].startsWith('http') || property.images[0].startsWith('/')))
                        ? property.images[0]
                        : "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2070&auto=format&fit=crop"}
                    alt={`${property.title} hero image`}
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 max-w-7xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-white/80 text-sm mb-6 font-medium" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={14} className="text-white/40" />
                        <Link href="/properties" className="hover:text-white transition-colors">Properties</Link>
                        <ChevronRight size={14} className="text-white/40" />
                        <Link href={`/properties?location=${encodeURIComponent(property.location)}`} className="hover:text-white transition-colors">{property.location}</Link>
                        <ChevronRight size={14} className="text-white/40" />
                        <span className="text-white font-bold truncate max-w-[200px]">{property.title}</span>
                    </nav>

                    <Link href="/properties" className="inline-block mb-4">
                        <Button variant="outline" size="sm" className="bg-background/20 backdrop-blur-md text-white border-white/20 hover:bg-white/20">
                            <ArrowLeft size={16} className="mr-2" /> Back to Listings
                        </Button>
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                        <div>
                            <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide mb-3 inline-block">
                                {property.status}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2 shadow-sm">{property.title}</h1>
                            <div className="flex items-center text-gray-200">
                                <MapPin size={20} className="mr-2" />
                                <span className="text-lg">{property.location}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-accent text-3xl md:text-4xl font-bold mb-1">
                                ₦{property.price.toLocaleString()}
                                <span className="text-sm font-normal text-white/80 lowercase ml-1">/ year</span>
                            </div>
                            <div className="text-white/60 text-sm">Rent Price</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-card rounded-xl border border-border shadow-sm">
                            <div className="text-center">
                                <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Bedrooms</div>
                                <div className="text-xl font-bold">{property.bedrooms || 0} Rooms</div>
                            </div>
                            <div className="text-center border-l border-border">
                                <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Size</div>
                                <div className="text-xl font-bold">{property.sqft?.toLocaleString() || 0} sqft</div>
                            </div>
                            <div className="text-center border-l border-border">
                                <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Type</div>
                                <div className="text-xl font-bold capitalize">{(property.type || 'Property').toLowerCase()}</div>
                            </div>
                            <div className="text-center border-l border-border">
                                <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Location</div>
                                <div className="text-xl font-bold">{property.location}</div>
                            </div>
                        </section>

                        <section className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-accent/5 rounded-xl border border-accent/10">
                            <div className="text-center">
                                <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Service Charge</div>
                                <div className="text-xl font-bold">₦{property.serviceCharge?.toLocaleString() || 0}</div>
                            </div>
                            <div className="text-center border-l border-border">
                                <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Caution Fee</div>
                                <div className="text-xl font-bold">₦{property.cautionDeposit?.toLocaleString() || 0}</div>
                            </div>
                            <div className="text-center border-l border-border">
                                <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Status</div>
                                <div className="text-xl font-bold text-accent">{property.status}</div>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-2xl font-serif font-bold text-primary mb-4 p-b-2 border-b border-border inline-block">Description</h2>
                            <div className="prose prose-lg text-muted-foreground whitespace-pre-wrap">
                                {property.description}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold text-primary mb-6">Key Features</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                                    <CheckCircle size={20} className="text-accent" />
                                    <span>Modern Architecture</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                                    <CheckCircle size={20} className="text-accent" />
                                    <span>Premium Finishes</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                                    <CheckCircle size={20} className="text-accent" />
                                    <span>Serene Environment</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                                    <CheckCircle size={20} className="text-accent" />
                                    <span>24/7 Security</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-card p-6 rounded-xl border border-border shadow-sm sticky top-24">
                            <h3 className="text-xl font-bold text-primary mb-4">Interested in this property?</h3>
                            <p className="text-muted-foreground mb-6">Contact our agents to schedule a viewing or request more information.</p>

                            <div className="space-y-4">
                                <a
                                    href="tel:+2348050758674"
                                    className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 px-4 py-2 font-medium transition-colors"
                                >
                                    <Phone size={18} /> Call Agent
                                </a>
                                <Link
                                    href={`/contact?subject=Inquiry about ${property.title}`}
                                    className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 font-medium transition-colors"
                                >
                                    <Mail size={18} /> Send Message
                                </Link>
                            </div>

                            <hr className="my-6 border-border" />

                            <div className="text-center">
                                <Image
                                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop"
                                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                                    alt="Property Agent"
                                    width={64}
                                    height={64}
                                />
                                <div className="font-bold text-foreground">Ayoola Property Sourcing</div>
                                <div className="text-sm text-muted-foreground">Official Partner</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RelatedProperties location={property.location} currentId={property.id} />
        </main>
    );
}

async function RelatedProperties({ location, currentId }: { location: string; currentId: string }) {
    const similarProperties = await prisma.property.findMany({
        where: {
            location: { contains: location, mode: 'insensitive' },
            id: { not: currentId },
            status: 'AVAILABLE'
        },
        take: 3,
        orderBy: { createdAt: 'desc' }
    });

    if (similarProperties.length === 0) return null;

    return (
        <div className="bg-muted/30 py-20 border-t border-border mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <span className="text-accent font-semibold tracking-wider text-sm uppercase px-3 py-1 bg-accent/10 rounded-full mb-3 inline-block">Recommendations</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">Similar Properties</h2>
                        <p className="text-muted-foreground mt-2">Discover more listings in {location}</p>
                    </div>
                    <Link href="/properties" className="text-primary font-bold hover:text-accent transition-colors flex items-center gap-2">
                        View All Properties <ArrowLeft size={16} className="rotate-180" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {similarProperties.map((p) => (
                        <Link href={`/properties/${p.id}`} key={p.id} className="group block">
                            <article className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-border h-full flex flex-col">
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={(p.images && p.images.length > 0 && (p.images[0].startsWith('http') || p.images[0].startsWith('/')))
                                            ? p.images[0]
                                            : "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2070&auto=format&fit=crop"}
                                        alt={p.title}
                                        fill
                                        className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute bottom-4 left-4 text-white z-10">
                                        <p className="text-xl font-bold bg-primary/40 backdrop-blur-md px-3 py-1 rounded-lg">
                                            ₦{p.price.toLocaleString()}<span className="text-xs font-normal opacity-80">/yr</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-primary mb-2 line-clamp-1 group-hover:text-accent transition-colors">{p.title}</h3>
                                    <div className="flex items-center text-muted-foreground text-xs mb-4">
                                        <MapPin size={14} className="mr-1 text-accent" />
                                        {p.location}
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-border/60">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><BedDouble size={14} /> {p.bedrooms || 0}</span>
                                            <span className="flex items-center gap-1"><Bath size={14} /> {p.bathrooms || 0}</span>
                                            <span className="flex items-center gap-1"><Maximize size={14} /> {p.sqft?.toLocaleString() || 0}</span>
                                        </div>
                                        <span className="text-xs font-bold text-primary">Details</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
