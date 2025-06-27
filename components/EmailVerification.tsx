'use client';

import { useUser } from '@/context/user.context';
import { AlertTriangle } from 'lucide-react';

const EmailNotVerifiedNotice = () => {
    const { user } = useUser();

    if (user?.userMetadata.emailVerified) return null;
    return (
        <div className="fixed top-0 left-0 right-0 w-full border-b bg-gradient-to-r backdrop-blur-xl shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center py-4">
                    <div className="h-8 flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-white">
                                Your email is not verified.{' '}
                                <span className="text-white">
                                    Please check your inbox and verify your email address to access all features.
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailNotVerifiedNotice;
