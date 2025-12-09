'use client';


import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useActionState, useState, useEffect } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Eye, EyeOff, Lock, User, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [state, dispatch, isPending] = useActionState(authenticate, undefined);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (state?.success && state?.redirectUrl) {
            console.log("LOGIN SUCCESS: Redirecting to", state.redirectUrl);
            router.push(state.redirectUrl);
            router.refresh(); // Ensure the layout updates with new session
        }
    }, [state, router]);

    return (
        <main className="min-h-screen bg-muted/20 flex flex-col font-sans">


            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-md">
                    {/* Back Link for better navigation */}
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Back to Home
                    </Link>

                    <div className="bg-card p-8 sm:p-10 rounded-2xl shadow-xl border border-border">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                <Lock size={24} />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Welcome Back</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Enter your credentials to access the portal.
                            </p>
                        </div>

                        <form className="space-y-6" action={dispatch}>
                            <div className="space-y-5">
                                {/* Identifier Input (Email or Phone) */}
                                <div className="space-y-2">
                                    <label htmlFor="identifier" className="block text-sm font-medium text-foreground">
                                        Email or Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <User size={18} />
                                        </div>
                                        <Input
                                            id="identifier"
                                            name="identifier"
                                            type="text"
                                            autoComplete="username"
                                            required
                                            placeholder="e.g. 08012345678 or name@email.com"
                                            className="pl-10 h-11 bg-muted/10 border-input focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                {/* Password Input with Toggle */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                            Password
                                        </label>
                                        <Link href="/forgot-password" className="text-xs font-medium text-accent hover:text-yellow-600 transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <Lock size={18} />
                                        </div>
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            required
                                            placeholder="••••••••"
                                            className="pl-10 pr-10 h-11 bg-muted/10 border-input focus:ring-primary/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message Alert */}
                            {state?.error && (
                                <div className="p-3 rounded-md bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center animate-in fade-in slide-in-from-top-1">
                                    {state.error}
                                </div>
                            )}

                            {/* {state?.success && (
                                <div className="p-3 rounded-md bg-green-50 border border-green-100 text-green-600 text-sm font-medium text-center animate-in fade-in slide-in-from-top-1">
                                    Login successful! Redirecting...
                                </div>
                            )} */}

                            <Button
                                type="submit"
                                variant="luxury"
                                className="w-full text-base font-bold h-12 shadow-lg hover:shadow-xl transition-all"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={18} />
                                        {'Authenticating...'}
                                    </span>
                                ) : 'Sign In'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
