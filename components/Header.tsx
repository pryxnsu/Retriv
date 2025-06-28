import Link from 'next/link';
import { orbitron } from '../lib/fonts/fonts';

export function Header() {
    return (
        <header className="sticky top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-between px-6 py-4 bg-[#F9F6F0] dark:bg-black border-b">
                <div className="flex items-center gap-2">
                    <Link href="/" className={`flex items-center gap-3 ${orbitron.className}`}>
                        <span className="font-bold text-2xl">Retriv</span>
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#faq" className="text-base transition-colors">
                        Faq
                    </Link>
                    <Link href="/pricing" className="text-base transition-colors">
                        Pricing
                    </Link>
                    <Link href="/legal/terms-of-services" className="text-base transition-colors">
                        Terms
                    </Link>
                </nav>
            </div>
        </header>
    );
}
