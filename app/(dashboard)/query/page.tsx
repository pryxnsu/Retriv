import { Metadata } from 'next';
import Queries from '@/components/Query/Queries';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Query',
};

export default function Page() {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Queries />
            </Suspense>
        </>
    );
}
