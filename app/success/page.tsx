'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </div>
                <div className="space-y-3 mb-2">
                    <h1 className="text-3xl font-thin text-gray-900">Welcome to Retriv Pro</h1>
                    <p className="text-gray-600 font-thin text-md leading-relaxed">
                        Your subscription is active. Enjoy the full access
                    </p>
                </div>
                <div className="pt-4">
                    <Button
                        onClick={() => router.push('/agent')}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 text-sm font-medium rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
                    >
                        Get started
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
