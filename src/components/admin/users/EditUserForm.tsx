'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";
import {
    ArrowLeft,
    Save,
    User,
    Mail,
    Phone,
    Shield,
    Activity,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditUserFormProps {
    user: {
        id: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        role: string;
        status: string;
    };
}

export function EditUserForm({ user }: EditUserFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);

    async function handleConfirmSave() {
        const form = document.getElementById("edit-user-form") as HTMLFormElement;
        const formData = new FormData(form);

        setIsOpen(false);
        startTransition(async () => {
            const res = await updateUser(null, formData);
            if (res?.error) {
                if (typeof res.error === 'object') {
                    const message = Object.values(res.error).flat().join(", ");
                    toast.error(message || "Validation failed");
                } else {
                    toast.error(res.error);
                }
            } else {
                toast.success(res.message || "User updated successfully");
                router.push("/admin/users");
                router.refresh();
            }
        });
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Back Link */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    className="group text-muted-foreground hover:text-primary"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
                    Return to Directory
                </Button>
            </div>

            <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

                <CardHeader className="pt-10 pb-6 text-center md:text-left md:px-10">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                            <User size={40} />
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-3xl font-serif font-black tracking-tight text-primary">
                                Edit User Profile
                            </CardTitle>
                            <CardDescription className="text-sm font-medium opacity-70">
                                Modify administrative credentials and residency status for <span className="text-foreground font-bold">{user.name || user.email}</span>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <form id="edit-user-form" onSubmit={(e) => e.preventDefault()} className="p-0">
                    <input type="hidden" name="id" value={user.id} />

                    <CardContent className="space-y-10 md:px-10 pb-10">
                        {/* PERSONAL IDENTIFICATION */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                <User size={16} className="text-primary" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Identity & Contact</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black tracking-widest ml-1 opacity-70">Full Legal Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <Input
                                            name="name"
                                            defaultValue={user.name || ""}
                                            required
                                            placeholder="John Doe"
                                            className="h-14 pl-10 bg-muted/30 border-none rounded-2xl font-bold focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black tracking-widest ml-1 opacity-70">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <Input
                                            name="email"
                                            type="email"
                                            defaultValue={user.email || ""}
                                            required
                                            placeholder="john@example.com"
                                            className="h-14 pl-10 bg-muted/30 border-none rounded-2xl font-bold focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black tracking-widest ml-1 opacity-70">Phone Connectivity</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <Input
                                            name="phone"
                                            defaultValue={user.phone || ""}
                                            placeholder="+234..."
                                            className="h-14 pl-10 bg-muted/30 border-none rounded-2xl font-bold focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ACCESS & CLASSIFICATION */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                <Shield size={16} className="text-primary" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Access & Classification</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black tracking-widest ml-1 opacity-70">Portfolio Role</Label>
                                    <Select name="role" defaultValue={user.role}>
                                        <SelectTrigger className="h-14 bg-muted/30 border-none rounded-2xl font-bold shadow-inner focus:ring-1 focus:ring-primary">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TENANT">TENANT</SelectItem>
                                            <SelectItem value="STAFF">STAFF</SelectItem>
                                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                                            <SelectItem value="USER">USER</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black tracking-widest ml-1 opacity-70">System Status</Label>
                                    <Select name="status" defaultValue={user.status}>
                                        <SelectTrigger className="h-14 bg-muted/30 border-none rounded-2xl font-bold shadow-inner focus:ring-1 focus:ring-primary">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                    ACTIVE
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="PENDING">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                                                    PENDING
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="bg-muted/30 px-6 py-8 md:px-10 border-t flex flex-col sm:flex-row gap-4 justify-between items-center text-center sm:text-left">
                        <div className="max-w-xs">
                            <p className="text-[10px] font-medium text-muted-foreground leading-relaxed italic">
                                Note: Modifying user roles or status may affect their access to dashboard features and payment history.
                            </p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="h-14 px-8 rounded-2xl font-bold uppercase tracking-widest flex-1 sm:flex-none border-primary/20 hover:bg-primary/5 transition-all"
                            >
                                Cancel
                            </Button>

                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        type="button"
                                        disabled={isPending}
                                        className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex-1 sm:flex-none"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 size={20} className="mr-2 animate-spin" />
                                                Authorizing...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={20} className="mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-card border-border rounded-3xl">
                                    <DialogHeader>
                                        <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 mx-auto sm:mx-0">
                                            <AlertTriangle size={24} />
                                        </div>
                                        <DialogTitle className="text-2xl font-serif font-black text-primary">Confirm Modifications</DialogTitle>
                                        <DialogDescription className="font-medium">
                                            Are you certain you wish to apply these changes to the user profile? This action will take effect immediately across all dashboard systems.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
                                        <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl font-bold uppercase tracking-widest">
                                            Review Again
                                        </Button>
                                        <Button onClick={handleConfirmSave} className="rounded-xl font-black uppercase tracking-widest shadow-lg">
                                            Authorize & Update
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardFooter>
                </form>
            </Card>

            {/* SECURITY PROTOCOL CARD */}
            <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl flex gap-4 items-start">
                <Shield className="text-primary shrink-0 mt-1" size={20} />
                <div>
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-1">Administrative Protocol</h4>
                    <p className="text-[10px] text-muted-foreground/80 font-medium leading-relaxed">
                        User updates are logged for security and auditing purposes. Ensure that email changes are verified to prevent account lockouts or communication failure.
                    </p>
                </div>
            </div>
        </div>
    );
}
