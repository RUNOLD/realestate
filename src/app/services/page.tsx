import Link from "next/link";
import {
    Building2,
    Search,
    Truck,
    Hammer,
    CheckCircle2,
    ArrowRight,
    Phone
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-background font-sans text-slate-900 dark:text-foreground selection:bg-accent selection:text-white">

            {/* 1. Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=2670&auto=format&fit=crop"
                        alt="Construction and Real Estate"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                        Our Services
                    </h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl font-light">
                        Professional real estate services covering property sourcing, management, sales, development support and tenant coordination. We are designed to support property owners, investors and tenants.
                    </p>
                </div>
            </div>

            {/* 2. Main Services - Alternating Layout */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 container mx-auto space-y-24">

                {/* Service 1: Property Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <Building2 size={24} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-foreground mb-4">Property Management</h2>
                        <p className="text-slate-600 dark:text-muted-foreground text-lg leading-relaxed mb-6">
                            Professional management of residential and commercial properties focused on protecting your asset, optimizing returns and ensuring smooth day-to-day operations.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>TENANT SCREENING AND PLACEMENT</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>RENT COLLECTION AND FINANCIAL REPORTING</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>ROUTINE MAINTENANCE AND EMERGENCY REPAIRS</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>PROPERTY INSPECTIONS</span>
                            </li>
                        </ul>
                        <Link href="/contact" className="text-primary font-semibold hover:text-accent inline-flex items-center group">
                            Request Management Proposal <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="order-1 lg:order-2 h-[400px] rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2573&auto=format&fit=crop"
                            alt="Property Management"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>

                {/* Service 2: Property Sourcing */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="order-1 h-[400px] rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2696&auto=format&fit=crop"
                            alt="Real Estate Deal"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="order-2">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                            <Search size={24} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-foreground mb-4">Property Sourcing</h2>
                        <p className="text-slate-600 dark:text-muted-foreground text-lg leading-relaxed mb-6">
                            Sourcing the right property requires strong local knowledge and thorough due diligence. We identify land and properties that align with your investment objectives and risk profile.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>OFF-MARKET OPPORTUNITIES</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>LEGAL VERIFICATION AND TITLE SEARCH</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>NEGOTIATION AND CLOSING SUPPORT</span>
                            </li>
                        </ul>
                        <Link href="/contact" className="text-primary font-semibold hover:text-accent inline-flex items-center group">
                            Start Your Search <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Service 3: Building Materials & Logistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                            <Truck size={24} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-foreground mb-4">Building Materials Supply</h2>
                        <p className="text-slate-600 dark:text-muted-foreground text-lg leading-relaxed mb-6">
                            We source and supply quality construction materials for building and renovation projects, ensuring reliability, proper specifications and timely site delivery.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>DIRECT-FROM-MANUFACTURER PRICING</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>LOGISTICS AND SITE DELIVERY</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>QUALITY ASSURANCE CHECKS</span>
                            </li>
                        </ul>
                        <Link href="/contact" className="text-primary font-semibold hover:text-accent inline-flex items-center group">
                            Request Materials Supply <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="order-1 lg:order-2 h-[400px] rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2670&auto=format&fit=crop"
                            alt="Construction Materials"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* 3. The Process Section */}
            <section className="bg-slate-50 dark:bg-muted/5 py-24 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">How We Deliver Our Services</h2>
                        <p className="text-slate-600">
                            A clear, transparent and efficient process designed to deliver the right outcomes for our clients.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Consultation", desc: "We take time to understand your objectives, budget and property requirements." },
                            { step: "02", title: "Strategy & planning", desc: "We develop a structured plan aligned with your goals, whether for property sourcing, management or development support." },
                            { step: "03", title: "Execution", desc: "We implement the agreed strategy, managing coordination, negotiations and day-to-day operations." },
                            { step: "04", title: "Reporting & Updates", desc: "We provide regular updates and clear reporting, keeping you informed at every stage." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-card p-8 rounded-xl border border-slate-100 dark:border-border shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <span className="text-6xl font-bold text-slate-100 dark:text-muted/10 absolute -top-4 -right-4 select-none group-hover:text-accent/10 transition-colors">
                                    {item.step}
                                </span>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-primary dark:text-foreground mb-3">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. CTA Section */}
            <section className="py-20 bg-primary dark:bg-card text-white dark:text-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Need a Tailored Property Solution?</h2>
                    <p className="text-primary-foreground/80 dark:text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
                        Every property requirement is different, speak with our team to discuss a solution tailored to your needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-slate-900 shadow hover:bg-slate-100 transition-colors"
                        >
                            <Phone className="mr-2 h-4 w-4" /> Schedule a Consultation
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
