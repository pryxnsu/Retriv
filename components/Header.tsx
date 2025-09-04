import Link from 'next/link';
import { orbitron } from '../lib/fonts/fonts';

export function Header() {
    return (
        <header className="w-full bg-background">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
                <Link href="/" className={`flex items-center gap-3 ${orbitron.className}`}>
                    <span className="font-bold text-2xl md:text-3xl">Retriv</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#faq" className="transition-colors text-base">
                        FAQ
                    </Link>
                    <Link href="/pricing" className="transition-colors text-base">
                        Pricing
                    </Link>
                    <Link href="/legal/terms-of-services" className="transition-colors text-base">
                        Terms of Service
                    </Link>
                </nav>
            </div>
        </header>
    );
}
