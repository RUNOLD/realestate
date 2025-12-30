'use client';

import { useActionState, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { createLandlord } from "@/actions/user";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function FieldError({ errors, name }: { errors?: Record<string, string[]>, name: string }) {
    if (!errors?.[name]) return null;
    return <p className="text-sm text-destructive mt-1 font-medium">{errors[name][0]}</p>;
}

export function RegisterLandlordForm() {
    const [state, action, isPending] = useActionState(createLandlord, null);
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    // Auto-reset form on success after short delay effectively clearing stale state logic
    useEffect(() => {
        if (state?.success) {
            setStep(1);
            // Optional: You could physically reset the form inputs here if referencing a ref, 
            // but since useActionState drives it, a refresh or key change is often best for full reset.
        }
    }, [state?.success]);

    return (
        <form action={action} className="space-y-8 pb-20">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8 px-2">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`flex items-center ${s < 4 ? 'flex-1' : ''}`}>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 
                            ${step === s ? 'border-primary bg-primary text-white' :
                                step > s ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-400'}`}>
                            {step > s ? <CheckCircle size={16} /> : s}
                        </div>
                        {s < 4 && <div className={`h-1 w-full mx-2 ${step > s ? 'bg-primary' : 'bg-gray-100'}`} />}
                    </div>
                ))}
            </div>

            {/* Error Display */}
            {state?.error && typeof state.error === 'string' && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
                    {state.error}
                    {state.details && <p className="text-sm mt-1 opacity-90">Please check the highlighted fields below.</p>}
                </div>
            )}
            {state?.success && (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg border border-green-200 animate-in fade-in text-center font-bold relative">
                    {state.message}
                    <button type="button" onClick={() => window.location.reload()} className="absolute top-2 right-2 text-green-800 hover:text-green-900">
                        Create Another
                    </button>
                    <p className="text-xs font-normal mt-2">The form has been reset for the next entry.</p>
                </div>
            )}

            {/* STEP 1: BASIC ACCOUNT */}
            <div className={step === 1 ? "space-y-6 animate-in slide-in-from-right-4 duration-300" : "hidden"}>
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary h-8 w-8 rounded flex items-center justify-center text-sm">1</span>
                        Account Information
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">Create the login credentials for the Landlord.</p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full Name (Legal Name) *</Label>
                            <Input name="name" placeholder="Surname Firstname Middle" />
                            <FieldError errors={state?.details} name="name" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address *</Label>
                            <Input name="email" type="email" placeholder="landlord@example.com" />
                            <FieldError errors={state?.details} name="email" />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number *</Label>
                            <Input name="phone" placeholder="+234..." />
                            <FieldError errors={state?.details} name="phone" />
                        </div>
                        <div className="space-y-2">
                            <Label>Initial Password *</Label>
                            <Input name="password" type="password" placeholder="******" />
                            <FieldError errors={state?.details} name="password" />
                        </div>
                    </div>
                </div>
            </div>

            {/* STEP 2: PROFILE & IDENTITY */}
            <div className={step === 2 ? "space-y-6 animate-in slide-in-from-right-4 duration-300" : "hidden"}>
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Identity & Profile</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Landlord Type</Label>
                            <Select name="landlordType">
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Individual">Individual</SelectItem>
                                    <SelectItem value="Company">Company / Corporate Entity</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError errors={state?.details} name="landlordType" />
                        </div>
                        <div className="space-y-2">
                            <Label>Residential Address</Label>
                            <Input name="residentialAddress" placeholder="Where do they live?" />
                            <FieldError errors={state?.details} name="residentialAddress" />
                        </div>
                        <div className="space-y-2">
                            <Label>ID Type</Label>
                            <Select name="idType">
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NIN">National ID (NIN)</SelectItem>
                                    <SelectItem value="Passport">International Passport</SelectItem>
                                    <SelectItem value="DriversLicense">Driver's License</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError errors={state?.details} name="idType" />
                        </div>
                        <div className="space-y-2">
                            <Label>ID Number</Label>
                            <Input name="idNumber" placeholder="Enter ID Number securely" />
                            <FieldError errors={state?.details} name="idNumber" />
                        </div>
                    </div>
                </div>
            </div>

            {/* STEP 3: AUTHORITY & RELATIONSHIP */}
            <div className={step === 3 ? "space-y-6 animate-in slide-in-from-right-4 duration-300" : "hidden"}>
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Authority & Relationship</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Relationship to Property</Label>
                            <Select name="relationshipToProperty">
                                <SelectTrigger><SelectValue placeholder="Select Relationship" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Owner">Owner</SelectItem>
                                    <SelectItem value="Attorney">Attorney / Legal Rep</SelectItem>
                                    <SelectItem value="FamilyRepresentative">Family Representative</SelectItem>
                                    <SelectItem value="Agent">Managing Agent</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">This defines their legal standing regarding the properties.</p>
                            <FieldError errors={state?.details} name="relationshipToProperty" />
                        </div>
                    </div>
                </div>
            </div>

            {/* STEP 4: FINANCIALS & CONSENT */}
            <div className={step === 4 ? "space-y-6 animate-in slide-in-from-right-4 duration-300" : "hidden"}>
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Payment & Preferences</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Preferred Bank</Label>
                            <Input name="bankName" placeholder="Bank Name" />
                            <FieldError errors={state?.details} name="bankName" />
                        </div>
                        <div className="space-y-2">
                            <Label>Account Name</Label>
                            <Input name="accountName" placeholder="Account Name" />
                            <FieldError errors={state?.details} name="accountName" />
                        </div>
                        <div className="space-y-2">
                            <Label>Account Number</Label>
                            <Input name="accountNumber" placeholder="0123456789" />
                            <FieldError errors={state?.details} name="accountNumber" />
                        </div>
                        <div className="space-y-2">
                            <Label>Preferred Contact Method</Label>
                            <Select name="preferredContactMethod">
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                                    <SelectItem value="Phone">Phone Call</SelectItem>
                                    <SelectItem value="Email">Email</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError errors={state?.details} name="preferredContactMethod" />
                        </div>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-yellow-200 bg-yellow-50/50">
                    <h3 className="text-xl font-bold mb-4 text-yellow-900">Legal Consent</h3>
                    <div className="flex items-start space-x-2 py-4">
                        <Checkbox id="consent" name="isConsentGiven" value="true" className="mt-1" />
                        <Label htmlFor="consent" className="text-sm font-medium leading-relaxed text-yellow-950">
                            I confirm that this individual/entity has explicitly authorized Ayoola Property Management & Sourcing Company Ltd
                            to manage their properties. I understand that false representation of authority is a legal offence.
                        </Label>
                    </div>
                    <FieldError errors={state?.details} name="isConsentGiven" />
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-10 md:pl-72">
                <div className="max-w-4xl mx-auto flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>

                    {step < 4 ? (
                        <Button type="button" onClick={nextStep}>
                            Next Step <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90">
                            {isPending ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Create Landlord Profile
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
}
