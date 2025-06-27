'use client';

import { useSearchParams } from 'next/navigation';

export default function EmailVerifiedPage() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {status === 'success' && (
                <>
                    <h1 className="text-2xl font-bold">🎉 Email Verified</h1>
                    <p className="text-muted-foreground mt-2">Your email has been successfully verified.</p>
                </>
            )}
            {status === 'already-verified' && (
                <>
                    <h1 className="text-2xl font-bold">✅ Already Verified</h1>
                    <p className="text-muted-foreground mt-2">This email was already verified earlier.</p>
                </>
            )}
            {status === 'expired' && (
                <>
                    <h1 className="text-2xl font-bold">⏰ Link Expired</h1>
                    <p className="text-muted-foreground mt-2">Please request a new verification email.</p>
                </>
            )}
            {status === 'invalid' && (
                <>
                    <h1 className="text-2xl font-bold">❌ Invalid Token</h1>
                    <p className="text-muted-foreground mt-2">
                        The link you used is invalid or has been tampered with.
                    </p>
                </>
            )}
            {!status && (
                <>
                    <h1 className="text-2xl font-bold">🤔 Hmm...</h1>
                    <p className="text-muted-foreground mt-2">No status found in the URL.</p>
                </>
            )}
        </div>
    );
}
