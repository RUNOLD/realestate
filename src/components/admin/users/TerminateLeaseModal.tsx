'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { terminateLease } from "@/actions/property";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export function TerminateLeaseModal({ leaseId }: { leaseId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [terminationDate, setTerminationDate] = useState(new Date().toISOString().split('T')[0]);

    async function handleTerminate() {
        if (!terminationDate) {
            toast.error("Please select a termination date.");
            return;
        }

        setIsPending(true);
        try {
            const result = await terminateLease(leaseId, terminationDate);
            if (result.success) {
                toast.success("Lease terminated successfully.");
                setIsOpen(false);
            } else {
                toast.error(result.error || "Failed to terminate lease.");
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
                className="flex w-full items-center px-2 py-1.5 text-sm text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer rounded-sm hover:bg-red-50 transition-colors"
            >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Terminate Lease</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Terminate Lease</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 dark:text-gray-300">Effective Termination Date</label>
                        <Input
                            type="date"
                            value={terminationDate}
                            onChange={(e) => setTerminationDate(e.target.value)}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            The property will be marked as AVAILABLE as of this date.
                        </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-lg">
                        <p className="text-xs text-red-700 dark:text-red-400 font-medium">
                            Warning: This action will mark the current lease as inactive. This is irreversible.
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleTerminate}
                            disabled={isPending}
                            className="font-black"
                        >
                            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Terminate Lease'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
