export type ActionState = {
    success?: boolean;
    message?: string;
    error?: string;
    details?: Record<string, string[]>;
};
