'use client';

import AxiosInstance from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';
import { CreateAgentForm } from './CreateAgentForm';
import { AgentDetails } from './AgentDetails';
import { ArrowRight, Bot, Globe, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import NoDataFound from '../NoDataFound';
import AgentPreparing from '../AgentPreparing';
import Loader from '../Loader';

export interface AgentProps {
    id: string;
    name: string;
    userId: string;
    sourceUrl: string;
    status: 'Running' | 'Error' | 'Pending';
    metadata: {
        sourceSubUrls: string[];
    };
    totalQueries: number;
    thisMonthQueries: number;
    avgResponseTime: string;
    lastUpdated: Date;
}

const cardData = [
    {
        icon: <Globe className="h-5 w-5 text-emerald-600" />,
        heading: 'Website Crawler',
        description: 'Automatically crawls your website to gather information and learn about your content.',
        bgColor: 'emerald-100',
    },
    {
        icon: <Sparkles className="h-5 w-5 text-amber-600" />,
        heading: 'AI-Powered',
        description: 'Uses advanced AI to understand your content and provide helpful responses to visitors.',
        bgColor: 'amber-100',
    },
    {
        icon: <ArrowRight className="h-5 w-5 text-sky-600" />,
        heading: 'Easy Integration',
        description: 'Simple to set up and integrate with your existing website with minimal configuration.',
        bgColor: 'sky-100',
    },
];

const bgColorMap: Record<string, string> = {
    'emerald-100': 'bg-emerald-100',
    'amber-100': 'bg-amber-100',
    'sky-100': 'bg-sky-100',
};

interface AgentResponse {
    success: boolean;
    data: AgentProps;
    message: string;
    statusCode: number;
}

const fetchAgent = async (): Promise<AgentResponse> => {
    try {
        const response = await AxiosInstance.get('/api/v1/agent', {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch Agent');
        }
        return response.data;
    } catch (err) {
        const error = err as AxiosError;
        if (error.response) {
            throw new Error((error.response.data as AxiosError)?.message || 'Failed to fetch Agent');
        } else if (error.request) {
            throw new Error('No response from server. Check your network.');
        } else {
            throw new Error('Unexpected error occurred');
        }
    }
};

const useGetAgent = (): {
    agentPreparingMsg: string | null;
    agent: AgentProps | undefined;
    isLoading: boolean;
    error: Error | null;
} => {
    const { data, error, isLoading } = useQuery<AgentResponse, Error>({
        queryKey: ['agent'],
        queryFn: fetchAgent,
        retry: false,
    });
    return {
        agentPreparingMsg: data?.statusCode === 202 ? data.message : null,
        agent: data?.data as AgentProps,
        isLoading,
        error,
    };
};

export default function AgentDashboard() {
    const { agentPreparingMsg, agent, isLoading, error } = useGetAgent();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [agentStatus, setAgentStatus] = useState<'Running' | 'Error' | 'Pending'>();

    useEffect(() => {
        setAgentStatus(agent?.status);
    }, [agent?.status]);

    if (isLoading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <Loader strokeWidth="2" size="30" />
            </div>
        );
    }

    if (error) {
        return <NoDataFound content={error.message} />;
    }

    if (typeof agentPreparingMsg === 'string' && agentPreparingMsg?.trim() !== '' && !agent) {
        return <AgentPreparing message={agentPreparingMsg} />;
    }

    if (agent && !isLoading) {
        return <AgentDetails agent={agent as AgentProps} />;
    }
    return (
        <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-4">
            <div className="max-w-3xl w-full text-center space-y-8">
                <div className="relative">
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-40 h-40 bg-violet-100 rounded-full blur-3xl opacity-30" />
                    <div className="relative">
                        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-6">
                            <Bot className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                            Register your Agent
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-neutral-200  max-w-2xl mx-auto">
                            You haven&apos;t created an agent yet. Create one to help visitors navigate your website.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {cardData.map((item, idx) => (
                        <div key={idx} className="bg-white dark:bg-muted p-6 rounded-xl shadow-lg">
                            <div className={`${bgColorMap[item.bgColor]} p-2 rounded-lg w-fit mb-4`}>{item.icon}</div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.heading}</h3>
                            <p className="text-slate-600 dark:text-white text-sm">{item.description}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-12">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                disabled={agentStatus == 'Pending'}
                                size="lg"
                                className="bg-[#556B2F] hover:bg-[#4A5F25] text-white px-8 py-6 rounded-lg text-lg font-medium cursor-pointer"
                            >
                                {agentStatus == 'Pending' ? 'Your agent is getting prepared' : 'Create your agent'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md dark:bg-muted">
                            <DialogTitle></DialogTitle>
                            <CreateAgentForm onSuccess={() => setIsDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>
                    <p className="text-sm text-slate-500 mt-4">
                        Your agent will help visitors find information on your website more efficiently.
                    </p>
                </div>
            </div>
        </div>
    );
}
