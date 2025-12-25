'use client';

import { usePaystackPayment } from 'react-paystack';
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { useState } from 'react';
import { verifyPayment } from '@/actions/payment';
import { useRouter } from 'next/navigation';

interface PayRentButtonProps {
    email: string;
    amount: number;
    userId: string;
}

export function PayRentButton({ email, amount, userId }: PayRentButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Default to test key if env is missing, or use a specific mock flow
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_sample_key_12345';

    // Config for Paystack
    const config = {
        reference: (new Date()).getTime().toString(),
        email: email,
        amount: amount * 100, // Paystack expects Kobo
        publicKey: publicKey,
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = async (reference: any) => {
        setLoading(true);
        // Verify on server
        const result = await verifyPayment(reference.reference, amount, userId);

        if (result.success) {
            alert("Payment successful! Your balance has been updated.");
            router.refresh();
        } else {
            alert("Payment recorded by provider but server verification failed: " + result.error);
        }
        setLoading(false);
    };

    const onClose = () => {
        console.log('Payment closed');
    };

    const handlePay = () => {
        if (publicKey === 'pk_test_sample_key_12345') {
            // Mock Flow for when no key is present (dev mode)
            const mockRef = 'mock_' + (new Date()).getTime().toString();
            if (confirm("DEV MODE: No Paystack Key found. Simulate successful payment?")) {
                onSuccess({ reference: mockRef });
            }
            return;
        }

        initializePayment({ onSuccess, onClose });
    };

    return (
        <Button
            onClick={handlePay}
            disabled={loading}

            className="w-full shadow-md"
        >
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Wallet className="mr-2 h-4 w-4" />}
            Pay Rent Now
        </Button>
    );
}
