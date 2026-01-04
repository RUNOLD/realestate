"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approvePayoutAction } from "@/actions/payouts";
import { toast } from "sonner";
import { CheckCircle, Loader2 } from "lucide-react";

interface ApprovePayoutButtonProps {
    landlordId: string;
    propertyId: string;
    amount: number;
    totalCollected: number;
    commission: number;
    managementFee: number;
    totalExpenses: number;
    propertyTitle: string;
}

export function ApprovePayoutButton({
    landlordId,
    propertyId,
    amount,
    totalCollected,
    commission,
    managementFee,
    totalExpenses,
    propertyTitle
}: ApprovePayoutButtonProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    async function handleApprove() {
        if (status !== 'idle') return;

        setStatus('loading');
        const formData = new FormData();
        formData.append("landlordId", landlordId);
        formData.append("propertyId", propertyId);
        formData.append("amount", String(amount));
        formData.append("totalCollected", String(totalCollected));
        formData.append("commission", String(commission));
        formData.append("managementFee", String(managementFee));
        formData.append("totalExpenses", String(totalExpenses));
        formData.append("propertyTitle", propertyTitle);

        try {
            const result = await approvePayoutAction(formData);
            if (result.success) {
                setStatus('success');
                toast.success(`Payout for ${propertyTitle} processed successfully`);
            } else {
                setStatus('idle');
                toast.error(result.error || "Failed to process payout");
            }
        } catch (error) {
            setStatus('idle');
            toast.error("A network error occurred");
        }
    }

    if (status === 'success') {
        return (
            <Button disabled className="bg-emerald-600 text-white gap-2">
                <CheckCircle size={16} />
                Paid
            </Button>
        );
    }

    return (
        <Button
            onClick={handleApprove}
            disabled={status === 'loading'}
            size="sm"
            className="bg-primary hover:bg-primary/90 min-w-[80px]"
        >
            {status === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                "Approve"
            )}
        </Button>
    );
}
