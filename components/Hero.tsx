import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import lightHero from '@/public/hero.png';

export function HeroSection() {
    return (
        <div className="mt-15 sm:mt-20 z-10 w-full px-6 flex justify-center">
            <div className="text-center mb-6 max-w-3xl w-full mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight max-w-3xl mx-auto">
                    Make your website smarter.
                </h1>{' '}
                <p className="text-base sm:text-xl mb-8 max-w-2xl mx-auto">
                    Transform your website content into an intelligent assistant that answers customer questions
                    accurately and instantly.
                </p>
                <div className="flex gap-4 justify-center items-center">
                    <Button
                        asChild
                        variant="default"
                        className="border border-neutral-200 text-base gap-2 h-10 px-6 rounded-lg hover:shadow-sm"
                    >
                        <Link href="/login">
                            Try now
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="hidden sm:block w-11/12 absolute top-[50%]">
                <Image
                    className="w-full rounded-2xl ring-8 ring-neutral-100 dark:ring-neutral-700"
                    src={lightHero}
                    alt="hero-section-img"
                    width={1000}
                    height={1000}
                    priority={false}
                />
            </div>
        </div>
    );
}
