'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Assuming you have these or similar
import { Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createPayment } from "@/app/lib/actions";

// Simple custom dialog if shadcn Dialog not fully set up or to avoid complex imports not visible
// Actually, I'll use a simple inline form wrapper or standard HTML dialog if needed, 
// but let's assume standard UI usage. 
// If Dialog components are missing, I'll use a simple toggle.
// I'll stick to a collapsible or simple form for robustness if libraries are unknown.
// But the user has shadcn-like components. I'll use a standard form in a "Modal" simulation or assume separate page?
// User said "Add a 'Log Payment' action button on the tenant's profile."
// A modal is best. I will try to use the imported Dialog if it exists, otherwise I'll just make a simple overlay.
// I'll check if Dialog exists? I can't check easily in parallel.
// I'll build a custom simple modal to be safe.

export function LogPaymentModal({ tenantId }: { tenantId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        setMessage(null);

        // Append tenantId if not in form (it is in hidden input below)

        try {
            const result = await createPayment(null, formData);
            if (result.success) {
                setMessage("Success: " + result.message);
                setTimeout(() => setIsOpen(false), 2000);
            } else {
                setMessage("Error: " + result.error);
            }
        } catch (e) {
            setMessage("Error logging payment.");
        } finally {
            setIsPending(false);
        }
    }

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} className="bg-primary text-white">
                <Plus className="mr-2 h-4 w-4" /> Log Payment
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Log Payment</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <input type="hidden" name="tenantId" value={tenantId} />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Amount (₦)</label>
                        <Input name="amount" type="number" step="0.01" required placeholder="0.00" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Payment Date</label>
                        <Input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Method</label>
                        <select name="method" className="w-full rounded-md border border-gray-300 p-2 text-sm" required>
                            <option value="Transfer">Bank Transfer</option>
                            <option value="Cash">Cash</option>
                            <option value="POS">POS</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Reference ID</label>
                        <Input name="reference" placeholder="e.g. TRF-123456" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Receipt / Teller (Optional)</label>
                        <Input name="receipt" type="file" accept="image/*,.pdf" />
                        {/* Note: backend createPayment needs update to handle file if we want to save it as Document too */}
                    </div>

                    {message && (
                        <div className={`p-3 rounded text-sm ${message.startsWith("Success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {message}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Record'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
