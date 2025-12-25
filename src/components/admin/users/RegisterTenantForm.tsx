'use client';

import { useActionState } from 'react';
import { Button } from "@/components/ui/button";
import { createTenant } from "@/actions/user";
import { UserPlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export function RegisterTenantForm() {
    const [state, action, isPending] = useActionState(createTenant, null);

    return (
        <form action={action} className="space-y-6">
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-bold text-foreground mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Full Name *</label>
                        <Input name="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email Address *</label>
                        <Input name="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                        <Input name="phone" placeholder="+234..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Initial Password *</label>
                        <Input name="password" type="password" placeholder="******" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Profile Picture *</label>
                        <Input name="image" type="file" accept="image/*" required className="file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2 file:hover:bg-primary/90 cursor-pointer" />
                    </div>
                </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-bold text-foreground mb-4">Next of Kin</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <Input name="nextOfKinName" placeholder="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                        <Input name="nextOfKinPhone" placeholder="+234..." />
                    </div>
                </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-bold text-foreground mb-4">Employment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Employer Name</label>
                        <Input name="employerName" placeholder="Company Ltd" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                        <Input name="jobTitle" placeholder="Software Engineer" />
                    </div>
                </div>
            </div>

            {state?.error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                    {typeof state.error === 'string' ? (
                        state.error
                    ) : (
                        <ul className="list-disc list-inside">
                            {Object.entries(state.error).map(([key, messages]) => (
                                <li key={key}>{(messages as string[]).join(", ")}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {state?.success && (
                <div className="bg-green-100 text-green-700 text-sm p-3 rounded-md border border-green-200">
                    <p className="font-bold">Success!</p>
                    <p>{state.message || "Tenant created successfully."}</p>
                </div>
            )}

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                    </>
                ) : (
                    <>
                        <UserPlus className="mr-2 h-4 w-4" /> Register New Tenant
                    </>
                )}
            </Button>
        </form>
    );
}
