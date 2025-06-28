import type { Metadata } from 'next';
import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { inter } from '@/lib/fonts/fonts';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '../components/providers/themeProvider';
import GoogleProviderWrapper from '../components/providers/googleProvider';
import { ThemeWatcher } from '@/components/ThemeWatcher';
import { QueryProvider } from '@/components/providers/queryClientProvider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    metadataBase: new URL('https://www.retriv.xyz'),
    title: {
        default: 'Retriv',
        template: '%s | Retriv',
    },
    description: 'Build and embed AI chat agents that answer from your website content. No code required.',
    keywords: ['AI chatbot', 'website assistant', 'no-code chatbot', 'Retriv'],
    openGraph: {
        title: 'Retriv | AI Agents for Your Website',
        description: 'Build and embed AI chat agents that answer from your website content. No code required.',
        url: 'https://www.retriv.xyz',
        siteName: 'Retriv',
        images: [
            {
                url: 'https://retriv.xyz/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Retriv | AI Agents for Your Website',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Retriv | AI Agents for Your Website',
        description: 'Add a smart chat agent to your site in minutes. Powered by your content.',
        images: ['https://retriv.xyz/twitter-card.png'],
    },
    alternates: {
        canonical: 'https://www.retriv.xyz',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}>
                <QueryProvider>
                    <GoogleProviderWrapper>
                        <ThemeProvider>
                            <ThemeWatcher />
                            {children}
                            <Toaster />
                        </ThemeProvider>
                    </GoogleProviderWrapper>
                </QueryProvider>
            </body>
        </html>
    );
}
