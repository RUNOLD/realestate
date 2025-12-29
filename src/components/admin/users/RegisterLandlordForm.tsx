'use client';

import { useActionState, useState } from 'react';
import { Button } from "@/components/ui/button";
import { createLandlord } from "@/actions/user";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RegisterLandlordForm() {
    const [state, action, isPending] = useActionState(createLandlord, null);
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

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
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg animate-in fade-in slide-in-from-top-2">{state.error}</div>
            )}
            {state?.success && (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg border border-green-200 animate-in fade-in text-center font-bold">
                    {state.message}
                </div>
            )}

            {/* STEP 1: BASIC ACCOUNT */}
            {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-primary/10 text-primary h-8 w-8 rounded flex items-center justify-center text-sm">1</span>
                            Account Information
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">Create the login credentials for the Landlord.</p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name (Legal Name) *</Label>
                                <Input name="name" required placeholder="Surname Firstname Middle" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address *</Label>
                                <Input name="email" type="email" required placeholder="landlord@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number *</Label>
                                <Input name="phone" required placeholder="+234..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Initial Password *</Label>
                                <Input name="password" type="password" required placeholder="******" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: PROFILE & IDENTITY */}
            {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
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
                            </div>
                            <div className="space-y-2">
                                <Label>Residential Address</Label>
                                <Input name="residentialAddress" placeholder="Where do they live?" />
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
                            </div>
                            <div className="space-y-2">
                                <Label>ID Number</Label>
                                <Input name="idNumber" placeholder="Enter ID Number securely" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: AUTHORITY & RELATIONSHIP */}
            {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
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
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: FINANCIALS & CONSENT */}
            {step === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-xl font-bold mb-4">Payment & Preferences</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Preferred Bank</Label>
                                <Input name="bankName" placeholder="Bank Name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Account Name</Label>
                                <Input name="accountName" placeholder="Account Name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Account Number</Label>
                                <Input name="accountNumber" placeholder="0123456789" />
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
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-yellow-200 bg-yellow-50/50">
                        <h3 className="text-xl font-bold mb-4 text-yellow-900">Legal Consent</h3>
                        <div className="flex items-start space-x-2 py-4">
                            <Checkbox id="consent" name="isConsentGiven" value="true" required className="mt-1" />
                            <Label htmlFor="consent" className="text-sm font-medium leading-relaxed text-yellow-950">
                                I confirm that this individual/entity has explicitly authorized Ayoola Property Management & Sourcing Company Ltd
                                to manage their properties. I understand that false representation of authority is a legal offence.
                            </Label>
                        </div>
                    </div>
                </div>
            )}

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
