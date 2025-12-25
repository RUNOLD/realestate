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
        <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                            <ArrowLeft size={16} className="mr-1" /> Back to Login
                        </Link>
                        <h1 className="text-2xl font-serif font-bold text-primary mb-2">Forgot Password?</h1>
                        <p className="text-muted-foreground text-sm">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                    className="pl-9 h-11"
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
                            className="w-full h-11 text-base font-semibold"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Link...
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
