import { prisma } from "@/lib/prisma";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, MapPin, CheckCircle, Phone, Mail } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function PropertyDetailPage({ params }: PageProps) {
    // Await params first (Next.js 15 requirement, good practice generally)
    const { id } = await params;

    const property = await prisma.property.findUnique({
        where: { id }
    });

    if (!property) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background">


            {/* Hero Image Section */}
            <div className="relative h-[50vh] bg-gray-900">
                <img
                    src={property.images && property.images.length > 5 ? property.images : "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2070&auto=format&fit=crop"}
                    alt={property.title}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 max-w-7xl mx-auto">
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
                            <div className="text-3xl font-bold text-white mb-1">₦{property.price.toLocaleString()}</div>
                            <div className="text-gray-300">{property.type}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-serif font-bold text-primary mb-4 p-b-2 border-b border-border inline-block">Description</h2>
                            <div className="prose prose-lg text-muted-foreground whitespace-pre-wrap">
                                {property.description}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold text-primary mb-6">Key Features</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Placeholder features as we don't have a structured JSON column yet fully implemented in UI */}
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
                                <Button className="w-full gap-2" variant="luxury" size="lg">
                                    <Phone size={18} /> Call Agent
                                </Button>
                                <Button className="w-full gap-2" variant="outline" size="lg">
                                    <Mail size={18} /> Send Message
                                </Button>
                            </div>

                            <hr className="my-6 border-border" />

                            <div className="text-center">
                                <img
                                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop"
                                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                                    alt="Agent"
                                />
                                <div className="font-bold text-foreground">Ayoola Property Sourcing</div>
                                <div className="text-sm text-muted-foreground">Official Partner</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
