'use client';

import { createLease } from "@/app/lib/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useActionState, useState, useEffect } from "react";
import { X, Loader2, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function CreateLeaseModal({ userId, properties }: { userId: string, properties: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [state, dispatch, isPending] = useActionState(createLease, null);

    // Close modal on success
    useEffect(() => {
        if (state?.success) {
            setIsOpen(false);
        }
    }, [state?.success]);

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="bg-gray-900 text-white hover:bg-black shadow-md gap-2"
                size="sm"
            >
                Create Lease
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create New Lease">
                <form action={dispatch} className="space-y-4">
                    <input type="hidden" name="userId" value={userId} />

                    {/* Property Selection */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Property</label>
                        <select
                            name="propertyId"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="" disabled selected>Select a property...</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.title} ({p.location}) - ₦{p.price.toLocaleString()}
                                </option>
                            ))}
                        </select>
                        {properties.length === 0 && (
                            <p className="text-xs text-amber-600">No available properties found.</p>
                        )}
                    </div>

                    {/* Rent Amount */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Rent Amount (₦)</label>
                        <Input name="rentAmount" type="number" placeholder="e.g. 1500000" required min="0" />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Start Date</label>
                            <Input name="startDate" type="date" required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">End Date</label>
                            <Input name="endDate" type="date" required />
                        </div>
                    </div>

                    {/* Errors / Success */}
                    {state?.error && <p className="text-red-500 text-sm font-medium">{state.error}</p>}
                    {state?.success && <p className="text-green-600 text-sm font-medium">Lease created successfully!</p>}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
                        <Button type="submit" className="flex-1 bg-gray-900 text-white" disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                            {isPending ? ' Creating...' : 'Create Lease'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
