'use client';

import { getLocalStorage, setLocalStorage } from '@/lib/storage';
import AxiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface User {
    id: string;
    email: string;
    userMetadata: {
        name: string;
        avatarUrl: string;
        email: string;
        emailVerified: boolean;
        agentId: string;
        hasSubscription: boolean;
    };
}

interface UserContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface UserProviderProps {
    children: React.ReactNode;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('User must be use in UserProvider');
    }
    return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const fetchUser = useCallback(async () => {
        try {
            const response = await AxiosInstance.get(`/api/v1/user`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.success == true) {
                setUser(response.data.data);
                setIsAuthenticated(true);
                const { name, email } = response.data.data?.userMetadata || {};

                // Set data to local storage
                if (name && !getLocalStorage('user_fullname')) {
                    setLocalStorage('user_fullname', name);
                }
                if (email && !getLocalStorage('user_email')) {
                    setLocalStorage('user_email', email);
                }
            }
        } catch (err) {
            const error = err as AxiosError;

            const errMsg = ((error.response?.data as AxiosError)?.message as string) || 'Something went wrong';

            if (error.response) {
                setError(errMsg || 'Failed to fetch user details');
            } else if (error.request) {
                setError('No response from server. Please check your connection.');
            } else {
                setError('Something went wrong');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);
    return <UserContext.Provider value={{ user, isAuthenticated, isLoading, error }}>{children}</UserContext.Provider>;
};
