import { Metadata } from 'next';
import { Suspense } from 'react';
import AgentDashboard from '@/components/agent/AgentDashboard';
import Loader from '@/components/Loader';

export const metadata: Metadata = {
    title: 'Agent',
};

export default function Page() {
    return (
        <div className="container my-6 px-6">
            <Suspense
                fallback={
                    <div className="h-screen flex justify-center items-center">
                        <Loader strokeWidth="2" size="30" />
                    </div>
                }
            >
                <AgentDashboard />
            </Suspense>
        </div>
    );
}
