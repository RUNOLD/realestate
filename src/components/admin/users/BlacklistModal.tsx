'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { UserX, Loader2 } from "lucide-react";
import { blacklistTenant } from "@/actions/admin";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export function BlacklistModal({ tenantId }: { tenantId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [reason, setReason] = useState("");

    async function handleBlacklist() {
        if (!reason.trim()) {
            toast.error("Please provide a reason for blacklisting.");
            return;
        }

        setIsPending(true);
        try {
            const result = await blacklistTenant(tenantId, reason);
            if (result.success) {
                toast.success("Tenant blacklisted successfully.");
                setIsOpen(false);
            } else {
                toast.error(result.error || "Failed to blacklist tenant.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsPending(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center px-2 py-1.5 text-sm text-destructive focus:bg-destructive/10 cursor-pointer rounded-sm hover:bg-destructive/5 transition-colors"
            >
                <UserX className="mr-2 h-4 w-4" />
                <span>Blacklist (Internal)</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Blacklist Tenant</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 dark:text-gray-300">Reason for Blacklisting</label>
                        <Textarea
                            placeholder="Enter the reason why this tenant is being blacklisted..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="h-32 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-destructive"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            This flag is internal and helps track problematic tenants across the property management platform.
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBlacklist}
                            disabled={isPending}
                            className="font-black"
                        >
                            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Blacklist Tenant'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
