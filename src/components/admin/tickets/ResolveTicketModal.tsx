'use client';

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { markTicketAsFixed } from "@/actions/ticket";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Wrench } from "lucide-react";

interface ResolveTicketModalProps {
    ticketId: string;
}

export function ResolveTicketModal({ ticketId }: ResolveTicketModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Form State
    const [resolutionNote, setResolutionNote] = useState("");
    const [costActual, setCostActual] = useState("0");
    const [resolvedBy, setResolvedBy] = useState("Internal Staff");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!resolutionNote.trim()) {
            toast.error("Please provide a resolution note.");
            return;
        }

        startTransition(async () => {
            const res = await markTicketAsFixed(ticketId, {
                resolutionNote,
                costActual: parseFloat(costActual) || 0,
                resolvedBy
            });

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Ticket marked as fixed. Awaiting tenant confirmation.");
                setOpen(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm">
                    <Wrench size={16} /> Mark as Fixed
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Mark Ticket as Fixed</DialogTitle>
                    <DialogDescription>
                        Complete the details below to finish the work. The tenant will be asked to confirm this resolution.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="resolvedBy">Resolved By</Label>
                        <Input
                            id="resolvedBy"
                            value={resolvedBy}
                            onChange={(e) => setResolvedBy(e.target.value)}
                            placeholder="e.g. John Doe (Plumber)"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cost">Total Cost (₦)</Label>
                        <Input
                            id="cost"
                            type="number"
                            min="0"
                            step="0.01"
                            value={costActual}
                            onChange={(e) => setCostActual(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                        <p className="text-[10px] text-muted-foreground">Only visible to Admins.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="note">Resolution Note</Label>
                        <Textarea
                            id="note"
                            value={resolutionNote}
                            onChange={(e) => setResolutionNote(e.target.value)}
                            placeholder="Describe what was done to fix the issue..."
                            className="min-h-[100px]"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                            Complete Fix
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
