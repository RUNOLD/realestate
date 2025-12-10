'use client';

import { ModeToggle } from "@/components/mode-toggle";
import { Palette, User, Bell, Shield, Wallet } from "lucide-react";
import { useState } from "react";

export default function TenantSettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                <p className="text-muted-foreground">Manage your preferences and account details.</p>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 min-h-[500px]">

                    {/* Sidebar */}
                    <div className="p-6 border-r border-border bg-muted/30">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                            >
                                <User size={18} /> Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('appearance')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                            >
                                <Palette size={18} /> Appearance
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="col-span-3 p-8">
                        {activeTab === 'appearance' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Appearance</h2>
                                    <p className="text-sm text-muted-foreground">Customize how the dashboard looks for you.</p>
                                </div>

                                <div className="space-y-6 max-w-lg">
                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                                        <div>
                                            <p className="font-medium text-foreground">Theme Preference</p>
                                            <p className="text-xs text-muted-foreground">Switch between light and dark modes.</p>
                                        </div>
                                        <ModeToggle />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Profile Information</h2>
                                    <p className="text-sm text-muted-foreground">Manage your personal details.</p>
                                </div>
                                <div className="p-12 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground">
                                    <User size={48} className="mb-4 opacity-50" />
                                    <p>Profile editing is managed by the administrator.</p>
                                    <p className="text-xs mt-1">Please contact support to update your details.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
