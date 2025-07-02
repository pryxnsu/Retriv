'use client';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
    err: string | null;
}

export default function ErrorMessage({ err }: ErrorMessageProps) {
    return (
        <Alert
            variant={'destructive'}
            className={cn(
                'relative border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
            )}
            role="alert"
            aria-live="polite"
        >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="pr-8">{err}</AlertDescription>
        </Alert>
    );
}
