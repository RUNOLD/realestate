'use client';

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Payout {
    id: string;
    reference: string;
    amount: number;
    status: string;
    periodStart: Date;
    periodEnd: Date;
    landlord: {
        name: string | null;
        email: string | null;
    };
}

export function ExportPayoutsButton({ payouts }: { payouts: any[] }) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        try {
            const headers = [
                "Payout Ref",
                "Landlord",
                "Email",
                "Amount",
                "Status",
                "Period Start",
                "Period End",
                "Date Created"
            ];

            const rows = payouts.map(p => [
                p.reference,
                p.landlord?.name || "Unknown",
                p.landlord?.email || "N/A",
                p.amount,
                p.status,
                new Date(p.periodStart).toLocaleDateString(),
                new Date(p.periodEnd).toLocaleDateString(),
                new Date(p.createdAt).toLocaleDateString()
            ]);

            const csvContent = [
                headers.join(","),
                ...rows.map(r => r.map(c => `"${c}"`).join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            const date = new Date().toISOString().split('T')[0];
            link.setAttribute("download", `payouts_report_${date}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(error);
            toast.error("Failed to export payouts");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            variant="outline"
            className="gap-2 border-dashed bg-background"
            onClick={handleExport}
            disabled={isExporting || payouts.length === 0}
        >
            {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
            Export Payouts
        </Button>
    );
}
