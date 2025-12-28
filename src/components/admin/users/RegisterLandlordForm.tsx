
'use client';

import { useActionState, useEffect } from 'react'; // Updated hook for Next.js 14/15 actions
import { Button } from "@/components/ui/button";
import { createStaff } from "@/actions/user"; // optimizing reuse of createStaff as it handles user creation, but we might want to rename it or create createLandlord later if logic diverges. For now createStaff is fine as it takes a role.
import { UserPlus, Loader2, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function RegisterLandlordForm() {
    // We can reuse createStaff action since it accepts role.
    // However, if createStaff validates role against "STAFF" or "ADMIN" strictly in Zod, we updated schema to include LANDLORD, so it should work.
    const router = useRouter(); // Requires import from next/navigation
    const [state, action, isPending] = useActionState(createStaff, null); // using generic createStaff

    useEffect(() => {
        if (state?.success) {
            toast.success("Landlord created successfully"); // Requires import from sonner
            router.push("/admin/users?role=LANDLORD");
        }
    }, [state, router]);

    return (
        <form action={action} className="space-y-6">
            <input type="hidden" name="role" value="LANDLORD" />

            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Building className="text-primary" size={20} />
                    Landlord Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Full Name *</label>
                        <Input name="name" placeholder="Landlord Name" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email Address *</label>
                        <Input name="email" type="email" placeholder="landlord@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Phone Number *</label>
                        <Input name="phone" placeholder="+234..." required />
                        {/* Landlords usually need a phone number */}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Initial Password *</label>
                        <Input name="password" type="password" placeholder="******" required />
                    </div>
                </div>
            </div>

            {state?.error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
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



            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 h-12" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                    </>
                ) : (
                    <>
                        <UserPlus className="mr-2 h-4 w-4" /> Create Landlord Account
                    </>
                )}
            </Button>
        </form>
    );
}
