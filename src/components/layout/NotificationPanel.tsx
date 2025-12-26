"use client";

import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger
} from "@/components/ui/sheet";
import { Bell, Check, Trash2, Clock, MessageSquare, CreditCard, Wrench, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pusherClient } from "@/lib/pusher";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/actions/notification";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string | null;
    link: string | null;
    isRead: boolean;
    createdAt: Date | string;
}

export function NotificationPanel({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            const res = await getNotifications();
            if (res.success && res.notifications) {
                setNotifications(res.notifications as any);
                setUnreadCount((res.notifications as any).filter((n: any) => !n.isRead).length);
            }
        };

        fetchNotifications();

        // Subscribe to private channel
        const channel = pusherClient.subscribe(`private-user-${userId}`);

        channel.bind("incoming-notification", (data: Notification) => {
            setNotifications((prev) => [data, ...prev].slice(0, 20));
            setUnreadCount((prev) => prev + 1);
            toast.info(data.title, {
                description: data.message || "New activity recorded.",
                action: data.link ? {
                    label: "View",
                    onClick: () => window.location.href = data.link!
                } : undefined
            });
        });

        return () => {
            pusherClient.unsubscribe(`private-user-${userId}`);
        };
    }, [userId]);

    const handleMarkRead = async (id: string) => {
        const res = await markNotificationRead(id);
        if (res.success) {
            setNotifications((prev) =>
                prev.map((n) => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        }
    };

    const handleMarkAllRead = async () => {
        const res = await markAllNotificationsRead();
        if (res.success) {
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "MAINTENANCE": return <Wrench size={16} className="text-blue-500" />;
            case "PAYMENT": return <CreditCard size={16} className="text-green-500" />;
            case "CHAT": return <MessageSquare size={16} className="text-purple-500" />;
            default: return <AlertTriangle size={16} className="text-amber-500" />;
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 rounded-full transition-all">
                    <Bell size={20} className="text-muted-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center border-2 border-background animate-in zoom-in">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-[400px] flex flex-col p-0 overflow-hidden border-l border-primary/10">
                <SheetHeader className="p-6 border-b bg-muted/20 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <SheetTitle className="text-xl font-serif font-bold text-primary">Notifications</SheetTitle>
                            <SheetDescription className="text-xs">Stay updated with latest activities</SheetDescription>
                        </div>
                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="h-8 text-xs font-bold text-primary hover:bg-primary/5">
                                <Check size={14} className="mr-1" /> Mark all as read
                            </Button>
                        )}
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto divide-y divide-border/50">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 text-center opacity-50">
                            <Bell size={48} className="mb-4 text-muted-foreground" />
                            <p className="text-sm font-medium">No notifications yet</p>
                            <p className="text-xs mt-1">We'll alert you when something happens.</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    "p-4 transition-all hover:bg-muted/30 relative group",
                                    !notification.isRead && "bg-primary/[0.03]"
                                )}
                            >
                                {!notification.isRead && (
                                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                                )}
                                <div className="flex gap-4">
                                    <div className="mt-1 p-2 bg-white rounded-xl border border-border shadow-sm group-hover:shadow-md transition-shadow">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className={cn("text-sm font-bold leading-none", !notification.isRead ? "text-primary" : "text-foreground/70")}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                                                <Clock size={10} /> {new Date(notification.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {notification.message && (
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                {notification.message}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 pt-2">
                                            {notification.link && (
                                                <Link
                                                    href={notification.link}
                                                    className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <ExternalLink size={10} /> VIEW DETAILS
                                                </Link>
                                            )}
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => handleMarkRead(notification.id)}
                                                    className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    MARK AS READ
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
