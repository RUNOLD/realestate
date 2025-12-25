'use client';

import { approveTicket } from "@/actions/ticket";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRightCircle } from "lucide-react";
import { useTransition } from "react";

export function TicketApprovalActions({ ticketId, approvalStatus }: { ticketId: string, approvalStatus: string }) {
    const [isPending, startTransition] = useTransition();

    const handleApprove = (role: 'MANAGER' | 'ADMIN') => {
        startTransition(async () => {
            await approveTicket(ticketId, role);
        });
    };

    if (approvalStatus === 'PENDING_MANAGER') {
        return (
            <Button
                onClick={() => handleApprove('MANAGER')}
                disabled={isPending}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
            >
                <ArrowRightCircle size={16} />
                Manager Review
            </Button>
        );
    }

    if (approvalStatus === 'PENDING_ADMIN') {
        return (
            <Button
                onClick={() => handleApprove('ADMIN')}
                disabled={isPending}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
                <CheckCircle size={16} />
                Final Approval
            </Button>
        );
    }

    if (approvalStatus === 'APPROVED') {
        return (
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <CheckCircle size={16} />
                Approved
            </span>
        );
    }

    return null;
}
