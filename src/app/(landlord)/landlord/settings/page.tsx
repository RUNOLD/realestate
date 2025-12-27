
"use client";

import { useActionState } from "react";
import { updateSelfPassword } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used, or generic alert
import { useEffect } from "react";

const initialState: {
    message?: string;
    error?: string;
    success?: boolean;
} = {
    message: undefined,
    error: undefined,
    success: false
};

export default function LandlordSettingsPage() {
    const [state, formAction] = useActionState(updateSelfPassword, initialState);

    useEffect(() => {
        if (state?.success && state.message) {
            // toast.success(state.message);
            alert(state.message); // Fallback
        } else if (state?.error) {
            // toast.error(typeof state.error === 'string' ? state.error : "Failed");
            alert(state.error);
        }
    }, [state]);

    return (
        <div className="max-w-md mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>

            <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                        <Lock className="h-4 w-4 text-muted-foreground" /> Security
                    </CardTitle>
                    <CardDescription>Update your login password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">New Password</label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="******"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                placeholder="******"
                            />
                        </div>
                        <Button type="submit" className="w-full">Update Password</Button>

                        {state?.error && (
                            <p className="text-sm text-red-500 text-center">{typeof state.error === 'string' ? state.error : "Validation failed"}</p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
