'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Phone,
    Mail,
    MapPin,
    MessageSquare,
    Clock,
    ArrowRight,
    CheckCircle2
} from "lucide-react";
import { useActionState, Suspense } from 'react';
import { submitContact } from '@/actions/misc';
import { useSearchParams } from "next/navigation";

function ContactForm() {
    const [state, dispatch, isPending] = useActionState(submitContact, null);
    const searchParams = useSearchParams();
    const subjectParam = searchParams.get('subject');

    // If coming from a property, pre-fill context
    const defaultSubject = subjectParam ? "Property Inquiry" : "Property Inquiry";
    const defaultMessage = subjectParam
        ? `${subjectParam}. I would like more information/to schedule a viewing.`
        : "";

    return (
        <form action={dispatch} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 dark:text-foreground">Full Name</label>
                    <Input name="name" placeholder="John Doe" className="bg-muted/10 dark:bg-muted/20 border-input dark:border-border h-12" required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 dark:text-foreground">Email Address</label>
                    <Input name="email" type="email" placeholder="john@example.com" className="bg-muted/10 dark:bg-muted/20 border-input dark:border-border h-12" required />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 dark:text-foreground">Phone Number</label>
                    <Input name="phone" placeholder="+234..." className="bg-muted/10 dark:bg-muted/20 border-input dark:border-border h-12" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 dark:text-foreground">I'm interested in...</label>
                    <select
                        name="subject"
                        defaultValue={defaultSubject}
                        className="flex h-12 w-full rounded-md border border-input dark:border-border bg-muted/10 dark:bg-muted/20 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option>Property Inquiry</option>
                        <option>Schedule Inspection</option>
                        <option>Property Management</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80 dark:text-foreground">Your Message</label>
                <textarea
                    name="message"
                    rows={5}
                    defaultValue={defaultMessage}
                    className="w-full p-4 bg-muted/10 dark:bg-muted/20 border border-input dark:border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="Tell us about your property needs..."
                    required
                />
            </div>

            {state?.error && (
                <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-md flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                        {typeof state.error === 'string' ? (
                            state.error
                        ) : (
                            <span>Please check the form for errors.</span>
                        )}
                    </div>
                    {typeof state.error !== 'string' && (
                        <ul className="list-disc list-inside pl-4 text-xs">
                            {Object.entries(state.error).map(([key, messages]) => (
                                <li key={key}>
                                    <span className="capitalize">{key}:</span> {(messages as string[]).join(", ")}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {state?.success && (
                <div className="text-green-700 text-sm font-medium bg-green-50 p-3 rounded-md flex items-center gap-2">
                    <CheckCircle2 size={16} /> Message sent successfully! We'll allow 24h for a response.
                </div>
            )}

            <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all" disabled={isPending}>
                {isPending ? 'Processing...' : 'Send Message'}
            </Button>
        </form>
    );
}

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-muted/20 dark:bg-background font-sans">
            {/* 1. Trust-Building Hero Section */}
            <div className="bg-primary text-primary-foreground dark:bg-card dark:text-foreground relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pattern-grid-lg"></div>
                <div className="max-w-4xl mx-auto text-center py-24 px-4 relative z-10">
                    <span className="text-accent font-bold tracking-wider uppercase text-sm mb-2 block">
                        We are here to help
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-primary-foreground dark:text-foreground">
                        Let's Start a Conversation
                    </h1>
                    <p className="text-lg md:text-xl text-primary-foreground/80 dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Whether you are looking to buy, rent, or need property management advice,
                        our team is ready to guide you through every step.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
                <div className="grid lg:grid-cols-12 gap-8">

                    {/* 2. Enhanced Contact Info & Quick Actions (Left Side) */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Quick Contact Card */}
                        <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-xl border border-border dark:bg-card/50">
                            <h2 className="text-2xl font-bold text-primary dark:text-foreground mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors group">
                                    <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary dark:text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base">Call Us Directly</h3>
                                        <p className="text-muted-foreground text-sm mb-1">Mon-Fri from 8am to 6pm</p>
                                        <a href="tel:+2348050758674" className="block text-lg font-bold hover:text-accent transition-colors">+234 805 075 8674</a>
                                        <a href="tel:+2348033824750" className="block text-lg font-bold hover:text-accent transition-colors">+234 803 382 4750</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors group">
                                    <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary dark:text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base">Email Support</h3>
                                        <p className="text-muted-foreground text-sm mb-1">We respond within 24 hours</p>
                                        <a href="mailto:info@ayoolaproperty.com" className="block font-medium hover:text-accent transition-colors">info@ayoolaproperty.com</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors group">
                                    <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary dark:text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base">Visit Our Office</h3>
                                        <p className="text-muted-foreground text-sm">
                                            123 Luxury Lane, Victoria Island,<br />
                                            Lagos, Nigeria
                                        </p>
                                        <a href="#" className="text-sm text-accent font-semibold mt-2 inline-flex items-center hover:underline">
                                            Get Directions <ArrowRight size={14} className="ml-1" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp CTA */}
                        <a href="https://wa.me/2348050758674?text=Hello%20Ayoola%20Property%2C%20I%20would%20like%20to%20make%20an%20inquiry%20regarding%20your%20services." target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white p-6 rounded-2xl shadow-lg flex items-center justify-between hover:bg-[#20bd5a] transition-colors cursor-pointer block">
                            <div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <MessageSquare size={20} /> Chat on WhatsApp
                                </h3>
                                <p className="text-white/90 text-sm">Fastest way to reach an agent.</p>
                            </div>
                            <Button variant="ghost" className="bg-white/20 text-white hover:bg-white/30">
                                Chat Now
                            </Button>
                        </a>
                    </div>

                    {/* 3. Streamlined Form (Right Side) */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-card p-8 md:p-10 rounded-2xl shadow-xl border border-border h-full">
                            <h2 className="text-2xl font-bold text-primary dark:text-foreground mb-2">Send us a Message</h2>
                            <p className="text-muted-foreground mb-8">Fill out the form below and an agent will be in touch shortly.</p>

                            <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading form...</div>}>
                                <ContactForm />
                            </Suspense>
                        </div>
                    </div>
                </div>

                {/* 4. FAQ Section */}
                <div className="mt-20 max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-primary dark:text-foreground mb-8">Frequently Asked Questions</h2>
                    <div className="grid md:grid-cols-2 gap-6 text-left">
                        <div className="bg-white dark:bg-card p-6 rounded-xl border border-border shadow-sm">
                            <h4 className="font-bold mb-2 flex items-center gap-2 text-foreground"><Clock size={16} className="text-accent" /> What are your inspection times?</h4>
                            <p className="text-sm text-muted-foreground">Inspections are typically scheduled between 9 AM and 5 PM, Monday through Saturday. Special arrangements can be made for Sundays.</p>
                        </div>
                        <div className="bg-white dark:bg-card p-6 rounded-xl border border-border shadow-sm">
                            <h4 className="font-bold mb-2 flex items-center gap-2 text-foreground"><MapPin size={16} className="text-accent" /> Do you cover areas outside Lagos?</h4>
                            <p className="text-sm text-muted-foreground">Our primary focus is Lagos Island and Mainland, but we handle select premium properties in Abuja and Port Harcourt.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
