'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Send, User } from "lucide-react";
import { addComment } from "@/app/lib/actions"; // Server action
import { pusherClient } from "@/lib/pusher";

interface Comment {
    id: string;
    content: string;
    createdAt: Date | string;
    user: {
        name: string | null;
        role: string;
        id: string; // useful for styling self vs others
    };
}

interface ChatBoxProps {
    ticketId: string;
    initialComments: Comment[];
    currentUserIds: string;
}

export function ChatBox({ ticketId, initialComments, currentUserIds }: ChatBoxProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Subscribe to Pusher channel
        const channel = pusherClient.subscribe(`ticket-${ticketId}`);

        channel.bind('incoming-message', (data: Comment) => {
            setComments((prev) => [...prev, data]);
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        });

        return () => {
            pusherClient.unsubscribe(`ticket-${ticketId}`);
        };
    }, [ticketId]);

    // Scroll to bottom on load
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        setLoading(true);

        // Optimistic update (optional, but pusher will handle it fast enough usually)
        // Let's rely on Pusher for now to avoid duplicate keys logic or handle it carefully.
        // Or we can rely on revalidatePath in server action which might refresh the page property, 
        // effectively resetting this state if we are not careful.
        // Actually, since this is a client component getting initialComments from props, 
        // we should append locally or wait for pusher.

        const result = await addComment(ticketId, newMessage);
        if (result?.error) {
            alert("Failed to send: " + result.error);
        } else {
            setNewMessage("");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-[600px] border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-800">Support Conversation</h3>
                <p className="text-xs text-gray-500">Real-time updates enabled</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {comments.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        No comments yet. Start the conversation.
                    </div>
                ) : (
                    comments.map((comment) => {
                        const isMe = comment.user.id === currentUserIds;
                        return (
                            <div key={comment.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-3 ${isMe ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold ${isMe ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {comment.user.name || 'User'}
                                        </span>
                                        <span className={`text-[10px] uppercase px-1 py-0.5 rounded ${isMe ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
                                            {comment.user.role}
                                        </span>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                        disabled={loading}
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={loading || !newMessage.trim()}
                        className="bg-black hover:bg-gray-800"
                    >
                        <Send size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
