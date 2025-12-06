'use client';

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
    Save,
    Bell,
    Lock,
    User,
    Globe,
    ShieldAlert,
    ChevronRight,
    Camera,
    Loader2,
    Palette
} from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(false);

    // Mock toggle states for notifications
    const [toggles, setToggles] = useState({
        email: true,
        sms: false,
        marketing: true
    });

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => setIsLoading(false), 1000);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Globe, desc: 'Platform details' },
        { id: 'profile', label: 'Profile', icon: User, desc: 'Personal info' },
        { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Theme & UI' },
        { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Email & SMS' },
        { id: 'security', label: 'Security', icon: Lock, desc: 'Password & Auth' },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT SIDEBAR NAVIGATION */}
                    <div className="lg:col-span-3 space-y-1">
                        <nav className="flex flex-col space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon size={18} className={isActive ? "text-blue-600" : "text-gray-400"} />
                                        <div className="text-left">
                                            <span className="block">{tab.label}</span>
                                        </div>
                                        {isActive && <ChevronRight size={14} className="ml-auto text-blue-600" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* RIGHT CONTENT AREA */}
                    <div className="lg:col-span-9">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px]">

                            {/* GENERAL TAB */}
                            {activeTab === 'general' && (
                                <div className="p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
                                    <div className="border-b border-gray-100 pb-4">
                                        <h2 className="text-lg font-semibold text-gray-900">General Information</h2>
                                        <p className="text-sm text-gray-500">Public information about your company.</p>
                                    </div>

                                    <div className="grid gap-6 max-w-2xl">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Company Name</label>
                                            <Input defaultValue="Ayoola Property Management" className="h-10" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Support Email</label>
                                                <Input defaultValue="support@ayoolaproperty.com" className="h-10" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                                <Input defaultValue="+234 800 123 4567" className="h-10" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Office Address</label>
                                            <Input defaultValue="123 Lekki Phase 1, Lagos, Nigeria" className="h-10" />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center justify-end border-t border-gray-100">
                                        <Button onClick={handleSave} disabled={isLoading} className="gap-2 min-w-[120px]">
                                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* PROFILE TAB */}
                            {activeTab === 'profile' && (
                                <div className="p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
                                    <div className="border-b border-gray-100 pb-4">
                                        <h2 className="text-lg font-semibold text-gray-900">Personal Profile</h2>
                                        <p className="text-sm text-gray-500">Update your photo and personal details.</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-8 items-start">
                                        {/* Avatar Section */}
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-24 w-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                                <User size={32} className="text-gray-400" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera size={20} className="text-white" />
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-xs">Change Photo</Button>
                                        </div>

                                        {/* Form Section */}
                                        <div className="flex-1 space-y-6 w-full max-w-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">First Name</label>
                                                    <Input defaultValue="Admin" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                                    <Input defaultValue="User" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                                <Input defaultValue="admin@ayoolaproperty.com" disabled className="bg-gray-50 text-gray-500" />
                                                <p className="text-xs text-gray-400">Email cannot be changed contact support.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center justify-end border-t border-gray-100">
                                        <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                            Save Profile
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* APPEARANCE TAB */}
                            {activeTab === 'appearance' && (
                                <div className="p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
                                    <div className="border-b border-gray-100 pb-4">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance Settings</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Customize the look and feel of the dashboard.</p>
                                    </div>

                                    <div className="space-y-6 max-w-lg">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">Interface Theme</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Select your preferred display mode.</p>
                                            </div>
                                            <ModeToggle />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* NOTIFICATIONS TAB */}
                            {activeTab === 'notifications' && (
                                <div className="p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
                                    <div className="border-b border-gray-100 pb-4">
                                        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                                        <p className="text-sm text-gray-500">Choose how and when you want to be notified.</p>
                                    </div>

                                    <div className="space-y-4 max-w-2xl">
                                        {/* Toggle Item 1 */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div>
                                                <p className="font-medium text-gray-900">Email Alerts</p>
                                                <p className="text-xs text-gray-500">Receive summaries of new tickets and payments.</p>
                                            </div>
                                            <Switch
                                                checked={toggles.email}
                                                onChange={() => setToggles(p => ({ ...p, email: !p.email }))}
                                            />
                                        </div>

                                        {/* Toggle Item 2 */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div>
                                                <p className="font-medium text-gray-900">SMS Notifications</p>
                                                <p className="text-xs text-gray-500">Get urgent maintenance alerts directly to your phone.</p>
                                            </div>
                                            <Switch
                                                checked={toggles.sms}
                                                onChange={() => setToggles(p => ({ ...p, sms: !p.sms }))}
                                            />
                                        </div>

                                        {/* Toggle Item 3 */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div>
                                                <p className="font-medium text-gray-900">Marketing Updates</p>
                                                <p className="text-xs text-gray-500">Receive news about product updates.</p>
                                            </div>
                                            <Switch
                                                checked={toggles.marketing}
                                                onChange={() => setToggles(p => ({ ...p, marketing: !p.marketing }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECURITY TAB */}
                            {activeTab === 'security' && (
                                <div className="p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
                                    <div className="border-b border-gray-100 pb-4">
                                        <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                                        <p className="text-sm text-gray-500">Manage your password and account security.</p>
                                    </div>

                                    <div className="space-y-6 max-w-lg">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Current Password</label>
                                                <Input type="password" placeholder="••••••••" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">New Password</label>
                                                <Input type="password" placeholder="••••••••" />
                                            </div>
                                            <Button onClick={handleSave} disabled={isLoading} className="mt-2">
                                                {isLoading ? 'Updating...' : 'Update Password'}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-gray-100">
                                        <div className="rounded-lg border border-red-100 bg-red-50 p-4 sm:p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-red-100 rounded-full text-red-600">
                                                    <ShieldAlert size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-bold text-red-900">Danger Zone</h3>
                                                    <p className="text-xs text-red-700 mt-1">
                                                        These actions are irreversible. Please be certain.
                                                    </p>
                                                    <div className="mt-4 flex gap-4">
                                                        <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-100 hover:text-red-900 bg-white">
                                                            Deactivate Account
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Simple Helper Component for the Switch Toggle
function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            type="button"
            className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none 
                ${checked ? 'bg-black' : 'bg-gray-200'}
            `}
        >
            <span
                className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${checked ? 'translate-x-5' : 'translate-x-0'}
                `}
            />
        </button>
    );
}