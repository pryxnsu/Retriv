import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200 dark:border-blue-800 mb-8">
                        <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            AI-Powered Website Assistant
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Make your website smarter.</h1>{' '}
                    <p className="text-gray-800 dark:text-white text-xl mb-8 max-w-2xl mx-auto">
                        Transform your website content into an intelligent assistant that answers customer questions
                        accurately and instantly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {' '}
                        <Link
                            href={'/signup'}
                            className="inline-flex h-11 items-center gap-2 px-3 rounded-lg bg-secondary text-secondary-foreground border border-input hover:border-ring transition-all"
                        >
                            <Button variant="secondary" className="border-none shadow-none text-lg">
                                Try now
                                <ArrowUpRight />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}