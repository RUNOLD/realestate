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
                        Our Expertise
                    </h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl font-light">
                        Comprehensive solutions for every stage of your real estate journey. From breaking ground to handing over keys.
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
                            Maximize your ROI without the headache. We handle the day-to-day operations of your asset, ensuring high occupancy rates and satisfied tenants.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>Tenant screening and placement</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>Rent collection and financial reporting</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>Routine maintenance and emergency repairs</span>
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
                            Finding the right investment requires local knowledge and due diligence. We scour the market to find land and properties that match your financial goals.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>Off-market opportunities</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>Legal verification and title search</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>Negotiation and closing support</span>
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
                            Quality construction starts with quality materials. We source and deliver authentic building supplies directly to your site, eliminating the risk of substandard products.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>Direct-from-manufacturer pricing</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>Logistics and site delivery</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                <span>Quality assurance checks</span>
                            </li>
                        </ul>
                        <Link href="/contact" className="text-primary font-semibold hover:text-accent inline-flex items-center group">
                            Order Materials <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">How We Work</h2>
                        <p className="text-slate-600">
                            Transparent, efficient, and tailored to your needs. Here is what to expect when you partner with Ayoola.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Consultation", desc: "We discuss your goals, budget, and specific requirements." },
                            { step: "02", title: "Strategy", desc: "We design a tailored plan, whether it's sourcing a property or managing one." },
                            { step: "03", title: "Execution", desc: "Our team goes to work, handling logistics, negotiations, and operations." },
                            { step: "04", title: "Reporting", desc: "You receive detailed updates and transparent reports on progress." }
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
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Need a Custom Solution?</h2>
                    <p className="text-primary-foreground/80 dark:text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
                        Every real estate journey is unique. Contact us today to discuss your specific project requirements.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-slate-900 shadow hover:bg-slate-100 transition-colors"
                        >
                            <Phone className="mr-2 h-4 w-4" /> Book a Consultation
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
