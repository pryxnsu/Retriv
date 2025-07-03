'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export default function BuySubscription() {
    return (
        <div className="mt-4 flex h-50 flex-col items-center justify-center gap-8">
            <Card className="w-full h-full border-2 border-purple-200 bg-transparent">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                        <Lock className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                        Premium Content
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">Requires active subscription</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Get access to high-usage limits, priority crawling, exclusive insights, and full control over
                        your AI agents.
                    </p>
                    <Link href="/pricing">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white dark:text-white">
                            Unlock Premium
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
