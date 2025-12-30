"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Tag, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";
import { ChatBox } from "@/components/admin/tickets/ChatBox";
import { cn } from "@/lib/utils";
import { confirmTicketResolution } from "@/actions/ticket";
import { toast } from "sonner";
import { useTransition } from "react";

interface TicketDetailsDrawerProps {
    ticket: any;
    isOpen: boolean;
    onClose: () => void;
    currentUserId: string;
    isReadOnly?: boolean;
}

export function TicketDetailsDrawer({ ticket, isOpen, onClose, currentUserId, isReadOnly = false }: TicketDetailsDrawerProps) {
    const [isPending, startTransition] = useTransition();

    if (!ticket) return null;

    const statusStyles = {
        OPEN: "bg-yellow-50 text-yellow-700 border-yellow-200",
        IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
        AWAITING_CONFIRMATION: "bg-purple-50 text-purple-700 border-purple-200",
        RESOLVED: "bg-green-50 text-green-700 border-green-200",
        CLOSED: "bg-gray-50 text-gray-700 border-gray-200",
    };

    const handleConfirm = () => {
        startTransition(async () => {
            const res = await confirmTicketResolution(ticket.id);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Ticket confirmed as resolved.");
                onClose(); // Close drawer to refresh or update state
            }
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-[500px] flex flex-col p-0 overflow-hidden">
                <SheetHeader className="p-6 border-b bg-muted/30">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className={cn("px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]", statusStyles[ticket.status as keyof typeof statusStyles] || statusStyles.CLOSED)}>
                            {ticket.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">#{ticket.id.substring(0, 8)}</span>
                    </div>
                    <SheetTitle className="text-2xl font-serif font-bold text-primary leading-tight">
                        {ticket.subject}
                    </SheetTitle>
                    <SheetDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs font-semibold">
                            <Tag size={14} className="text-primary" /> {ticket.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-semibold">
                            <Clock size={14} className="text-primary" /> {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Tenant Confirmation Action */}
                        {!isReadOnly && ticket.status === 'AWAITING_CONFIRMATION' && ticket.userId === currentUserId && (
                            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                                <div className="flex gap-3">
                                    <AlertCircle className="text-purple-600 shrink-0 h-5 w-5" />
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-purple-900 text-sm">Resolution Confirmation</h4>
                                        <p className="text-xs text-purple-700 leading-relaxed">
                                            Management has marked this issue as fixed. If you are satisfied with the work, please confirm to close the ticket.
                                        </p>
                                        {ticket.resolutionNote && (
                                            <div className="bg-white/50 p-2 rounded text-xs mt-2 italic text-purple-800 border border-purple-100">
                                                Note: "{ticket.resolutionNote}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    onClick={handleConfirm}
                                    disabled={isPending}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm"
                                >
                                    {isPending ? "Confirming..." : "Yes, I Confirm Resolution"}
                                </Button>
                            </div>
                        )}

                        <div className="space-y-2">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <MessageSquare size={14} /> Description
                            </h4>
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap bg-primary/5 p-4 rounded-xl border border-primary/10">
                                {ticket.description || "No description provided."}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Updates & Chat</h4>
                            <div className="h-[400px]">
                                <ChatBox
                                    ticketId={ticket.id}
                                    initialComments={ticket.comments || []}
                                    currentUserIds={currentUserId}
                                    claimedById={ticket.claimedById}
                                    isTenant={true}
                                    isReadOnly={isReadOnly}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
