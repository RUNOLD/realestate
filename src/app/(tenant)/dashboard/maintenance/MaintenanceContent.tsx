"use client";

import { useState } from "react";
import { CheckCircle, Clock, Plus, Tag, ChevronRight, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketForm } from "@/components/tenant/TicketForm";
import { TicketDetailsDrawer } from "@/components/tenant/TicketDetailsDrawer";
import { cn } from "@/lib/utils";

interface MaintenanceContentProps {
    initialTickets: any[];
    userId: string;
}

export function MaintenanceContent({ initialTickets, userId }: MaintenanceContentProps) {
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState<"ACTIVE" | "RESOLVED">("ACTIVE");

    const activeTickets = initialTickets.filter((t) => t.status !== "RESOLVED" && t.status !== "CLOSED");
    const resolvedTickets = initialTickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED");

    const displayTickets = activeTab === "ACTIVE" ? activeTickets : resolvedTickets;

    const handleOpenTicket = (ticket: any) => {
        setSelectedTicket(ticket);
        setIsDrawerOpen(true);
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-serif font-extrabold tracking-tight text-primary">Maintenance</h1>
                    <p className="text-muted-foreground">Report property issues and track real-time repair progress.</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className={cn(
                        "rounded-full px-6 transition-all duration-300 shadow-lg hover:shadow-primary/20",
                        showForm ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                    )}
                >
                    {showForm ? "Cancel Request" : (
                        <>
                            <Plus size={18} className="mr-2" />
                            Report New Issue
                        </>
                    )}
                </Button>
            </div>

            {/* Submission Form Section */}
            {showForm && (
                <div className="max-w-3xl bg-card border border-primary/10 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <AlertCircle className="text-primary" size={20} />
                            Issue Details
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Provide clear information to help us resolve the issue faster.</p>
                    </div>
                    <TicketForm />
                </div>
            )}

            {/* Content Tabs */}
            <div className="space-y-6">
                <div className="flex gap-1 bg-muted/30 p-1 rounded-xl w-fit border">
                    <button
                        onClick={() => setActiveTab("ACTIVE")}
                        className={cn(
                            "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                            activeTab === "ACTIVE" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Active Requests ({activeTickets.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("RESOLVED")}
                        className={cn(
                            "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                            activeTab === "RESOLVED" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Resolution History ({resolvedTickets.length})
                    </button>
                </div>

                {displayTickets.length === 0 ? (
                    <div className="bg-card/50 border-2 border-dashed border-border p-16 rounded-3xl flex flex-col items-center justify-center text-center">
                        <div className="bg-muted p-6 rounded-full mb-6">
                            <CheckCircle className="h-10 w-10 text-muted-foreground/40" />
                        </div>
                        <h4 className="font-serif text-2xl font-bold text-primary">No {activeTab.toLowerCase()} requests</h4>
                        <p className="text-muted-foreground max-w-sm mt-2">
                            {activeTab === "ACTIVE"
                                ? "Everything seems fine! If you notice any issues, use the 'Report New Issue' button above."
                                : "You haven't had any maintenance requests resolved yet."}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {displayTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                onClick={() => handleOpenTicket(ticket)}
                                className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <MessageSquare size={80} />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <StatusBadge status={ticket.status} />
                                                <span className="text-[10px] font-mono text-muted-foreground uppercase">#{ticket.id.substring(0, 6)}</span>
                                            </div>
                                            <h4 className="font-bold text-xl text-primary line-clamp-1 group-hover:text-primary/80 transition-colors uppercase">
                                                {ticket.subject}
                                            </h4>
                                        </div>
                                        <div className="bg-primary/5 p-2 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                                        {ticket.description}
                                    </p>

                                    <div className="flex items-center gap-4 pt-4 border-t border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-primary" /> {new Date(ticket.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Tag size={14} className="text-primary" /> {ticket.category}
                                        </span>
                                        {ticket.comments?.length > 0 && (
                                            <span className="flex items-center gap-1.5 text-primary">
                                                <MessageSquare size={14} /> {ticket.comments.length}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Ticket Details Drawer */}
            <TicketDetailsDrawer
                ticket={selectedTicket}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                currentUserId={userId}
            />
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        OPEN: "bg-yellow-100 text-yellow-800 border-yellow-200",
        IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
        RESOLVED: "bg-green-100 text-green-800 border-green-200",
        CLOSED: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
        <span className={cn(
            "px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-tighter border",
            styles[status as keyof typeof styles] || styles.CLOSED
        )}>
            {status.replace("_", " ")}
        </span>
    );
}
