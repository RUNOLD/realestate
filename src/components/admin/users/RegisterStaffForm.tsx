'use client';

import { useActionState } from 'react';
import { Button } from "@/components/ui/button";
import { createStaff } from "@/actions/user";
import { UserPlus, Loader2, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RegisterStaffForm() {
    const [state, action, isPending] = useActionState(createStaff, null);

    return (
        <form action={action} className="space-y-6">
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <ShieldCheck className="text-primary" size={20} />
                    Account Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Full Name *</label>
                        <Input name="name" placeholder="Staff Name" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email Address *</label>
                        <Input name="email" type="email" placeholder="staff@ayoola.com" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                        <Input name="phone" placeholder="+234..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Role *</label>
                        <Select name="role" defaultValue="STAFF">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="STAFF">Staff</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
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

            {state?.success && (
                <div className="bg-green-100 text-green-700 text-sm p-3 rounded-md border border-green-200">
                    <p className="font-bold">Success!</p>
                    <p>{state.message || "Staff member created successfully."}</p>
                </div>
            )}

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 h-12" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                    </>
                ) : (
                    <>
                        <UserPlus className="mr-2 h-4 w-4" /> Add Team Member
                    </>
                )}
            </Button>
        </form>
    );
}
