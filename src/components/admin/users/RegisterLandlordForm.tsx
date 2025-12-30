'use client';

import { useActionState, useState } from "react";
import { createLandlord } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft, User, Shield, Building } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const initialState = {
    message: "",
    error: "",
    success: false,
    details: {}
};

export default function RegisterLandlordForm() {
    const [state, formAction, isPending] = useActionState(createLandlord, initialState);
    const [step, setStep] = useState(1);

    // Form Steps:
    // 1. Account Info (Name, Email, Phone, Password)
    // 2. Profile & Identity (Address, Type, ID, Relationship, Consent)
    // 3. Financials (Bank Details)

    const nextStep = (e: React.MouseEvent) => {
        e.preventDefault();
        setStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = (e: React.MouseEvent) => {
        e.preventDefault();
        setStep(prev => Math.max(prev - 1, 1));
    };

    return (
        <Card className="w-full max-w-2xl mx-auto border-border shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-2xl">
                    {step === 1 && <User className="h-6 w-6 text-primary" />}
                    {step === 2 && <Shield className="h-6 w-6 text-primary" />}
                    {step === 3 && <Building className="h-6 w-6 text-primary" />}
                    Register New Landlord
                </CardTitle>
                <CardDescription>
                    Step {step} of 3: {step === 1 ? "Account Details" : step === 2 ? "Identity & Authority" : "Financial Information"}
                </CardDescription>

                {/* Progress Indicator */}
                <div className="flex gap-2 mt-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={cn("h-1 flex-1 rounded-full transition-all duration-300", step >= s ? "bg-primary" : "bg-muted/30")} />
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-6">
                    {state?.error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20 mb-4">
                            {state.error}
                        </div>
                    )}
                    {state?.success && (
                        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md border border-green-200 mb-4 flex items-center gap-2">
                            <CheckCircle2 size={16} /> {state.message}
                        </div>
                    )}

                    {/* STEP 1: ACCOUNT */}
                    <div className={cn("space-y-4", step !== 1 && "hidden")}>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" name="name" placeholder="John Doe" required={step === 1} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input id="email" name="email" type="email" placeholder="john@example.com" required={step === 1} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input id="phone" name="phone" type="tel" placeholder="+234..." required={step === 1} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Initial Password *</Label>
                            <Input id="password" name="password" type="password" required={step === 1} minLength={6} />
                            <p className="text-[10px] text-muted-foreground">Must be at least 6 characters.</p>
                        </div>
                    </div>

                    {/* STEP 2: PROFILE */}
                    <div className={cn("space-y-4", step !== 2 && "hidden")}>
                        <div className="grid gap-2">
                            <Label htmlFor="residentialAddress">Residential Address</Label>
                            <Textarea id="residentialAddress" name="residentialAddress" placeholder="123 Street..." />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="landlordType">Landlord Type</Label>
                                <Select name="landlordType" defaultValue="INDIVIDUAL">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                                        <SelectItem value="COMPANY">Company / Corporate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="relationshipToProperty">Relationship to Property *</Label>
                                <Select name="relationshipToProperty" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="OWNER">Owner</SelectItem>
                                        <SelectItem value="FAMILY_REP">Family Representative</SelectItem>
                                        <SelectItem value="ATTORNEY">Attorney / Legal Rep</SelectItem>
                                        <SelectItem value="AGENT">Agent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="idType">ID Type</Label>
                                <Select name="idType">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select ID" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NIN">NIN</SelectItem>
                                        <SelectItem value="PASSPORT">Intl. Passport</SelectItem>
                                        <SelectItem value="DRIVERS_LICENSE">Driver's License</SelectItem>
                                        <SelectItem value="VOTERS_CARD">Voter's Card</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="idNumber">ID Number</Label>
                                <Input id="idNumber" name="idNumber" placeholder="ID Number" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="preferredContactMethod">Preferred Contact</Label>
                            <Select name="preferredContactMethod">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                                    <SelectItem value="EMAIL">Email</SelectItem>
                                    <SelectItem value="PHONE">Phone Call</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-start space-x-2 border p-3 rounded-md bg-muted/10">
                            <Checkbox id="consent" name="isConsentGiven" value="true" required />
                            <Label htmlFor="consent" className="text-xs leading-normal font-normal">
                                I confirm that the individual listed is authorized to manage properties and I allow Ayoola Property Management to act on their behalf as per the service agreement.
                            </Label>
                        </div>
                    </div>

                    {/* STEP 3: FINANCIALS */}
                    <div className={cn("space-y-4", step !== 3 && "hidden")}>
                        <div className="grid gap-2">
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input id="bankName" name="bankName" placeholder="e.g. GTBank" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input id="accountNumber" name="accountNumber" placeholder="0123456789" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="accountName">Account Name</Label>
                                <Input id="accountName" name="accountName" placeholder="Account Name" />
                            </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-md border border-yellow-100 dark:border-yellow-900/20 text-xs text-yellow-800 dark:text-yellow-400 mt-4">
                            <strong>Note:</strong> Sensitive details like bank info can only be edited by Admins after creation. Ensure accuracy.
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        {step > 1 ? (
                            <Button type="button" variant="outline" onClick={prevStep}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                        ) : (
                            <div /> /* Spacer */
                        )}

                        {step < 3 ? (
                            <Button type="button" onClick={nextStep} className="bg-primary text-primary-foreground">
                                Next Step <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                Register Landlord
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
