"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

export function FinancialsSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState(searchParams.get("q") || "");

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query !== (searchParams.get("q") || "")) {
                const params = new URLSearchParams(searchParams.toString());
                if (query) {
                    params.set("q", query);
                } else {
                    params.delete("q");
                }
                startTransition(() => {
                    router.push(`?${params.toString()}`);
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, router, searchParams]);

    return (
        <div className="relative flex-1 sm:w-64">
            <Search className={`absolute left-2.5 top-2.5 h-4 w-4 ${isPending ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
            <input
                type="text"
                placeholder="Search payments..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
            />
        </div>
    );
}
