'use client';

import Loader from '@/components/Loader';
import NoDataFound from '@/components/NoDataFound';
import AxiosInstance from '@/utils/axiosInstance';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/user.context';
import { getLocalStorage, resetLocalStorage } from '@/lib/storage';
import { AxiosError } from 'axios';
import { Check, Edit3, Mail, User, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Profile() {
    const { user, isLoading, error } = useUser();
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const userEmail: string | null = getLocalStorage('user_email');
    const userFullName: string | null = getLocalStorage('user_fullname');

    const [formData, setFormData] = useState({
        fullName: userFullName,
        email: userEmail,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleReset = () => {
        setFormData({
            fullName: user?.userMetadata.name || '',
            email: user?.email || '',
        });
    };

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            const response = await AxiosInstance.post(
                '/api/v1/user',
                {
                    name: formData.fullName,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                },
            );
            if (response.data.success === true) {
                resetLocalStorage('user_fullname');
                toast.success(response.data.message);
            }
        } catch (err: unknown) {
            const error = err as AxiosError;

            if (error.response) {
                toast.error('Failed to fetch active plan details', {
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
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen">
                <Loader size="30" strokeWidth="2" />
            </div>
        );
    }

    if (error && !isLoading) {
        return <NoDataFound content={error} />;
    }
    return (
        <div className="flex items-center justify-between mx-4 md:mx-26 md:mt-12">
            <div className="w-full">
                <div className="flex items-center gap-3 my-8">
                    <User className="h-6 w-6 " />
                    <h1 className="text-xl font-semibold ">Profile Information</h1>
                </div>

                <div className="mt-6 space-y-4">
                    <div>
                        <Card className="shadow-none border bg-transparent border-neutral-300 dark:border-neutral-800 ">
                            <CardHeader className="flex gap-5 items-center text-center">
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <Avatar className="h-20 w-20  border border-neutral-300 dark:border-neutral-800 shadow-lg">
                                            <AvatarImage src={user?.userMetadata.avatarUrl} />
                                            <AvatarFallback className="text-2xl font-bold">
                                                {user?.userMetadata.name?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                                <div className="text-start">
                                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                                        {user?.userMetadata.name}
                                    </h2>
                                    <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Mail className="h-4 w-4" />
                                        <span className="text-sm">{user?.email}</span>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>

                    <div>
                        <div>
                            <Card className="shadow-none bg-transparent border-neutral-300 dark:border-neutral-800 ">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Edit3 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                            Personal Information
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Update your personal details and contact information
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="fullName"
                                                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                            >
                                                Full Name
                                            </Label>
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                value={formData.fullName || ''}
                                                onChange={handleChange}
                                                className="h-11 border border-neutral-300 dark:border-neutral-800"
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="email"
                                                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                            >
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email || ''}
                                                disabled
                                                className="h-11 border border-neutral-300 dark:border-neutral-800"
                                                placeholder="Enter your email"
                                            />
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Email cannot be changed for security reasons
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-300 dark:border-neutral-800">
                                        <Button
                                            onClick={handleSave}
                                            disabled={formData.fullName === userFullName || isUpdating}
                                            className="shadow-lg hover:shadow-xl transition-all duration-200 h-11 px-6"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2 cursor-pointer"></div>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleReset}
                                            className="h-11 px-6 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-accent cursor-pointer"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Reset
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
