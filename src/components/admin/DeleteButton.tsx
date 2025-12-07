'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProperty, deleteMaterial } from "@/app/lib/actions";

interface DeleteButtonProps {
    id: string;
    type: 'PROPERTY' | 'MATERIAL';
}

export function DeleteButton({ id, type }: DeleteButtonProps) {
    const [isPending, setIsPending] = useState(false);

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;

        setIsPending(true);
        try {
            if (type === 'PROPERTY') {
                await deleteProperty(id);
            } else {
                await deleteMaterial(id);
            }
        } catch (e) {
            alert("Failed to delete item.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:border-red-200"
            onClick={handleDelete}
            disabled={isPending}
        >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </Button>
    );
}
