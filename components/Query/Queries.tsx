'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import AxiosInstance from '@/utils/axiosInstance';
import { timeAgo } from '@/helper/time';
import { useUser } from '@/context/user.context';
import NoDataFound from '@/components/NoDataFound';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { AxiosError } from 'axios';
import BuySubscription from '@/components/BuySubscription';
import { useQuery } from '@tanstack/react-query';
import { Clock12 } from 'lucide-react';
import DataUpdatingAlert from '../DataUpdatingAlert';

interface QueryProp {
    id: string;
    agentId: string;
    userQuery: string;
    time: Date | string;
}

const fetchQueries = async (agentId: string): Promise<QueryProp[]> => {
    try {
        const response = await AxiosInstance.get(`/api/v1/agent/queries/${agentId}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch Queries');
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
            throw new Error((error.response.data as AxiosError)?.message || 'Failed to fetch Queries');
        } else if (error.request) {
            throw new Error('No response from server. Check your network.');
        } else {
            throw new Error('Unexpected error occurred');
        }
    }
};

export default function Queries() {
    const { user } = useUser();
    const agentId = user?.userMetadata?.agentId;
    const [userHasSubscription, setUserHasSubscription] = useState<boolean | null>(true);
    const {
        data: queries = [],
        error,
        isLoading,
    } = useQuery<QueryProp[]>({
        queryKey: ['queries'],
        queryFn: () => fetchQueries(agentId as string),
        retry: false,
        enabled: !!agentId,
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
        return <NoDataFound content={error.message} />;
    }
    return (
        <div className="flex items-center justify-between mx-4 md:mx-26 md:mt-12">
            <div className="w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4">
                    <div>
                        <p className="font-semibold text-2xl">User query&apos;s</p>
                    </div>
                </div>
                {/* Show Data updation message when user has subscription  */}
                {queries.length > 0 && (
                    <DataUpdatingAlert
                        icon={<Clock12 />}
                        content="We're updating your queries. This may take a few minutes."
                    />
                )}
                {/* Body  */}
                <div className="mt-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent cursor-pointer">
                                <TableHead>Query</TableHead>
                                <TableHead className="w-[100px]">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <div className="flex justify-center items-center py-4">
                                            <Loader size="30" strokeWidth="2" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                queries.length > 0 &&
                                queries.map((item: QueryProp) => (
                                    <TableRow key={item.id} className="text-base hover:bg-transparent cursor-pointer">
                                        <TableCell className="underline decoration-dashed text-ellipsis pr-8 py-4 truncate">
                                            <Link href={`/query/${item.id}`}>
                                                {' '}
                                                <span className="cursor-pointer">{item.userQuery}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right py-4">{timeAgo(item.time as Date)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* No Subcription */}
                    {!isLoading && userHasSubscription === false && <BuySubscription />}

                    {/* No query found component  (Subscription Buy) */}
                    {!isLoading && userHasSubscription === true && queries.length === 0 && <NoDataFound />}
                </div>
            </div>
        </div>
    );
}
