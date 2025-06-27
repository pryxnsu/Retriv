'use client';

import Loader from '@/components/Loader';
import { MarkdownRenderer } from '@/components/Markdown';
import NoDataFound from '@/components/NoDataFound';
import { Badge } from '@/components/ui/badge';
import { timeAgo } from '@/helper/time';
import AxiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import { ParamValue } from 'next/dist/server/request/params';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface QueryDetailProp {
    id: string;
    agentId: string;
    userQuery: string;
    metadata: string;
    responseTime: string;
    createdAt: Date | string;
}

const useFetchQueryDetails = (id: ParamValue) => {
    const [data, setData] = useState<QueryDetailProp>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AxiosInstance.get(`/api/v1/agent/query/${id}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data.success === true) {
                    setData(response.data.data);
                }
            } catch (err: unknown) {
                const error = err as AxiosError;

                const statusCode = error.response?.status;
                const errMsg = ((error.response?.data as AxiosError)?.message as string) || 'Something went wrong';

                if (error.response || statusCode === 404) {
                    setError(errMsg || 'Failed to fetch query details');
                } else if (error.request) {
                    setError('No response from server. Please check your connection.');
                } else {
                    setError('Something went wrong');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    return {
        query: data,
        isLoading,
        error,
    };
};

export default function Page() {
    const { id: queryId } = useParams();
    const router = useRouter();

    const { query, isLoading, error } = useFetchQueryDetails(queryId);

    if (isLoading) {
        return (
            <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen">
                <Loader size="30" strokeWidth="2" />
            </div>
        );
    }

    if (error || !query) {
        return <NoDataFound content={error as string} />;
    }

    const agentResponse = JSON.parse(query?.metadata);
    return (
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
                <div className="flex flex-wrap pb-8">
                    <div className="mt-3 flex w-full flex-col gap-2 md:basis-1/3">
                        <p className="uppercase text-sm">Response time</p>
                        <Badge className="text-green-100 bg-green-800">{query.responseTime as string}s</Badge>
                    </div>
                    <div className="mt-3 flex w-full flex-col gap-2 md:basis-1/3">
                        <p className="uppercase text-sm">Creation Date</p>
                        <span className="mt-1 text-sm text-slate-12">{timeAgo(query?.createdAt as Date)}</span>
                    </div>
                </div>

                <p className="text-xl font-semibold ml-1 mb-2">User query</p>
                <div className="border rounded-lg p-4 bg-muted">
                    <MarkdownRenderer content={query.userQuery} />
                </div>

                {/* Response and Request Body  */}
                <div className="mt-9">
                    <p className="text-xl font-semibold ml-1 mb-2">Response data</p>
                    <div className="border rounded-lg p-4 bg-muted">
                        <MarkdownRenderer content={agentResponse.response} />
                    </div>
                </div>
            </div>
        </div>
    );
}
