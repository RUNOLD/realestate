"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/actions/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ResetPasswordButtonProps {
    email: string;
}

export function ResetPasswordButton({ email }: ResetPasswordButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("email", email);

            const result = await requestPasswordReset(null, formData);

            if (result?.error) {
                toast.error(result.error);
            } else if (result?.success) {
                toast.success("Reset link sent successfully to " + email);
            }
        } catch (error) {
            toast.error("Failed to send reset link");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            className="w-full"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                </>
            ) : (
                "Send Password Reset Link"
            )}
        </Button>
    );
}
