'use client';

import * as React from 'react';
import { Send, Lock, CheckCircle2, MessageSquareOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addComment } from "@/actions/ticket";
import { pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import { format } from "date-fns"; // Recommended for professional date handling
import { toast } from "sonner";

interface Comment {
    id: string;
    content: string;
    createdAt: Date | string;
    user: {
        name: string | null;
        role: string;
        id: string;
    };
}

interface ChatBoxProps {
    ticketId: string;
    initialComments: Comment[];
    currentUserIds: string;
    claimedById?: string | null;
    isTenant?: boolean;
    isReadOnly?: boolean;
}

export function ChatBox({ ticketId, initialComments, currentUserIds, claimedById, isTenant, isReadOnly = false }: ChatBoxProps) {
    const [comments, setComments] = React.useState<Comment[]>(initialComments);
    const [newMessage, setNewMessage] = React.useState("");
    const [isPending, setIsPending] = React.useTransition();
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const isLocked = !isTenant && claimedById && claimedById !== currentUserIds;
    const isClaimedByMe = !isTenant && claimedById === currentUserIds;

    // Scroll to bottom helper
    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior
            });
        }
    };

    // Pusher Subscription
    React.useEffect(() => {
        const channel = pusherClient.subscribe(`ticket-${ticketId}`);

        channel.bind('incoming-message', (data: Comment) => {
            setComments((prev) => {
                if (prev.find(c => c.id === data.id)) return prev;
                return [...prev, data];
            });
        });

        return () => {
            pusherClient.unsubscribe(`ticket-${ticketId}`);
        };
    }, [ticketId]);

    // Scroll on new messages
    React.useEffect(() => {
        scrollToBottom();
    }, [comments]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || isLocked || isReadOnly) return;

        const content = newMessage.trim();
        setNewMessage("");

        // Optimistic Update
        const optimisticComment: Comment = {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
            content,
            createdAt: new Date().toISOString(),
            user: { id: currentUserIds, name: 'You', role: isTenant ? 'Tenant' : 'Staff' }
        };

        setComments(prev => [...prev, optimisticComment]);

        setIsPending(async () => {
            const result = await addComment(ticketId, content);
            if (result?.error) {
                // Rollback optimistic update on error
                setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="flex flex-col h-[600px] border border-border rounded-xl bg-card shadow-lg overflow-hidden transition-all">
            {/* Header */}
            <div className="p-4 border-b bg-muted/30 flex justify-between items-center backdrop-blur-sm">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm tracking-tight uppercase">Support Logic</h3>
                        {isClaimedByMe && <CheckCircle2 size={14} className="text-emerald-500" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                        {isReadOnly ? "Ticket Resolved • Read Only" : (isLocked ? "Secure Thread • Locked" : "Live Connectivity • Active")}
                    </p>
                </div>
                {(isLocked || isReadOnly) && <Lock size={16} className={isReadOnly ? "text-muted-foreground" : "text-amber-500"} />}
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-background to-muted/20"
            >
                {comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3 opacity-50">
                        <MessageSquareOff size={32} strokeWidth={1} />
                        <p className="text-xs font-medium uppercase tracking-tighter">Initiate conversation</p>
                    </div>
                ) : (
                    comments.map((comment) => {
                        const isMe = comment.user.id === currentUserIds;
                        return (
                            <div key={comment.id} className={cn("flex w-full animate-in fade-in slide-in-from-bottom-2", isMe ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                    "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
                                    isMe
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted border text-foreground rounded-tl-none"
                                )}>
                                    <div className="flex items-center gap-3 mb-1.5 opacity-80">
                                        <span className="text-[10px] font-black uppercase tracking-tight">
                                            {isMe ? 'Internal Response' : (comment.user.name || 'Resident')}
                                        </span>
                                        <span className={cn(
                                            "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase",
                                            isMe ? "bg-white/10" : "bg-background border"
                                        )}>
                                            {comment.user.role}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                    <div className="text-[9px] mt-2 font-mono opacity-50 text-right uppercase">
                                        {format(new Date(comment.createdAt), 'HH:mm')}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background border-t">
                {isReadOnly ? (
                    <div className="bg-muted/50 border border-border p-4 rounded-xl text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center justify-center gap-3">
                        <CheckCircle2 size={14} className="text-green-500" />
                        Ticket Resolved - Thread Closed
                    </div>
                ) : isLocked ? (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-[10px] text-amber-600 font-bold uppercase tracking-widest flex items-center gap-3">
                        <Lock size={14} />
                        Access Restricted: Responded by another executive
                    </div>
                ) : (
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={claimedById ? "Draft response..." : "Respond to claim ticket..."}
                            className="flex-1 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-11"
                            disabled={isPending}
                        />
                        <Button
                            type="submit"
                            disabled={isPending || !newMessage.trim()}
                            className="h-11 px-6 shadow-xl hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            <Send size={18} />
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
