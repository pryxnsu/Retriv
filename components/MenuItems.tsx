'use client';

import Link from 'next/link';
import clsx from 'clsx';
import UserProfile from './UserProfile';
import { Separator } from '@/components/ui/separator';
import { User, useUser } from '@/context/user.context';
import { handleLogout } from '@/utils/user';
import { usePathname, useRouter } from 'next/navigation';
import { item } from './Sidebar';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import LogoutOverlay from './LogoutOverlay';

interface MobileMenuItemsProps {
    onItemClick: () => void;
}

export default function MobileMenuItems({ onItemClick }: MobileMenuItemsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const { user, isLoading, error } = useUser();
    return (
        <div className="fixed bg-[#F9F6F0] dark:bg-black h-full w-full z-50 overflow-hidden">
            {isLoggingOut && <LogoutOverlay />}
            <div className="my-6 mx-8">
                <h3 className="text-sm font-semibold text-black/60 dark:text-white/60 uppercase tracking-wider">
                    Navigation
                </h3>
            </div>
            <ul className="mx-6">
                {item.map((item) => (
                    <li key={item.title} onClick={onItemClick}>
                        <Link
                            href={item.link}
                            className={clsx(
                                'flex h-10 items-center my-2 gap-2 rounded-md px-2 text-sm hover:bg-[#F5F5F7] dark:hover:bg-muted',
                                pathname.includes(item.link) && 'bg-[#F5F5F7] dark:bg-muted font-bold',
                            )}
                        >
                            <div className="text-sm opacity-80">{item?.icon}</div>
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Separator */}
            <div className="mx-6 my-6">
                <Separator className="bg-black/10 dark:bg-white/10" />
            </div>

            {/* User Profile Section */}
            <div className="px-6 pb-6">
                <div className="mb-3">
                    <h3 className="text-sm font-semibold text-black/60 dark:text-white/60 uppercase tracking-wider">
                        Account
                    </h3>
                </div>
                <UserProfile
                    user={user as User}
                    isLoading={isLoading}
                    error={error}
                    handleLogout={() => handleLogout(router, queryClient, setIsLoggingOut)}
                />
            </div>
        </div>
    );
}
