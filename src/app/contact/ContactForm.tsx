'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { useActionState } from 'react';
import { submitContact } from '@/actions/misc';
import { useSearchParams } from "next/navigation";

export function ContactForm() {
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
