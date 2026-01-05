"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [state, formAction, isPending] = useActionState(requestPasswordReset, null);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <Link href="/login" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-6 transition-colors">
                            <ArrowLeft size={16} className="mr-1.5" /> Back to Login
                        </Link>
                        <h1 className="text-3xl font-serif font-black text-foreground uppercase tracking-tight mb-3">Forgot Password?</h1>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                            Enter your email address and we'll send a link to reset your password.
                        </p>
                    </div>

                    <form action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    required
                                    className="pl-11 h-14 bg-muted/30 border-none rounded-2xl font-bold shadow-inner focus-visible:ring-1 focus-visible:ring-primary/20"
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                                {state.error}
                            </div>
                        )}

                        {state?.success && (
                            <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md">
                                {state.success}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 text-base font-black uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
