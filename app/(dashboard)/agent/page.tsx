import { Metadata } from 'next';
import { Suspense } from 'react';
import AgentDashboard from '@/components/agent/AgentDashboard';
import { AgentSkeleton } from '@/components/Skeleton/AgentSkeleton';

export const metadata: Metadata = {
    title: 'Agent',
};

export default function Page() {
    return (
        <div className="container my-6 px-6">
            <Suspense fallback={<AgentSkeleton />}>
                <AgentDashboard />
            </Suspense>
        </div>
    );
}
