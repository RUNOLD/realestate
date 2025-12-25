'use client';

import { createTicket } from "@/actions/ticket";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";

export function TicketForm() {
    const [state, dispatch, isPending] = useActionState(createTicket, null);

    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-bold text-primary mb-4">Submit Maintenance Request</h3>
            <form action={dispatch} className="grid md:grid-cols-2 gap-4">
                <input name="subject" placeholder="Subject (e.g., Leaking Tap)" className="border p-2 rounded" required />
                <select name="category" className="border p-2 rounded" required>
                    <option value="PLUMBING">Plumbing</option>
                    <option value="ELECTRICAL">Electrical</option>
                    <option value="STRUCTURAL">Structural</option>
                    <option value="OTHER">Other</option>
                </select>
                <textarea name="description" placeholder="Describe the issue..." className="border p-2 rounded md:col-span-2" rows={3} required />

                {state?.error && (
                    <div className="text-red-500 text-sm md:col-span-2">
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
                {state?.success && (
                    <div className="text-green-600 text-sm md:col-span-2">Ticket submitted successfully!</div>
                )}

                <Button type="submit" className="md:col-span-2" disabled={isPending}>
                    {isPending ? 'Submitting...' : 'Submit Ticket'}
                </Button>
            </form>
        </div>
    );
}
