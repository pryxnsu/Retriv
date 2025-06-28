'use client';

import { Badge } from '@/components/ui/badge';
import AxiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import BuySubscription from '../BuySubscription';
import { Button } from '../ui/button';
import NoDataFound from '../NoDataFound';
import Loader from '../Loader';
import SubscriptionCancelled from '../SubscriptionCancelled';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

export interface ActivePlanProp {
    planId: string;
    name: string;
    price: number;
    currency: string;
    billingPeriod: string;
    userCancelledSubscription: boolean;
}

const fetchUserActivePlan = async (): Promise<ActivePlanProp> => {
    try {
        const response = await AxiosInstance.get('/api/v1/plans/active', {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch active plan details');
        }

        return response.data.data;
    } catch (err: unknown) {
        const error = err as AxiosError;
        const statusCode = error.response?.status;

        if (error.response && statusCode === 402) {
            throw new Error((error.response.data as AxiosError)?.message || 'Subscribe to Pro Plan');
        }

        if (error.response) {
            throw new Error((error.response.data as AxiosError)?.message || 'Failed to fetch active plan details');
        } else if (error.request) {
            throw new Error('No response from server. Check your network.');
        } else {
            throw new Error('Unexpected error occurred');
        }
    }
};

const useFetchUserActivePlan = () => {
    const { data, error, isLoading } = useQuery<ActivePlanProp, Error>({
        queryKey: ['active-plan'],
        queryFn: fetchUserActivePlan,
        retry: false,
    });
    return {
        activePlan: data,
        isLoading,
        userCancelledSubscription: data?.userCancelledSubscription,
        error: error?.message,
    };
};

export default function SettingsBillingTab() {
    const router = useRouter();
    const { activePlan, isLoading, userCancelledSubscription, error } = useFetchUserActivePlan();

    const handleManageSubscription = async () => {
        try {
            const response = await AxiosInstance.get('/api/payment/manage-subscription', {
                withCredentials: true,
            });
            if (response.data.success) {
                router.push(response.data.data.portalUrl);
            }
        } catch (err: unknown) {
            const error = err as AxiosError;

            if (error.response) {
                toast.error('Failed to cancel subscription', {
                    description: (error.response.data as AxiosError)?.message || 'An error occurred',
                });
            } else if (error.request) {
                toast.error('Network error', {
                    description: 'No response from server. Please check your connection.',
                });
            } else {
                toast.error('Unexpected error', {
                    description: error.message,
                });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen">
                <Loader size="30" strokeWidth="2" />
            </div>
        );
    }

    if (error === 'Access restricted. Please subscribe to a Pro plan to view this data.') {
        return <BuySubscription />;
    }

    if (error) {
        return <NoDataFound content={error} />;
    }
    return (
        <div className="my-8 flex flex-col gap-5 px-4">
            {/* Active Plan Display */}
            {!isLoading && activePlan?.name && (
                <>
                    <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{activePlan.name} Plan</p>
                                <p className="text-sm text-muted-foreground">
                                    $ {activePlan.price}/{activePlan.billingPeriod.toLowerCase()}, Billed monthly
                                </p>
                            </div>
                            <Badge>Active</Badge>
                        </div>
                    </div>

                    {/* Manage subscription  */}
                    <Button onClick={handleManageSubscription}>Manage subscription</Button>
                </>
            )}

            {/* Display if the user Cancelled the subscription */}
            {userCancelledSubscription === true && <SubscriptionCancelled />}

            {/* Fallback to show BuySubscription */}
            {userCancelledSubscription === false && !activePlan?.name && <BuySubscription />}
        </div>
    );
}
