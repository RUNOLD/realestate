import Link from "next/link";
import { Users, Target, ShieldCheck, ArrowRight, Building2, BarChart3, CheckCircle2, Zap, Cpu } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-background font-sans text-slate-900 dark:text-foreground selection:bg-accent selection:text-white">

            {/* 1. Modern Hero Section with Background Image */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"
                        alt="Modern Architecture"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm">
                        Experience since 2010
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                        Managing Value, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">
                            Building Trust
                        </span>
                    </h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-light">
                        Ayoola Property Management & Sourcing Services LTD builds on over a decade of hands on real estate experience, delivering professional property management and sourcing solutions designed to protect value and build long term trust.
                    </p>
                </div>
            </div>

            {/* 2. Stats Strip - High Level Trust Signals */}
            <div className="relative z-20 -mt-16 container mx-auto px-4">
                <div className="bg-white dark:bg-card rounded-xl shadow-xl border border-slate-100 dark:border-border p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100 dark:divide-border">
                    <div>
                        <p className="text-4xl font-bold text-primary mb-1">200+</p>
                        <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Properties Managed</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-primary mb-1">98%</p>
                        <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Occupancy Rate</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-primary mb-1">15+</p>
                        <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Years Experience</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-primary mb-1">9-5</p>
                        <p className="text-sm text-slate-500 dark:text-muted-foreground uppercase tracking-wider font-semibold">Support Team</p>
                    </div>
                </div>
            </div>

            {/* 3. Our Story / "Who We Are" Split Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image Composition */}
                    <div className="relative">
                        <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"
                                alt="Meeting in office"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 bg-white dark:bg-card p-6 rounded-xl shadow-xl border border-slate-100 dark:border-border max-w-xs">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-green-100/10 rounded-full text-green-600">
                                    <CheckCircle2 size={24} />
                                </div>
                                <span className="font-bold text-slate-900 dark:text-foreground">Certified Experts</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                                Fully licensed and accredited property management professionals.
                            </p>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div>
                        <h2 className="text-accent font-semibold tracking-wide uppercase mb-3 text-sm">Our Story</h2>
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-foreground mb-6 leading-tight">
                            Built on experience, designed for modern property management
                        </h3>
                        <div className="space-y-6 text-slate-600 dark:text-muted-foreground text-lg leading-relaxed">
                            <p>
                                Ayoola Property Management & Sourcing Services LTD was incorporated in 2025, building on over a decade of hands-on real estate experience. The company was established to deliver structured, professional, and technology-driven property management, development, and sourcing services. Ayoola Property Management & Sourcing Services LTD was incorporated in 2025, building on over a decade of hands-on real estate experience. The company was established to deliver structured, professional, and technology-driven property management, development, and sourcing services.
                            </p>
                            <p>
                                Drawing from years of practical industry experience, we understand that clients need more than an agent; they need reliable partners. From property sourcing and materials supply to tenant coordination and ongoing movement, we handle the complexities so our clients can focus on results.
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-border">
                            <Link
                                href="/services"
                                className="inline-flex items-center text-primary font-bold hover:text-accent transition-colors group"
                            >
                                Explore our Services
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Core Values (Cards) */}
            <section className="bg-slate-50 dark:bg-muted/5 py-24 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-foreground mb-4">Our Core Values</h2>
                        <p className="text-slate-600 dark:text-muted-foreground text-lg">
                            The principles that guide our decisions and the way we manage every property entrusted to us.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white dark:bg-card p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-border hover:shadow-md transition-shadow duration-300">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Target size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-foreground mb-3">Mission Driven</h3>
                            <p className="text-slate-600 dark:text-muted-foreground leading-relaxed">
                                To deliver structured, end-to-end real estate services that help our clients manage property effectively and achieve their objectives.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white dark:bg-card p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-border hover:shadow-md transition-shadow duration-300">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-foreground mb-3">Integrity First</h3>
                            <p className="text-slate-600 dark:text-muted-foreground leading-relaxed">
                                We operate with honesty, transparency and accountability in every interaction and transaction.
                            </p>
                        </div>

                        {/* Card 3: Operational Excellence */}
                        <div className="bg-white dark:bg-card p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-border hover:shadow-md transition-shadow duration-300">
                            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-foreground mb-3">Operational Excellence</h3>
                            <p className="text-slate-600 dark:text-muted-foreground leading-relaxed">
                                We focus on efficiency, consistency and high standards across our services.
                            </p>
                        </div>

                        {/* Card 4: Technology Enabled */}
                        <div className="bg-white dark:bg-card p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-border hover:shadow-md transition-shadow duration-300">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Cpu size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-foreground mb-3">Technology Enabled</h3>
                            <p className="text-slate-600 dark:text-muted-foreground leading-relaxed">
                                We leverage modern systems to improve transparency, communication and service delivery.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white dark:bg-card p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-border hover:shadow-md transition-shadow duration-300">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <Users size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-foreground mb-3">Client Centric</h3>
                            <p className="text-slate-600 dark:text-muted-foreground leading-relaxed">
                                We take a client focused approach, tailoring our services to meet individual needs, whether you are a tenant, landlord or investor
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Team Section Placeholder */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-foreground mb-4">Meet Our Team</h2>
                    <p className="text-slate-600 dark:text-muted-foreground text-lg">
                        A team of professionals committed to delivering reliable and well structured real estate services.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="group relative overflow-hidden rounded-2xl shadow-lg">
                            <div className="aspect-[4/5] bg-slate-200 relative">
                                {/* Placeholder for team image */}
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                    <Users size={48} className="opacity-50" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                                <h3 className="text-white font-bold text-lg">Team Member {item}</h3>
                                <p className="text-slate-300 text-sm">Position Title</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
