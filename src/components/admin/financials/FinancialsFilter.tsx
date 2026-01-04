"use client";

import { Filter, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function FinancialsFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentStatus = searchParams.get("status") || "ALL";

    const handleFilter = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (status === "ALL") {
            params.delete("status");
        } else {
            params.set("status", status);
        }
        router.push(`?${params.toString()}`);
    };

    const statuses = [
        { label: "All Statuses", value: "ALL" },
        { label: "Success", value: "SUCCESS" },
        { label: "Pending", value: "PENDING" },
        { label: "Failed", value: "FAILED" },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                    <Filter className={`h-4 w-4 ${currentStatus !== "ALL" ? "text-primary fill-primary/20" : "text-muted-foreground"}`} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statuses.map((s) => (
                    <DropdownMenuItem
                        key={s.value}
                        onClick={() => handleFilter(s.value)}
                        className="justify-between cursor-pointer"
                    >
                        {s.label}
                        {currentStatus === s.value && <Check className="h-4 w-4 ml-2 text-primary" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
