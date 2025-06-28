import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
};

export default function Page() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="relative">
                <div className="relative pt-24 pb-12 px-4">
                    <div className="container max-w-3xl mx-auto space-y-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                            <p className="text-neutral-600 dark:text-neutral-400 mt-3">
                                Last updated:{' '}
                                {new Date().toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-12 px-4">
                <div className="container max-w-3xl mx-auto prose dark:prose-invert prose-neutral prose-headings:font-syne prose-p:text-neutral-600 dark:prose-p:text-neutral-400 prose-a:text-neutral-900 dark:prose-a:text-neutral-200 prose-a:no-underline hover:prose-a:text-black dark:hover:prose-a:text-white prose-headings:tracking-tight">
                    <p className="text-lg">
                        At Retriv, your privacy is important to us. This Privacy Policy describes how we collect, use,
                        and protect information when you use our platform to build and embed AI agents powered by your
                        website or documentation content.
                    </p>

                    <h2>Information We Collect</h2>
                    <p>We may collect the following information from you or your users:</p>
                    <ul>
                        <li>
                            <strong>Account Information:</strong> Your name, email address, organization name, and
                            preferences when you register or use our dashboard.
                        </li>
                        <li>
                            <strong>Website Content:</strong> The content we crawl, index, and embed from the URLs you
                            provide (such as help docs or product pages).
                        </li>
                        <li>
                            <strong>Chat Data:</strong> User queries, AI responses, and metadata generated during
                            interactions with embedded agents.
                        </li>
                        <li>
                            <strong>Usage Data:</strong> Information like IP address, browser type, access times, and
                            usage patterns.
                        </li>
                        <li>
                            <strong>Cookies and Similar Technologies:</strong> We may use cookies to improve user
                            experience and track usage trends.
                        </li>
                    </ul>

                    <h2>How We Use Your Information</h2>
                    <p>We use the data collected for the following purposes:</p>
                    <ul>
                        <li>To provide, operate, and improve the Retriv platform</li>
                        <li>To personalize agent behavior and enhance answer relevance</li>
                        <li>To debug issues, analyze performance, and improve the AI experience</li>
                        <li>To communicate updates, respond to support queries, and offer new features</li>
                        <li>To ensure security and prevent abuse of the platform</li>
                    </ul>

                    <h2>Third-Party Services</h2>
                    <p>We use some third-party providers to help us operate effectively:</p>
                    <ul>
                        <li>
                            <strong>Vercel:</strong> For hosting and deploying our frontend dashboard
                        </li>
                        <li>
                            <strong>LLM Providers:</strong> We use models from OpenAI, Anthropic, and other vendors to
                            generate chat responses
                        </li>
                        <li>
                            <strong>Qdrant:</strong> For vector database storage and retrieval of your embedded content
                        </li>
                        <li>
                            <strong>Redis & PostgreSQL:</strong> For managing session state, caching, and persistent
                            storage
                        </li>
                    </ul>

                    <h2>Data Sharing and Disclosure</h2>
                    <p>We do not sell your data. We may share data only when:</p>
                    <ul>
                        <li>It is necessary to operate core features (e.g., AI processing, hosting)</li>
                        <li>Required by law, regulation, or legal request</li>
                        <li>To prevent fraud, abuse, or security threats</li>
                        <li>During a business transaction such as a merger or acquisition</li>
                    </ul>

                    <h2>Data Security</h2>
                    <p>
                        We implement industry-standard practices to protect your data, including encryption in transit,
                        secure cloud storage, and limited access controls. However, no digital system is completely
                        secure.
                    </p>

                    <h2>Your Rights</h2>
                    <p>Depending on your jurisdiction, you may have the right to:</p>
                    <ul>
                        <li>Access or export data we’ve collected</li>
                        <li>Request correction or deletion of your information</li>
                        <li>Withdraw consent or object to data processing</li>
                        <li>Delete crawled content or chat logs associated with your account</li>
                    </ul>

                    <h2>Children’s Privacy</h2>
                    <p>
                        Retriv is not designed for children under 13. We do not knowingly collect data from individuals
                        in this age group. If you believe we have collected such data, please contact us.
                    </p>

                    <h2>Policy Updates</h2>
                    <p>
                        We may update this Privacy Policy from time to time. When we do, we will update the Last updated
                        date at the top of this page. We encourage you to review the policy regularly.
                    </p>

                    <h2>Contact Us</h2>
                    <p>If you have questions about this Privacy Policy or data usage, contact us at:</p>
                    <p>
                        <a href="mailto:hello@retriv.xyz" className="flex items-center gap-1">
                            priyanshu@retriv.xyz <ExternalLink className="h-4 w-4" />
                        </a>
                    </p>

                    <div className="my-8 border-t border-neutral-200 dark:border-neutral-800 pt-8">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            By using Retriv, you agree to our Privacy Policy and our{' '}
                            <Link href="/legal/terms-of-services" className="underline">
                                Terms of Service
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
