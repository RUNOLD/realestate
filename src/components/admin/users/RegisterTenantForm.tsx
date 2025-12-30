'use client';

import { useActionState, useState } from 'react';
import { Button } from "@/components/ui/button";
import { createTenant } from "@/actions/user";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { NIGERIA_STATES_AND_LGAS } from '@/lib/nigeria-data';

export function RegisterTenantForm() {
    const [state, action, isPending] = useActionState(createTenant, null);
    const [step, setStep] = useState(1);

    // We need some local state to handle conditional renders (like Corporate)
    const [isCorporate, setIsCorporate] = useState(false);
    const [selectedState, setSelectedState] = useState<string>("");
    const [guarantors, setGuarantors] = useState([{ name: '', phone: '', address: '', occupation: '', placeOfWork: '' }, { name: '', phone: '', address: '', occupation: '', placeOfWork: '' }]);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const updateGuarantor = (index: number, field: string, value: string) => {
        const newG = [...guarantors];
        newG[index] = { ...newG[index], [field]: value };
        setGuarantors(newG);
    };

    return (
        <form action={action} className="space-y-8 pb-20">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8 px-2">
                {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className={`flex items-center ${s < 5 ? 'flex-1' : ''}`}>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 
                            ${step === s ? 'border-primary bg-primary text-white' :
                                step > s ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-400'}`}>
                            {step > s ? <CheckCircle size={16} /> : s}
                        </div>
                        {s < 5 && <div className={`h-1 w-full mx-2 ${step > s ? 'bg-primary' : 'bg-gray-100'}`} />}
                    </div>
                ))}
            </div>

            {/* Error Display */}
            {state?.error && typeof state.error === 'string' && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg">{state.error}</div>
            )}

            {/* STEP 1: ACCOUNT & PERSONAL */}
            {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-primary/10 text-primary h-8 w-8 rounded flex items-center justify-center text-sm">1</span>
                            Account Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name *</Label>
                                <Input name="name" required placeholder="Surname Firstname Middle" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address *</Label>
                                <Input name="email" type="email" required placeholder="email@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number (WhatsApp) *</Label>
                                <Input name="phone" required placeholder="+234..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Initial Password *</Label>
                                <Input name="password" type="password" required placeholder="******" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Profile Picture *</Label>
                                <Input name="image" type="file" accept="image/*" required className="cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-xl font-bold mb-4">Personal Details</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nationality</Label>
                                <Input
                                    name="nationality"
                                    list="nationality-options"
                                    placeholder="Select or Type Nationality"
                                />
                                <datalist id="nationality-options">
                                    <option value="Nigerian" />
                                    <option value="British" />
                                    <option value="American" />
                                    <option value="Canadian" />
                                    <option value="Ghanaian" />
                                    <option value="South African" />
                                    <option value="Kenyan" />
                                    <option value="Indian" />
                                    <option value="Lebanese" />
                                    <option value="Chinese" />
                                    <option value="French" />
                                    <option value="German" />
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <Label>Date of Birth</Label>
                                <Input name="dateOfBirth" type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Gender</Label>
                                <Select name="gender">
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Marital Status</Label>
                                <Select name="maritalStatus">
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Single">Single</SelectItem>
                                        <SelectItem value="Married">Married</SelectItem>
                                        <SelectItem value="Divorced">Divorced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label>Spouse Name</Label>
                                <Input name="spouseName" />
                            </div>
                            <div className="space-y-2">
                                <Label>Spouse Place of Work</Label>
                                <Input name="spouseWork" />
                            </div>
                        </div>
                        <div className="space-y-2 mt-4">
                            <Label>Residential Address</Label>
                            <Textarea name="residentialAddress" placeholder="Current address..." />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label>Nearest Bus Stop</Label>
                                <Input name="nearestBusStop" />
                            </div>
                            <div className="space-y-2">
                                <Label>Home Town Address</Label>
                                <Input name="homeTownAddress" />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label>State of Origin</Label>
                                <Select name="stateOfOrigin" onValueChange={setSelectedState}>
                                    <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {Object.keys(NIGERIA_STATES_AND_LGAS).sort().map((state) => (
                                            <SelectItem key={state} value={state}>{state}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>LGA</Label>
                                <Select name="lga" disabled={!selectedState}>
                                    <SelectTrigger><SelectValue placeholder={selectedState ? "Select LGA" : "Select State First"} /></SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {selectedState && NIGERIA_STATES_AND_LGAS[selectedState]?.map((lga) => (
                                            <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label>Place of Worship</Label>
                                <Input name="placeOfWorship" />
                            </div>
                            <div className="space-y-2">
                                <Label>Bank Details (Bank & Account)</Label>
                                <Input name="bankDetails" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: WORK & IDENTITY */}
            {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-xl font-bold mb-4">Employment / Work</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Occupation / Profession</Label>
                                <Input name="occupation" />
                            </div>
                            <div className="space-y-2">
                                <Label>Position Held</Label>
                                <Input name="positionHeld" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Place of Work Address</Label>
                                <Textarea name="placeOfWork" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-xl font-bold mb-4">Means of Identification</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>ID Type</Label>
                                <Select name="meansOfIdentification">
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="International Passport">International Passport</SelectItem>
                                        <SelectItem value="Drivers License">Driver's License</SelectItem>
                                        <SelectItem value="National ID">National ID (NIN)</SelectItem>
                                        <SelectItem value="Voters Card">Voter's Card</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>ID Number</Label>
                                <Input name="idNumber" />
                            </div>
                            <div className="space-y-2">
                                <Label>Issue Date</Label>
                                <Input name="idIssueDate" type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Expiry Date</Label>
                                <Input name="idExpiryDate" type="date" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <div className="flex items-center space-x-2 mb-4">
                            <Checkbox id="corporate" onCheckedChange={(c) => setIsCorporate(c as boolean)} />
                            <Label htmlFor="corporate" className="font-bold">This is a Corporate / Company Tenant?</Label>
                        </div>

                        {isCorporate && (
                            <div className="space-y-4 animate-in fade-in zoom-in-95">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Company Name</Label>
                                        <Input name="companyName" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date of Incorporation</Label>
                                        <Input name="incorporationDate" type="date" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Certificate Number</Label>
                                        <Input name="certificateNumber" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type of Business</Label>
                                        <Input name="businessType" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Corporate Email</Label>
                                        <Input name="corporateEmail" type="email" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Website</Label>
                                        <Input name="corporateWebsite" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Contact Person Name</Label>
                                        <Input name="contactPersonName" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Contact Person Phone</Label>
                                        <Input name="contactPersonPhone" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Corporate Address</Label>
                                    <Textarea name="corporateAddress" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 3: PROPERTY & REQUIREMENTS */}
            {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-xl font-bold mb-4">Property Requirements</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Property Type Required</Label>
                                <Input name="propertyTypeRequired" placeholder="Shop, Office, Hall, Flat..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Location Required</Label>
                                <Input name="locationRequired" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Will you accept another location if assigned?</Label>
                                <RadioGroup name="acceptOtherLocation" className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="true" id="accept-yes" />
                                        <Label htmlFor="accept-yes">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="false" id="accept-no" />
                                        <Label htmlFor="accept-no">No</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Brief Description of Business / Usage</Label>
                                <Textarea name="businessDescription" />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label>Nature of Tenancy</Label>
                                <Select name="tenancyNature">
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fixed">Fixed Tenancy</SelectItem>
                                        <SelectItem value="Renewable">Renewable on Terms</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Commencement Date</Label>
                                <Input name="commencementDate" type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Affordable Rent (Per Annum)</Label>
                                <Input name="budgetPerAnnum" type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label>Do you prefer Long Lease?</Label>
                                <Select name="leasePreference">
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="No">No (Standard 1 Year)</SelectItem>
                                        <SelectItem value="Yes">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>If Long Lease, How many years?</Label>
                                <Input name="leaseYears" type="number" />
                            </div>
                        </div>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-start space-x-2">
                                <Checkbox name="serviceChargeAffordability" value="true" id="svc" />
                                <Label htmlFor="svc" className="leading-tight">Will you be able to afford service charge in addition to rent for maintenance and security?</Label>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Checkbox name="cautionDepositAgreement" value="true" id="caution" />
                                <Label htmlFor="caution" className="leading-tight">Will you be prepared to pay Caution Deposit against damage?</Label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-xl font-bold mb-4">Previous Tenancy History</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label>Address of Last Rented Property</Label>
                                <Textarea name="lastAddress" />
                            </div>
                            <div className="space-y-2">
                                <Label>Size / Description</Label>
                                <Input name="lastSize" />
                            </div>
                            <div className="space-y-2">
                                <Label>Rent Paid</Label>
                                <Input name="lastRentPaid" />
                            </div>
                            <div className="space-y-2">
                                <Label>Period of Payment</Label>
                                <Input name="periodOfPayment" placeholder="e.g Yearly, Monthly" />
                            </div>
                            <div className="space-y-2">
                                <Label>Expiration Date</Label>
                                <Input name="expirationDate" type="date" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Landlord's Name & Address</Label>
                                <Textarea name="lastLandlordNameAddress" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Reasons for Leaving</Label>
                                <Textarea name="reasonForLeaving" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: GUARANTORS */}
            {step === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-xl font-bold mb-4">Referees / Guarantors</h3>

                        {/* Hidden input to pass strict array structure */}
                        <input type="hidden" name="guarantors" value={JSON.stringify(guarantors)} />

                        {[0, 1].map((i) => (
                            <div key={i} className="mb-8 p-4 bg-muted/30 rounded-lg border border-border">
                                <h4 className="font-bold mb-4 text-primary">Guarantor {i + 1}</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input
                                            value={guarantors[i].name}
                                            onChange={(e) => updateGuarantor(i, 'name', e.target.value)}
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input
                                            value={guarantors[i].phone}
                                            onChange={(e) => updateGuarantor(i, 'phone', e.target.value)}
                                            placeholder="Tel"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Occupation</Label>
                                        <Input
                                            value={guarantors[i].occupation}
                                            onChange={(e) => updateGuarantor(i, 'occupation', e.target.value)}
                                            placeholder="Occupation"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Place of Work</Label>
                                        <Input
                                            value={guarantors[i].placeOfWork}
                                            onChange={(e) => updateGuarantor(i, 'placeOfWork', e.target.value)}
                                            placeholder="Work Address"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Residential Address</Label>
                                        <Textarea
                                            value={guarantors[i].address}
                                            onChange={(e) => updateGuarantor(i, 'address', e.target.value)}
                                            placeholder="Residential Address"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 5: DECLARATION */}
            {step === 5 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-xl font-bold mb-4">Declaration</h3>
                        <div className="prose prose-sm max-w-none text-muted-foreground bg-muted p-4 rounded-lg mb-6">
                            <p>
                                I hereby apply for the tenancy of house/shop/office/hall under your management.
                                I have read and understood the terms and conditions. I also prepare to execute subsequent Tenancy Agreement.
                                I agree to be bound by the terms and conditions herein and the one to be specified on the Tenancy Agreement to be prepared later.
                                I hereby declare that the information given in this application form is true and correct to the best of my knowledge.
                            </p>
                            <h4 className="font-bold text-foreground mt-4">Terms and Conditions:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Application form fee is non-refundable.</li>
                                <li>Information found to be false may lead to determination of tenancy.</li>
                                <li>Agreement to pay 10% agency and 10% agreement commission.</li>
                                <li>Tenancy created is a year certain.</li>
                                <li>Obtaining form does not guarantee allocation.</li>
                                <li>Agree to maintain peace and indemnify landlord for damages.</li>
                            </ul>
                        </div>

                        <div className="flex items-center space-x-2 py-4">
                            <Checkbox id="terms" required />
                            <Label htmlFor="terms" className="text-base font-medium">
                                I agree to all terms and conditions and certify the information provided is accurate.
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

                    {step < 5 ? (
                        <Button type="button" onClick={nextStep}>
                            Next Step <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90">
                            {isPending ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Submit Application
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
}
