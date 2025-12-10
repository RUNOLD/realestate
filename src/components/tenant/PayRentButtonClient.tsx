'use client';

import dynamic from 'next/dynamic';

const PayRentButton = dynamic(
    () => import('./PayRentButton').then((mod) => mod.PayRentButton),
    { ssr: false }
);

interface PayRentButtonProps {
    email: string;
    amount: number;
    userId: string;
}

export function PayRentButtonClient(props: PayRentButtonProps) {
    return <PayRentButton {...props} />;
}
