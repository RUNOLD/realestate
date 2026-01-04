"use client";

import { Button } from "@/components/ui/button";
import {
    Bell,
    CreditCard,
    Ban,
    Trash2,
    UserX,
    MoreHorizontal
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogPaymentModal } from "@/components/tenant/LogPaymentModal";
import { useTransition } from "react";
import { sendTenantReminder, suspendTenantPortal } from "@/actions/admin";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { BlacklistModal } from "./BlacklistModal";
import { TerminateLeaseModal } from "./TerminateLeaseModal";

interface TenantAdminQuickActionsProps {
    tenantId: string;
    hasLease: boolean;
    leaseId?: string;
}

export function TenantAdminQuickActions({ tenantId, hasLease, leaseId }: TenantAdminQuickActionsProps) {
    const [isPending, startTransition] = useTransition();

    const handleAction = (action: () => Promise<any>, successMsg: string) => {
        startTransition(async () => {
            const result = await action();
            if (result.success) {
                toast.success(successMsg);
            } else {
                toast.error(result.error || "Action failed");
            }
        });
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                className="gap-2 text-blue-500 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-900 shadow-sm font-bold"
                onClick={() => handleAction(() => sendTenantReminder(tenantId), "Reminder sent successfully")}
                disabled={isPending}
            >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Bell size={16} />}
                Send Reminder
            </Button>

            <LogPaymentModal tenantId={tenantId} />

            <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isPending}>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <MoreHorizontal size={20} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Administrative Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="text-amber-600 focus:text-amber-700 focus:bg-amber-50 cursor-pointer"
                        onSelect={() => handleAction(() => suspendTenantPortal(tenantId), "Portal suspended")}
                    >
                        <Ban className="mr-2 h-4 w-4" />
                        <span>Suspend Tenant Portal</span>
                    </DropdownMenuItem>

                    {hasLease && leaseId && (
                        <div className="px-1 py-1">
                            <TerminateLeaseModal leaseId={leaseId} />
                        </div>
                    )}

                    <DropdownMenuSeparator />

                    <div className="px-1 py-1">
                        <BlacklistModal tenantId={tenantId} />
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
