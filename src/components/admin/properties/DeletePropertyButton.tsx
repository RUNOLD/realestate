'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { deleteProperty } from "@/actions/property";
import { toast } from "sonner";

interface DeletePropertyButtonProps {
    propertyId: string;
    hasUnits: boolean;
    isUnit: boolean;
}

export function DeletePropertyButton({ propertyId, hasUnits, isUnit }: DeletePropertyButtonProps) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [deleteAllUnits, setDeleteAllUnits] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!reason.trim()) {
            toast.error("Please provide a reason for deletion");
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteProperty(propertyId, reason, deleteAllUnits);
            if (result.success) {
                toast.success("Property deleted successfully");
                setOpen(false);
                router.push("/admin/properties");
            } else {
                toast.error(result.error || "Failed to delete property");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                    <Trash2 size={16} /> Delete Property
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle size={20} /> Confirm Deletion
                    </DialogTitle>
                    <DialogDescription>
                        This action is irreversible. It will permanently delete the property record from the system.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-sm font-bold">Reason for Deletion <span className="text-destructive">*</span></Label>
                        <Textarea
                            id="reason"
                            placeholder="e.g., Sold to another owner, Incorrect entry, etc."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    {(hasUnits || isUnit) && (
                        <div className="flex items-start space-x-3 p-3 bg-destructive/5 border border-destructive/10 rounded-lg">
                            <Checkbox
                                id="deleteUnits"
                                checked={deleteAllUnits}
                                onCheckedChange={(checked) => setDeleteAllUnits(!!checked)}
                                className="mt-1"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="deleteUnits" className="text-sm font-bold cursor-pointer">
                                    Delete all other units in this {isUnit ? "complex" : "property"}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Checking this will delete all units associated with this property group.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting || !reason.trim()}
                        className="gap-2 font-bold"
                    >
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        Confirm Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
