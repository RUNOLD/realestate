'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { approveUser } from "@/actions/user";
import { approvePayment } from "@/actions/payment";

interface ApproveButtonProps {
    id: string;
    type: 'USER' | 'PAYMENT';
    className?: string; // Allow custom styling positioning
    compact?: boolean;  // For tight spaces (like tables)
}

export function ApproveButton({ id, type, className, compact = false }: ApproveButtonProps) {
    const [isPending, setIsPending] = useState(false);

    async function handleApprove() {
        // Confirmation is usually good for major actions
        if (!confirm(`Are you sure you want to approve this ${type.toLowerCase()}?`)) return;

        setIsPending(true);
        try {
            if (type === 'USER') {
                await approveUser(id);
            } else {
                await approvePayment(id);
            }
        } catch (e) {
            alert("Failed to approve item.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Button
            variant="default" // Use default variant (usually primary color)
            size={compact ? "icon" : "sm"}
            className={`${compact ? "h-8 w-8" : "bg-green-600 hover:bg-green-700 text-white"} ${className}`}
            onClick={handleApprove}
            disabled={isPending}
            title="Approve"
        >
            {isPending ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <CheckCircle size={16} className={compact ? "" : "mr-1"} />
            )}
            {!compact && "Approve"}
        </Button>
    );
}
