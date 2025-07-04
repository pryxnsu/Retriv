import AxiosInstance from './axiosInstance';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import { resetLocalStorage } from '@/lib/storage';
import { User } from '@/context/user.context';
import { AxiosError } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

const fetchUser = async (): Promise<User> => {
    try {
        const response = await AxiosInstance.get(`/api/v1/user`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch user details');
        }
        return response.data.data;
    } catch (err) {
        const error = err as AxiosError;
        const statusCode = error.response?.status;

        if (error.response && statusCode === 404) {
            throw new Error((error.response.data as AxiosError)?.message || 'User not found');
        }
        if (error.response) {
            throw new Error((error.response.data as AxiosError)?.message || 'Failed to fetch user details');
        } else if (error.request) {
            throw new Error('No response from server. Check your network.');
        } else {
            throw new Error('Unexpected error occurred');
        }
    }
};

const handleLogout = async (
    router: AppRouterInstance,
    queryClient: QueryClient,
    setIsLoggingOut: Dispatch<SetStateAction<boolean>>,
) => {
    try {
        setIsLoggingOut(true);
        const response = await AxiosInstance.post(
            '/api/v1/auth/logout',
            {},
            {
                withCredentials: true,
            },
        );
        if (response.data.success === true) {
            resetLocalStorage('user_fullname');
            resetLocalStorage('user_email');
            queryClient.removeQueries({ queryKey: ['user'] });
            router.push('/login');
            toast(response.data.message);
        }
    } catch (err: unknown) {
        toast.error('Failed to logout. Try again');
        console.error(`Failed to logout ${err}`);
    } finally {
        setIsLoggingOut(false);
    }
};

export { fetchUser, handleLogout };
