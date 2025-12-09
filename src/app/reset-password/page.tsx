"use client";

import { useActionState } from "react";
import { resetPassword } from "@/app/lib/auth_actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [state, formAction, isPending] = useActionState(resetPassword, null);

    if (!token) {
        return (
            <div className="text-center p-8">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="text-red-600 w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Link</h2>
                <p className="text-gray-500 mb-6">This password reset link is invalid or missing.</p>
                <Link href="/forgot-password">
                    <Button variant="outline">Request New Link</Button>
                </Link>
            </div>
        );
    }

    if (state?.success) {
        return (
            <div className="text-center p-8">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-green-600 w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Password Reset!</h2>
                <p className="text-gray-500 mb-6">Your password has been successfully updated.</p>
                <Link href="/login">
                    <Button className="w-full">Proceed to Login</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-serif font-bold text-primary mb-2">Reset Password</h1>
                <p className="text-muted-foreground text-sm">
                    Enter your new password below.
                </p>
            </div>

            <form action={formAction} className="space-y-6">
                <input type="hidden" name="token" value={token} />

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="pl-9 h-11"
                            minLength={6}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="pl-9 h-11"
                            minLength={6}
                        />
                    </div>
                </div>

                {state?.error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                        {state.error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full h-11 text-base font-semibold"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
                        </>
                    ) : (
                        "Reset Password"
                    )}
                </Button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
