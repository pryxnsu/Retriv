'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import AxiosInstance from '@/utils/axiosInstance';
import { timeAgo } from '@/helper/time';
import { useUser } from '@/context/user.context';
import NoDataFound from '@/components/NoDataFound';
import Link from 'next/link';
import { AxiosError } from 'axios';
import BuySubscription from '@/components/BuySubscription';
import { useQuery } from '@tanstack/react-query';
import { Clock12 } from 'lucide-react';
import DataUpdatingAlert from '../DataUpdatingAlert';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useSearchParams } from 'next/navigation';
import SkeletonBar from '../Skeleton/skeleton';
import clsx from 'clsx';

interface QueryProp {
    id: string;
    agentId: string;
    userQuery: string;
    time: Date | string;
}

interface FetchQueriesRes {
    queries: QueryProp[];
    totalCount: number;
}

const fetchQueries = async (agentId: string, page: string): Promise<FetchQueriesRes> => {
    try {
        const response = await AxiosInstance.get(`/api/v1/agent/queries/${agentId}?page=${page}`, {
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

const useGetQueries = (
    agentId: string,
    page: string,
): {
    queries: QueryProp[];
    totalCount: number;
    isLoading: boolean;
    error: Error | null;
} => {
    const { data, error, isLoading } = useQuery<FetchQueriesRes, Error>({
        queryKey: [`queries${page}`],
        queryFn: () => fetchQueries(agentId, page as string),
        retry: false,
        enabled: !!agentId,
    });

    return {
        queries: data?.queries || [],
        totalCount: data?.totalCount || 0,
        isLoading,
        error,
    };
};

const getPageItems = (currentPage: number, totalPages: number) => {
    const pages = [];

    if (currentPage >= 3) {
        pages.push(1);
        pages.push('start-ellipsis');
    } else {
        for (let i = 1; i <= Math.min(3, totalPages); i++) {
            pages.push(i);
        }
        if (currentPage < 3) {
            pages.push('start-ellipsis');
        }
    }

    if (currentPage >= 3 && currentPage < totalPages - 2) {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push('end-ellipsis');
    }

    if (currentPage >= totalPages - 2) {
        for (let i = Math.max(totalPages - 2, 4); i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(totalPages);
    }

    return [...new Set(pages)];
};

export default function Queries() {
    const { user } = useUser();
    const agentId = user?.userMetadata?.agentId;

    const searchParams = useSearchParams();
    const currPage = searchParams.get('page');

    const [userHasSubscription, setUserHasSubscription] = useState<boolean | null>(true);
    const { queries, totalCount, isLoading, error } = useGetQueries(agentId as string, currPage as string);

    const totalPages = Math.ceil(totalCount / 8);
    const currentPage = Number(currPage);

    const pagesToRender = getPageItems(currentPage, totalPages);

    // Subscription check logic
    useEffect(() => {
        if (error?.message === 'Access restricted. Please subscribe to a Pro plan to view this data.') {
            setUserHasSubscription(false);
        }
    }, [error]);

    if (error && userHasSubscription) {
        return <NoDataFound content={error.message} />;
    }
    return (
        <div className="flex items-center justify-between mx-4 md:mx-26 md:mt-12">
            <div className="w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4">
                    <div>
                        <p className="font-semibold text-2xl">User queries</p>
                    </div>
                </div>
                {/* Show Data updation message when user has subscription  */}
                <div className={clsx('min-h-13', queries.length == 0 && 'hidden')}>
                    {queries.length > 0 && (
                        <DataUpdatingAlert
                            icon={<Clock12 />}
                            content="We're updating your queries. This may take a few minutes."
                        />
                    )}
                </div>
                <div className="mt-6 min-h-[65vh]">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent cursor-pointer">
                                <TableHead>Query</TableHead>
                                <TableHead className="w-[100px]">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading
                                ? Array.from({ length: 6 }).map((_, idx) => (
                                      <TableRow key={idx} className="text-base hover:bg-transparent cursor-pointer">
                                          <TableCell className="w-full underline decoration-dashed text-ellipsis pr-8 py-4 truncate">
                                              <SkeletonBar />
                                          </TableCell>
                                      </TableRow>
                                  ))
                                : queries.length > 0 &&
                                  queries.map((item: QueryProp) => (
                                      <TableRow key={item.id} className="text-base hover:bg-transparent cursor-pointer">
                                          <TableCell className="underline decoration-dashed text-ellipsis pr-8 py-4 truncate">
                                              <Link href={`/query/${item.id}`}>
                                                  {' '}
                                                  <span className="cursor-pointer">{item.userQuery}</span>
                                              </Link>
                                          </TableCell>
                                          <TableCell className="text-right py-4">
                                              {timeAgo(item.time as Date)}
                                          </TableCell>
                                      </TableRow>
                                  ))}
                        </TableBody>
                    </Table>
                    {/* No Subcription */}
                    {!isLoading && userHasSubscription === false && <BuySubscription />}

                    {/* No query found component  (Subscription Buy) */}
                    {!isLoading && userHasSubscription === true && queries.length === 0 && <NoDataFound />}
                </div>

                {/* Pagination  */}
                {queries.length > 0 && (
                    <div className="mt-auto">
                        <Pagination>
                            <PaginationContent>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={`/query?page=${Math.max(currentPage - 1, 1)}`}
                                                aria-disabled={currentPage === 1}
                                                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                            />
                                        </PaginationItem>

                                        {pagesToRender.map((item, idx) => {
                                            if (item === 'start-ellipsis' || item === 'end-ellipsis') {
                                                return (
                                                    <PaginationItem key={item + idx}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }

                                            return (
                                                <PaginationItem key={item}>
                                                    <PaginationLink
                                                        href={`/query?page=${item}`}
                                                        isActive={currentPage === item}
                                                    >
                                                        {item}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                        <PaginationItem>
                                            <PaginationNext
                                                href={`/query?page=${Math.min(currentPage + 1, totalPages)}`}
                                                aria-disabled={currentPage >= totalPages}
                                                className={
                                                    currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
}
