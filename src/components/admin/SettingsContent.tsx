'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    Palette,
    ShieldCheck,
    Mail,
    Phone,
    UserCircle,
    KeyRound,
    UserCheck,
    ArrowRight
} from "lucide-react";
import { useState, useTransition } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { updateProfile, changePassword } from "@/actions/profile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SettingsContentProps {
    user: any;
}

export function SettingsContent({ user }: SettingsContentProps) {
    const isSuperAdmin = user.role === 'ADMIN';
    const [activeTab, setActiveTab] = useState(isSuperAdmin ? 'general' : 'profile');
    const [isPending, startTransition] = useTransition();

    // Mock toggle states for notifications
    const [toggles, setToggles] = useState({
        email: true,
        sms: false,
        marketing: true
    });

    const isTenant = user.role === 'TENANT';
    const isStaff = user.role === 'STAFF';
    const canEditName = isSuperAdmin; // Only admins can edit their own name self-service

    // Profile Handler
    async function handleProfileUpdate(formData: FormData) {
        startTransition(async () => {
            const res = await updateProfile(null, formData);
            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("Profile updated successfully");
            }
        });
    }

    // Password Handler
    async function handlePasswordUpdate(formData: FormData) {
        startTransition(async () => {
            const res = await changePassword(null, formData);
            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("Password changed successfully");
                (document.getElementById("password-form") as HTMLFormElement)?.reset();
            }
        });
    }

    const tabs = [
        ...(isSuperAdmin ? [{ id: 'general', label: 'General', icon: Globe, desc: 'Platform Master Settings' }] : []),
        { id: 'profile', label: 'Profile', icon: UserCircle, desc: 'Personal Identification' },
        { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Visual Interface Mode' },
        { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Communication Preferences' },
        { id: 'security', label: 'Security', icon: KeyRound, desc: 'Authentication & Privacy' },
    ];

    return (
        <div className="min-h-screen bg-transparent animate-in fade-in duration-500">
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-serif font-extrabold tracking-tight text-primary">Settings</h1>
                        <p className="text-muted-foreground font-medium">Manage your professional account profile and preferences.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT SIDEBAR NAVIGATION */}
                    <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-2">
                        <nav className="flex flex-col space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "group flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            isActive ? "bg-white/20" : "bg-muted group-hover:bg-muted-foreground/10"
                                        )}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                            <span className="block truncate uppercase tracking-widest text-[10px] opacity-70 mb-0.5">Category</span>
                                            <span className="block font-black">{tab.label}</span>
                                        </div>
                                        {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Account Status Card */}
                        <div className="mt-8 p-6 bg-muted/30 rounded-3xl border border-dashed border-border overflow-hidden relative">
                            <div className="relative z-10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">Account Status</h4>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-bold uppercase">{user.status}</span>
                                </div>
                                <Badge variant="outline" className="mt-3 bg-background font-bold tracking-tighter shadow-sm border-primary/20">
                                    {user.role}
                                </Badge>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5">
                                <ShieldCheck size={100} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT AREA */}
                    <div className="lg:col-span-9 bg-card border border-border rounded-[2.5rem] shadow-2xl shadow-primary/5 overflow-hidden transition-all min-h-[600px]">
                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="animate-in slide-in-from-bottom-4 duration-500">
                                <div className="p-8 md:p-12 border-b bg-muted/30">
                                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500" />
                                            <Avatar className="h-32 w-32 border-4 border-background relative shadow-2xl">
                                                <AvatarImage src={user.image} />
                                                <AvatarFallback className="bg-muted text-primary text-4xl font-black">
                                                    {user.name?.charAt(0) || user.email?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {!isTenant && (
                                                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full shadow-lg border border-border">
                                                    <Camera size={16} />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h2 className="text-3xl font-serif font-black text-primary">{user.name || 'Personal Information'}</h2>
                                                <p className="text-muted-foreground text-sm font-medium mt-1">Identity & Resident Classification</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                                <Badge className="bg-primary/10 text-primary border-primary/10 px-4 py-1 font-bold">
                                                    OFFICIAL {user.role}
                                                </Badge>
                                                {isTenant && (
                                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-4 py-1 font-bold flex gap-2 items-center">
                                                        <UserCheck size={14} /> VERIFIED RESIDENT
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 md:p-12 space-y-10">
                                    <form action={handleProfileUpdate} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</label>
                                                <div className="relative group">
                                                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-primary" size={18} />
                                                    <Input
                                                        name="name"
                                                        defaultValue={user.name}
                                                        required
                                                        disabled={!canEditName}
                                                        className={cn(
                                                            "h-14 pl-10 bg-muted/30 border-none rounded-2xl font-bold focus-visible:ring-1 focus-visible:ring-primary shadow-inner",
                                                            !canEditName && "opacity-80 cursor-not-allowed"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Phone Connectivity</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-primary" size={18} />
                                                    <Input
                                                        name="phone"
                                                        defaultValue={user.phone || ''}
                                                        placeholder="+234..."
                                                        className="h-14 pl-10 bg-muted/30 border-none rounded-2xl font-bold focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Secure Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50" size={18} />
                                                    <Input
                                                        defaultValue={user.email}
                                                        disabled
                                                        className="h-14 pl-10 bg-muted/10 border-none rounded-2xl font-mono text-xs font-bold opacity-60"
                                                    />
                                                </div>
                                                <p className="text-[10px] text-muted-foreground/60 italic px-1 flex items-center gap-1">
                                                    <Lock size={10} /> Contact administration to synchronize a new electronic mail address.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t">
                                            <div className="max-w-md">
                                                {(!canEditName || isTenant) ? (
                                                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                                        <span className="font-bold text-primary block mb-1">DATA INTEGRITY PROTOCOL</span>
                                                        Identity modifications are restricted to ensure organizational accountability. Please contact administration for legal name updates.
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">Confirm your identity by saving the latest modifications to your digital profile.</p>
                                                )}
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={isPending || isTenant}
                                                className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto"
                                            >
                                                {isPending ? <Loader2 size={20} className="animate-spin mr-2" /> : <Save size={20} className="mr-2" />}
                                                Authorize Update
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* APPEARANCE TAB */}
                        {activeTab === 'appearance' && (
                            <div className="p-8 md:p-12 space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-serif font-black text-primary uppercase tracking-tighter">Visual Experience</h2>
                                    <p className="text-muted-foreground font-medium">Configure the dashboard aesthetic and luminosity levels.</p>
                                </div>

                                <div className="grid gap-6">
                                    <div className="flex items-center justify-between p-8 bg-muted/20 rounded-[2rem] border border-border shadow-inner">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Palette className="text-primary" size={18} />
                                                <p className="font-black uppercase tracking-widest text-sm text-foreground">Interface Mode</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground font-medium max-w-xs">Switch between light elegance and midnight dark themes for optimal viewing.</p>
                                        </div>
                                        <div className="p-2 bg-background rounded-2xl shadow-xl border border-border">
                                            <ModeToggle />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-20 text-center opacity-30">
                                    <Globe size={120} className="mx-auto text-primary/20 p-4" />
                                </div>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="p-8 md:p-12 space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-serif font-black text-primary uppercase tracking-tighter">Digital Fortress</h2>
                                    <p className="text-muted-foreground font-medium">Protect your residency credentials with high-encryption password standards.</p>
                                </div>

                                <form id="password-form" action={handlePasswordUpdate} className="space-y-8 max-w-xl">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Current Authorization Key</label>
                                            <Input
                                                type="password"
                                                name="currentPassword"
                                                placeholder="••••••••"
                                                required
                                                className="h-14 bg-muted/30 border-none rounded-2xl font-bold focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Newly Encrypted Key</label>
                                            <Input
                                                type="password"
                                                name="newPassword"
                                                placeholder="••••••••"
                                                required
                                                className="h-14 bg-muted/30 border-none rounded-2xl font-bold focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <Button
                                            type="submit"
                                            disabled={isPending}
                                            className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all w-full"
                                        >
                                            {isPending ? <Loader2 size={20} className="animate-spin mr-2" /> : <ShieldCheck size={20} className="mr-2" />}
                                            Re-Encrypt Access Key
                                        </Button>
                                    </div>
                                </form>

                                <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-4 items-start max-w-xl">
                                    <ShieldAlert className="text-red-500 shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Security Protocol</h4>
                                        <p className="text-[10px] text-red-600/70 font-bold leading-relaxed">
                                            Always ensure your password contains at least 8 specialized characters and is not reused on other platforms.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="p-8 md:p-12 space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-serif font-black text-primary uppercase tracking-tighter">Pulse Connectivity</h2>
                                    <p className="text-muted-foreground font-medium">Choose how the Ayoola pulse keeps you informed in real-time.</p>
                                </div>

                                <div className="space-y-4 max-w-2xl">
                                    <NotificationToggle
                                        title="Electronic Mail Alerts"
                                        desc="Executive summaries of maintenance progress and payment confirmations."
                                        checked={toggles.email}
                                        onChange={() => setToggles(p => ({ ...p, email: !p.email }))}
                                        icon={Mail}
                                    />
                                    <NotificationToggle
                                        title="Direct SMS Logic"
                                        desc="Instant cellular alerts for urgent site access or emergency updates."
                                        checked={toggles.sms}
                                        onChange={() => setToggles(p => ({ ...p, sms: !p.sms }))}
                                        icon={Phone}
                                    />
                                    <NotificationToggle
                                        title="Marketing Insights"
                                        desc="Priority access to new portfolio additions and luxury sourcing opportunities."
                                        checked={toggles.marketing}
                                        onChange={() => setToggles(p => ({ ...p, marketing: !p.marketing }))}
                                        icon={Globe}
                                    />
                                </div>
                            </div>
                        )}

                        {/* GENERAL TAB (SuperAdmin) */}
                        {activeTab === 'general' && isSuperAdmin && (
                            <div className="p-8 md:p-12 space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-serif font-black text-primary uppercase tracking-tighter text-gray-900 border-b pb-4">Nexus Core Control</h2>
                                    <p className="text-muted-foreground font-medium">System-wide platform parameters for the Ayoola ecosystem.</p>
                                </div>

                                <div className="grid gap-8 max-w-3xl">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Entity Name</label>
                                        <Input defaultValue="Ayoola Property Management & Sourcing" className="h-14 bg-muted/30 border-none rounded-2xl font-black shadow-inner" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Global Support Node</label>
                                            <Input defaultValue="support@ayoolaproperty.com" className="h-14 bg-muted/30 border-none rounded-2xl font-bold shadow-inner" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Verified Hotline</label>
                                            <Input defaultValue="+234 800 123 4567" className="h-14 bg-muted/30 border-none rounded-2xl font-bold shadow-inner" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Headquarters Address</label>
                                        <Input defaultValue="123 Lekki Phase 1, Lagos, Nigeria" className="h-14 bg-muted/30 border-none rounded-2xl font-bold shadow-inner" />
                                    </div>
                                </div>
                                <div className="pt-8 flex items-center justify-end border-t border-gray-100">
                                    <Button disabled className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest opacity-50">
                                        <Save className="mr-2" size={20} /> Deploy Configuration
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function NotificationToggle({ title, desc, checked, onChange, icon: Icon }: { title: string, desc: string, checked: boolean, onChange: () => void, icon: any }) {
    return (
        <div className="flex items-center justify-between p-6 bg-muted/20 rounded-3xl border border-border group hover:bg-muted/30 transition-all cursor-pointer" onClick={onChange}>
            <div className="flex gap-4 items-center">
                <div className={cn(
                    "p-3 rounded-2xl transition-all shadow-lg",
                    checked ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-background text-muted-foreground"
                )}>
                    <Icon size={20} />
                </div>
                <div className="space-y-1">
                    <p className="font-black uppercase tracking-widest text-xs text-foreground">{title}</p>
                    <p className="text-[10px] text-muted-foreground font-medium max-w-sm line-clamp-1">{desc}</p>
                </div>
            </div>
            <Switch
                checked={checked}
                onChange={onChange}
            />
        </div>
    );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            type="button"
            className={cn(
                "group relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-offset-background",
                checked ? 'bg-primary' : 'bg-muted-foreground/30'
            )}
        >
            <span
                className={cn(
                    "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-xl ring-0 transition duration-200 ease-in-out",
                    checked ? 'translate-x-6' : 'translate-x-0'
                )}
            />
        </button>
    );
}
