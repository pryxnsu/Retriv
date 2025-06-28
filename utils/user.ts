import AxiosInstance from './axiosInstance';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import { resetLocalStorage } from '@/lib/storage';
import { User } from '@/context/user.context';
import { AxiosError } from 'axios';

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

const handleLogout = async (router: AppRouterInstance) => {
    try {
        const response = await AxiosInstance.post(
            '/api/v1/auth/logout',
            {},
            {
                withCredentials: true,
            },
        );
        if (response.data.success === true) {
            router.push('/login');
            resetLocalStorage('user_fullname');
            resetLocalStorage('user_email');

            toast(response.data.message);
        }
    } catch (err: unknown) {
        console.error(err);
    }
};

export { fetchUser, handleLogout };
