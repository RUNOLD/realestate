'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; // We might need to install this or write a hook, checking if available. 
// If use-debounce is not available, I'll write a simple debounce.
// Let's assume standard debouncing for now.

export function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        // Reset page to 1 on search
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    };

    // Simple debounce implementation to avoid dependency if not confirmed
    let timeoutId: NodeJS.Timeout;
    const debouncedSearch = (term: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => handleSearch(term), 300);
    };

    return (
        <div className="relative w-full sm:w-80">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
                className="w-full pl-9 pr-4 py-2 h-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 bg-white shadow-sm transition-all"
                placeholder={placeholder}
                onChange={(e) => debouncedSearch(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()}
            />
        </div>
    );
}
