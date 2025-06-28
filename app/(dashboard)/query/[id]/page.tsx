'use client';

import AxiosInstance from '@/utils/axiosInstance';
import Loader from '@/components/Loader';
import NoDataFound from '@/components/NoDataFound';
import { MarkdownRenderer } from '@/components/Markdown';
import { Badge } from '@/components/ui/badge';
import { timeAgo } from '@/helper/time';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import { ParamValue } from 'next/dist/server/request/params';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BuySubscription from '@/components/BuySubscription';

interface QueryDetailProp {
    id: string;
    agentId: string;
    userQuery: string;
    metadata: string;
    responseTime: string;
    createdAt: Date | string;
}

const fetchQueryDetails = async (id: ParamValue): Promise<QueryDetailProp> => {
    try {
        const response = await AxiosInstance.get(`/api/v1/agent/query/${id}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch Query details');
        }

        return response.data.data;
    } catch (err: unknown) {
        const error = err as AxiosError;
        const statusCode = error.response?.status;

        // Payment required for subscription
        if (error.response && statusCode === 402) {
            throw new Error((error.response.data as AxiosError)?.message || 'Subscribe to Pro Plan');
        }
        if (error.response) {
            throw new Error((error.response.data as AxiosError)?.message || 'Failed to fetch Query details');
        } else if (error.request) {
            throw new Error('No response from server. Check your network.');
        } else {
            throw new Error('Unexpected error occurred');
        }
    }
};

export default function Page() {
    const { id: queryId } = useParams();
    const router = useRouter();
    const [userHasSubscription, setUserHasSubscription] = useState<boolean | null>(true);
    const {
        data: query,
        error,
        isLoading,
    } = useQuery<QueryDetailProp, Error>({
        queryKey: ['query-details'],
        queryFn: () => fetchQueryDetails(queryId as ParamValue),
        retry: false,
        enabled: !!queryId,
    });

    // Subscription check logic
    useEffect(() => {
        if (error?.message === 'Access restricted. Please subscribe to a Pro plan to view this data.') {
            setUserHasSubscription(false);
        }
    }, [error]);

    if (isLoading) {
        return (
            <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen">
                <Loader size="30" strokeWidth="2" />
            </div>
        );
    }

    if (error && userHasSubscription) {
        return <NoDataFound content={error?.message as string} />;
    }

    const agentResponse = JSON.parse(query?.metadata || '{}');
    return (
        <>
            <div className="pb-10">
                <div className="max-w-5xl mx-auto px-4">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 gap-4 py-8">
                        <div className="flex items-center gap-4">
                            <div className="mr-3 cursor-pointer" onClick={() => router.back()}>
                                <ArrowLeft />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">Query Details</p>
                            </div>
                        </div>
                    </div>

                    {/* Query Details */}
                    {query && (
                        <>
                            <div className="flex flex-wrap pb-8">
                                <div className="mt-3 flex w-full flex-col gap-2 md:basis-1/3">
                                    <p className="uppercase text-sm">Response time</p>
                                    <Badge className="text-green-100 bg-green-800">
                                        {query?.responseTime as string}s
                                    </Badge>
                                </div>
                                <div className="mt-3 flex w-full flex-col gap-2 md:basis-1/3">
                                    <p className="uppercase text-sm">Creation Date</p>
                                    <span className="mt-1 text-sm text-slate-12">
                                        {timeAgo(query?.createdAt as Date)}
                                    </span>
                                </div>
                            </div>

                            <p className="text-xl font-semibold ml-1 mb-2">User query</p>
                            <div className="border rounded-lg p-4 bg-muted">
                                <MarkdownRenderer content={query?.userQuery ?? ''} />
                            </div>

                            {/* Response and Request Body  */}
                            <div className="mt-9">
                                <p className="text-xl font-semibold ml-1 mb-2">Response data</p>
                                <div className="border rounded-lg p-4 bg-muted">
                                    <MarkdownRenderer content={agentResponse.response} />
                                </div>
                            </div>
                        </>
                    )}
                    {!isLoading && userHasSubscription === false && <BuySubscription />}
                </div>
            </div>
        </>
    );
}
