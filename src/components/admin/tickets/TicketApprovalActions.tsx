'use client';

import { approveTicket } from "@/actions/ticket";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRightCircle, Wrench } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { ResolveTicketModal } from "./ResolveTicketModal";

export function TicketApprovalActions({ ticketId, approvalStatus, status }: { ticketId: string, approvalStatus: string, status: string }) {
    const [isPending, startTransition] = useTransition();

    if (status === 'RESOLVED' || status === 'CLOSED') {
        return (
            <Button
                disabled
                size="sm"
                className="bg-emerald-600/50 text-white gap-2 cursor-not-allowed border-none opacity-80"
            >
                <CheckCircle size={16} />
                Fixed
            </Button>
        );
    }

    if (status === 'AWAITING_CONFIRMATION') {
        return (
            <Button
                disabled
                size="sm"
                className="bg-purple-600/50 text-white gap-2 cursor-not-allowed border-none opacity-80"
            >
                <Wrench size={16} />
                Awaiting Confirmation
            </Button>
        );
    }

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
        return <ResolveTicketModal ticketId={ticketId} />;
    }

    return null;
}
