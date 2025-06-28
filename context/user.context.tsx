'use client';

import { getLocalStorage, setLocalStorage } from '@/lib/storage';
import { fetchUser } from '@/utils/user';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect } from 'react';

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
    const {
        data: user,
        isLoading,
        isError,
        error,
        isSuccess,
    } = useQuery<User, Error>({
        queryKey: ['user'],
        queryFn: fetchUser,
        retry: false,
    });

    const isAuthenticated = !!user;

    useEffect(() => {
        if (isSuccess && user?.userMetadata && (!getLocalStorage('user_fullname') || !getLocalStorage('user_email'))) {
            const { name, email } = user.userMetadata;
            if (name && !getLocalStorage('user_fullname')) {
                setLocalStorage('user_fullname', name);
            }
            if (email && !getLocalStorage('user_email')) {
                setLocalStorage('user_email', email);
            }
        }
    }, [isSuccess, user]);
    return (
        <UserContext.Provider
            value={{ user: user ?? null, isAuthenticated, isLoading, error: isError ? error.message : null }}
        >
            {children}
        </UserContext.Provider>
    );
};
