'use client';

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Ticket {
    id: string;
    subject: string;
    status: string;
    priority: string;
    category: string;
    createdAt: Date;
    user: {
        name: string | null;
        email: string | null;
    };
    // Add other fields as needed
}

export function ExportTicketsButton({ tickets }: { tickets: any[] }) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        try {
            // Define headers
            const headers = [
                "Ticket ID",
                "Date Created",
                "Status",
                "Priority",
                "Category",
                "Requester Name",
                "Requester Email"
            ];

            // Map data to rows
            const rows = tickets.map(t => [
                t.id,
                new Date(t.createdAt).toLocaleDateString(),
                t.status,
                t.priority,
                t.category,
                t.user?.name || "Unknown",
                t.user?.email || "N/A"
            ]);

            // Combine into CSV string
            const csvContent = [
                headers.join(","),
                ...rows.map(r => r.map(c => `"${c}"`).join(",")) // Quote fields to handle commas
            ].join("\n");

            // Create Blob and Download Link
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            const date = new Date().toISOString().split('T')[0];
            link.setAttribute("download", `tickets_report_${date}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            toast.error("Failed to export tickets");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            variant="outline"
            className="bg-white border-gray-200 gap-2"
            onClick={handleExport}
            disabled={isExporting}
        >
            {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
            {isExporting ? 'Exporting...' : 'Export CSV'}
        </Button>
    );
}
