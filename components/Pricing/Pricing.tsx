'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getLocalStorage } from '@/lib/storage';
import AxiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Loader from '../Loader';
import NoDataFound from '../NoDataFound';

interface PlanProps {
    id: string;
    name: string;
    price: number;
    description: string;
    isPopular: boolean;
    billingPeriod: string;
    features: string[];
}

const freePlan = {
    id: 'free',
    name: 'Free',
    price: 0,
    billingPeriod: 'month',
    description: 'Perfect for getting started',
    isPopular: false,
    features: ['300 queries per month', 'Crawl and Index up to 20 Pages per Agent', 'Standard support'],
};

const fetchPlans = async (): Promise<PlanProps[]> => {
    try {
        const response = await AxiosInstance.get('/api/v1/plans', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch plans');
        }

        return response.data.data;
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error.response) {
            throw new Error((error.response.data as AxiosError)?.message || 'Failed to fetch plans');
        } else if (error.request) {
            throw new Error('No response from server. Check your network.');
        } else {
            throw new Error('Unexpected error occurred');
        }
    }
};

export default function Pricing() {
    const router = useRouter();
    const {
        data: plans,
        error,
        isLoading,
    } = useQuery<PlanProps[], Error>({
        queryKey: ['plans'],
        queryFn: fetchPlans,
        retry: false,
        select: (data) => [freePlan, ...data],
    });

    const handleCheckout = async (planId: string) => {
        const customerEmail = getLocalStorage('user_email');
        const customerName = getLocalStorage('user_fullname');
        try {
            const res = await AxiosInstance.post(
                `/api/payment/checkout`,
                {
                    planId: planId,
                    customerEmail,
                    customerName,
                },
                {
                    withCredentials: true,
                },
            );
            if (res.data.success) {
                router.push(res.data.data.url);
            }
        } catch (err: unknown) {
            console.error(err);
        }
    };

    if (isLoading && !plans) {
        return (
            <div className="flex h-90 justify-center items-center">
                <Loader size="30" strokeWidth="2" />
            </div>
        );
    }

    if (error) {
        return <NoDataFound content={error.message} />;
    }
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="relative">
                <div className="relative pt-18 pb-8 px-4">
                    <div className="container max-w-3xl mx-auto space-y-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight">Pricing</h1>
                            <p className="text-neutral-600 dark:text-neutral-400 mt-3">
                                Smarter Tools. Smarter Pricing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12 px-4">
                <div className="container max-w-4xl mx-auto">
                    <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                        {plans?.map((plan: PlanProps) => (
                            <Card
                                key={plan.id}
                                className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ₹{
                                    plan.isPopular ? 'ring-2 ring-primary shadow-lg scale-105' : 'hover:shadow-md'
                                }`}
                            >
                                {plan.isPopular && (
                                    <div className="absolute top-4 right-4">
                                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                            Popular
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="pb-8 pt-8">
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold tracking-tight">{plan.name}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {plan.description}
                                        </p>

                                        <div className="space-y-2">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-bold tracking-tight">${plan.price}</span>
                                                <span className="text-muted-foreground text-sm">
                                                    /{plan.billingPeriod}
                                                </span>
                                            </div>
                                            {plan.isPopular && (
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                                    Cancel Anytime
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm">Features included</h4>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-3">
                                                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-muted-foreground leading-relaxed">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Button
                                        onClick={() => handleCheckout(plan.id)}
                                        className="w-full mt-8 group cursor-pointer"
                                        variant={plan.isPopular ? 'default' : 'outline'}
                                        disabled={!plan.isPopular}
                                    >
                                        {plan.isPopular ? 'Upgrade to Retriv Pro' : 'Current plan'}
                                        {plan.isPopular && (
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
