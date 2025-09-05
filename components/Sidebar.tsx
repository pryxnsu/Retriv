'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { Bot, Settings2, UserRoundSearch } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { orbitron } from '../lib/fonts/fonts';
import { User, useUser } from '@/context/user.context';
import UserProfile from './UserProfile';
import { handleLogout } from '@/utils/user';
import EmailNotVerifiedNotice from './EmailVerification';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import LogoutOverlay from './LogoutOverlay';

export const item = [
    {
        icon: <Bot />,
        title: 'Agent',
        link: '/agent?tab=insights',
    },
    // {
    //     icon: <Lock />,
    //     title: 'API keys',
    //     link: '/apikeys',
    // },
    {
        icon: <UserRoundSearch />,
        title: 'Query',
        link: '/query?page=1',
    },
    {
        icon: <Settings2 />,
        title: 'Settings',
        link: '/settings',
    },
];

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const queryClient = useQueryClient();
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const { user, isLoading, error } = useUser();

    const isLinkActive = (link: string) => {
        const fullPath = pathname + (searchParams.toString() ? `?${searchParams}` : '');
        return fullPath.split('?')[0].includes(link.split('?')[0]);
    };
    return (
        <>
            {!isLoading && <EmailNotVerifiedNotice />}
            {isLoggingOut && <LogoutOverlay />}
            <nav className="mt-2 flex-1">
                <div className={`flex justify-between px-2 mb-8 ${orbitron.className}`}>
                    <span className="text-2xl font-semibold">Retriv</span>
                </div>
                <UserProfile
                    user={user as User}
                    isLoading={isLoading}
                    error={error}
                    handleLogout={() => handleLogout(router, queryClient, setIsLoggingOut)}
                />
                <ul className="mt-8">
                    {item.map((item) => (
                        <li key={item.title}>
                            <Link
                                href={item.link}
                                className={clsx(
                                    'flex h-10 items-center my-3 gap-2 rounded-lg px-2 text-sm hover:bg-muted',
                                    isLinkActive(item.link) && 'bg-muted font-bold',
                                )}
                            >
                                <div className="text-sm opacity-80">{item?.icon}</div>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}
