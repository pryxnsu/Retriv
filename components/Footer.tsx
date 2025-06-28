import Link from 'next/link';
import { orbitron } from '../lib/fonts/fonts';

export default function Footer() {
    return (
        <footer className="relative py-10 mt-10">
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent" />

            <div className="container max-w-3xl mx-auto px-4 pt-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                        <Link href="/" className="flex items-center gap-2">
                            <span className={`text-xl font-bold ${orbitron.className}`}>Retriv</span>
                        </Link>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2 mt-1 ">
                            © {new Date().getFullYear()} Retriv by Priyanshu Kumar
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
                        <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                            Home
                        </Link>
                        <Link
                            href="/legal/terms-of-services"
                            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                        >
                            Terms
                        </Link>
                        <Link
                            href="/legal/privacy-policy"
                            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                        >
                            Privacy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
