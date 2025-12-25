"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag, MessageSquare } from "lucide-react";
import { ChatBox } from "@/components/admin/tickets/ChatBox";
import { cn } from "@/lib/utils";

interface TicketDetailsDrawerProps {
    ticket: any;
    isOpen: boolean;
    onClose: () => void;
    currentUserId: string;
}

export function TicketDetailsDrawer({ ticket, isOpen, onClose, currentUserId }: TicketDetailsDrawerProps) {
    if (!ticket) return null;

    const statusStyles = {
        OPEN: "bg-yellow-50 text-yellow-700 border-yellow-200",
        IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
        RESOLVED: "bg-green-50 text-green-700 border-green-200",
        CLOSED: "bg-gray-50 text-gray-700 border-gray-200",
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-[500px] flex flex-col p-0 overflow-hidden">
                <SheetHeader className="p-6 border-b bg-muted/30">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className={cn("px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]", statusStyles[ticket.status as keyof typeof statusStyles] || statusStyles.CLOSED)}>
                            {ticket.status}
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
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
