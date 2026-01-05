"use client";

import { useActionState } from "react";
import { resetPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
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
        <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
                <Link href="/login" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-6 transition-colors">
                    <ArrowLeft size={16} className="mr-1.5" /> Back to Login
                </Link>
                <h1 className="text-3xl font-serif font-black text-foreground uppercase tracking-tight mb-3">Reset Password</h1>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                    Set a new secure password for your Ayoola account.
                </p>
            </div>

            <form action={formAction} className="space-y-6">
                <input type="hidden" name="token" value={token} />

                <div className="space-y-2">
                    <label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="pl-11 h-14 bg-muted/30 border-none rounded-2xl font-bold shadow-inner focus-visible:ring-1 focus-visible:ring-primary/20"
                            minLength={6}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="pl-11 h-14 bg-muted/30 border-none rounded-2xl font-bold shadow-inner focus-visible:ring-1 focus-visible:ring-primary/20"
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
                    className="w-full h-14 text-base font-black uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Resetting...
                        </>
                    ) : (
                        "Update Password"
                    )}
                </Button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
                <Suspense fallback={<div className="p-8 text-center text-muted-foreground font-medium">Loading credentials...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
