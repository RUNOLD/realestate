'use client';

import { createAdminTicket } from "@/actions/ticket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useState, useEffect } from "react";
import { X, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

// Simple Modal UI Component
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border">
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h3 className="font-semibold text-lg text-foreground">{title}</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
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
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md gap-2"
            >
                Create Ticket
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log New Support Ticket">
                <form action={dispatch} className="space-y-4">
                    {/* Requester Selection */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Requester (Tenant)</label>
                        <select
                            name="userId"
                            required
                            defaultValue=""
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
                        >
                            <option value="" disabled>Select a tenant...</option>
                            {tenants.map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                            ))}
                        </select>
                    </div>

                    {/* Category & Priority Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Category</label>
                            <select name="category" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground">
                                <option value="PLUMBING">Plumbing</option>
                                <option value="ELECTRICAL">Electrical</option>
                                <option value="STRUCTURAL">Structural</option>
                                <option value="HVAC">HVAC</option>
                                <option value="GENERAL">General</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Priority</label>
                            <select
                                name="priority"
                                required
                                defaultValue="MEDIUM"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="EMERGENCY">Emergency</option>
                            </select>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Subject</label>
                        <Input name="subject" placeholder="Brief summary of the issue" required className="bg-background text-foreground" />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            placeholder="Detailed explanation..."
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y text-foreground placeholder:text-muted-foreground"
                            required
                        />
                    </div>

                    {/* Placeholder for Attachments */}
                    <div className="space-y-1.5 opacity-50 pointer-events-none">
                        <label className="text-sm font-medium text-foreground">Attachments (Coming Soon)</label>
                        <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground text-sm">
                            <Upload size={20} className="mb-2" />
                            <span>Drag & drop files</span>
                        </div>
                        <input type="hidden" name="images" value="[]" />
                    </div>

                    {/* Errors / Success */}
                    {state?.error && (
                        <div className="text-destructive text-sm font-medium bg-destructive/10 p-2 rounded-md border border-destructive/20">
                            {typeof state.error === 'string' ? (
                                state.error
                            ) : (
                                <ul className="list-disc list-inside">
                                    {Object.entries(state.error).map(([key, messages]) => (
                                        <li key={key}>{(messages as string[]).join(", ")}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                    {state?.success && <p className="text-green-600 dark:text-green-400 text-sm font-medium">Ticket created successfully!</p>}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
                        <Button type="submit" className="flex-1" disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                            {isPending ? ' Creating...' : 'Create Ticket'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
