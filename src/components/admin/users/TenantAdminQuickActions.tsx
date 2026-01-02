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
import { sendTenantReminder, suspendTenantPortal, blacklistTenant } from "@/actions/admin";
import { terminateLease } from "@/actions/property";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

                    {hasLease && (
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                            onSelect={() => {
                                if (confirm("Are you sure you want to terminate this lease?")) {
                                    if (leaseId) {
                                        handleAction(() => terminateLease(leaseId), "Lease terminated");
                                    } else {
                                        toast.error("Lease ID not found");
                                    }
                                }
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Terminate Lease</span>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 cursor-pointer"
                        onSelect={() => {
                            if (confirm("Blacklist this tenant? This is an internal flag.")) {
                                handleAction(() => blacklistTenant(tenantId), "Tenant blacklisted");
                            }
                        }}
                    >
                        <UserX className="mr-2 h-4 w-4" />
                        <span>Blacklist (Internal)</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
