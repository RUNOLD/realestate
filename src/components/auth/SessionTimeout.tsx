'use client';

import { useEffect, useCallback } from 'react';
import { handleSignOut } from '@/actions/auth';
import { useRouter } from 'next/navigation';

const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

export function SessionTimeout() {
    const router = useRouter();

    const logout = useCallback(async () => {
        // Trigger server-side sign out
        await handleSignOut();
        router.push('/login');
    }, [router]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(logout, TIMEOUT_DURATION);
        };

        // Events to listen for
        const events = [
            'mousemove',
            'mousedown',
            'click',
            'keydown',
            'scroll',
            'touchstart'
        ];

        // Initial set
        resetTimer();

        // Add listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Cleanup
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [logout]);

    return null; // This component handles logic only, no UI
}
