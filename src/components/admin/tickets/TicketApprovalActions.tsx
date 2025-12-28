'use client';

import { approveTicket, resolveTicket } from "@/actions/ticket";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRightCircle, Wrench } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export function TicketApprovalActions({ ticketId, approvalStatus }: { ticketId: string, approvalStatus: string }) {
    const [isPending, startTransition] = useTransition();

    const handleApprove = (role: 'MANAGER' | 'ADMIN') => {
        startTransition(async () => {
            await approveTicket(ticketId, role);
        });
    };

    const handleResolve = () => {
        startTransition(async () => {
            const res = await resolveTicket(ticketId);
            if (res.error) {
                toast.error(res.error);
            }
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
            <Button
                onClick={handleResolve}
                disabled={isPending}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm transition-all active:scale-95"
            >
                <Wrench size={16} />
                Mark as Fixed
            </Button>
        );
    }

    return null;
}
