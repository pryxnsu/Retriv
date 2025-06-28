import { Suspense } from 'react';
import EmailVerifiedStatus from './_component/status';

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <EmailVerifiedStatus />
            </Suspense>
        </div>
    );
}
