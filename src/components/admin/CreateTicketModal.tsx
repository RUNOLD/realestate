'use client';

import { createAdminTicket } from "@/app/lib/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useActionState, useState, useEffect } from "react";
import { X, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

// Simple Modal UI Component
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

export function CreateTicketModal({ tenants }: { tenants: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    // Use useActionState for form handling (optimistic updates/pending state)
    const [state, dispatch, isPending] = useActionState(createAdminTicket, null);
    const router = useRouter();

    // Close modal on success
    useEffect(() => {
        if (state?.success) {
            setIsOpen(false);
            // Optionally trigger a toast here
        }
    }, [state?.success]);

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="bg-gray-900 text-white hover:bg-black shadow-md gap-2"
            >
                Create Ticket
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log New Support Ticket">
                <form action={dispatch} className="space-y-4">
                    {/* Requester Selection */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Requester (Tenant)</label>
                        <select
                            name="userId"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="" disabled selected>Select a tenant...</option>
                            {tenants.map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                            ))}
                        </select>
                    </div>

                    {/* Category & Priority Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <select name="category" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <option value="PLUMBING">Plumbing</option>
                                <option value="ELECTRICAL">Electrical</option>
                                <option value="STRUCTURAL">Structural</option>
                                <option value="HVAC">HVAC</option>
                                <option value="GENERAL">General</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Priority</label>
                            <select name="priority" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <option value="LOW">Low</option>
                                <option value="MEDIUM" selected>Medium</option>
                                <option value="HIGH">High</option>
                                <option value="EMERGENCY">Emergency</option>
                            </select>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Subject</label>
                        <Input name="subject" placeholder="Brief summary of the issue" required />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            placeholder="Detailed explanation..."
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                            required
                        />
                    </div>

                    {/* Placeholder for Attachments (Not fully implemented in backend yet for Multipart, but UI included) */}
                    <div className="space-y-1.5 opacity-50 pointer-events-none">
                        <label className="text-sm font-medium text-gray-700">Attachments (Coming Soon)</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 text-sm">
                            <Upload size={20} className="mb-2" />
                            <span>Drag & drop files</span>
                        </div>
                        <input type="hidden" name="images" value="[]" />
                    </div>

                    {/* Errors / Success */}
                    {state?.error && <p className="text-red-500 text-sm font-medium">{state.error}</p>}
                    {state?.success && <p className="text-green-600 text-sm font-medium">Ticket created successfully!</p>}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
                        <Button type="submit" className="flex-1 bg-gray-900 text-white" disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                            {isPending ? ' Creating...' : 'Create Ticket'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
