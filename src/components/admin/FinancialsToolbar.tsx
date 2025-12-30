"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Download, Check } from "lucide-react";

interface PaymentData {
    id: string;
    amount: number;
    status: string;
    createdAt: Date;
    user: {
        name: string | null;
        email: string;
    };
}

interface FinancialsToolbarProps {
    data: PaymentData[];
    currentPeriod: string;
}

export function FinancialsToolbar({ data, currentPeriod }: FinancialsToolbarProps) {
    const router = useRouter();
    const [isExporting, setIsExporting] = useState(false);

    const handlePeriodChange = (period: string) => {
        const params = new URLSearchParams(window.location.search);
        if (period === 'all') {
            params.delete('period');
        } else {
            params.set('period', period);
        }
        router.push(`?${params.toString()}`);
    };

    const handleExport = () => {
        setIsExporting(true);
        try {
            // Define CSV headers
            const headers = ["Transaction ID", "User Name", "User Email", "Amount", "Status", "Date"];

            // Map data to CSV rows
            const rows = data.map(item => [
                item.id,
                item.user.name || "Unknown",
                item.user.email,
                item.amount.toString(),
                item.status,
                new Date(item.createdAt).toLocaleDateString()
            ]);

            // Combine headers and rows
            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.map(cell => `"${cell || ""}"`).join(","))
            ].join("\n");

            // Create download link
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `financials_export_${currentPeriod || 'all'}_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Export failed", error);
        } finally {
            setIsExporting(false);
        }
    };

    const periods = [
        { label: "Last 7 Days", value: "7d" },
        { label: "Last 30 Days", value: "30d" },
        { label: "Last 90 Days", value: "90d" },
        { label: "All Time", value: "all" },
    ];

    const currentLabel = periods.find(p => p.value === currentPeriod)?.label || "All Time";

    return (
        <div className="flex items-center gap-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-background hover:bg-muted text-foreground border-border min-w-[150px] justify-between">
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {currentLabel}
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border">
                    {periods.map((period) => (
                        <DropdownMenuItem
                            key={period.value}
                            onClick={() => handlePeriodChange(period.value)}
                            className="justify-between cursor-pointer focus:bg-muted focus:text-foreground"
                        >
                            {period.label}
                            {currentPeriod === period.value && <Check className="h-4 w-4 ml-2 text-primary" />}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                onClick={handleExport}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                disabled={isExporting}
            >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
        </div>
    );
}
