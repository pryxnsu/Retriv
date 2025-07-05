'use client';

import { CheckCircle, Loader2, User } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/Hero';
import MonitorQueries from '@/components/Monitor';
import SetupGuide from '@/components/SetupGuide';
import SkeletonBar from '@/components/Skeleton/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import Footer from '@/components/Footer';

const Faq = [
    {
        number: 1,
        question: 'What is Retriv ?',
        answer: 'Retriv is a platform that lets you create an AI agent for your website, allowing it to respond to user queries based on your website’s content.',
    },
    {
        number: 2,
        question: 'How does Retriv work?',
        answer: 'Retriv automatically crawls and indexes your website pages, then uses that content to generate accurate responses to user queries.',
    },
    {
        number: 3,
        question: 'How do I integrate the agent into my website?',
        answer: 'We provide a simple embed code or API to add your agent easily on you website. ',
    },
    {
        number: 4,
        question: 'What if my website changes later?',
        answer: 'Retriv can re-crawl your website and update the AI’s knowledge base whenever you want.',
    },
];

export default function Home() {
    return (
        <>
            <div className="min-h-screen bg-[#F9F6F0] dark:bg-black">
                <Header />

                <main>
                    {/* Hero Section */}
                    <HeroSection />

                    {/* Features Section */}
                    <section className="py-32 px-4 bg-gradient-to-b from-[#F9F6F0] to-[#eee9dd] dark:from-black dark:to-gray-950">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-20">
                                <h2 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Your Personal AI Assistant
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                                    See how Retriv transforms customer interactions with intelligent, context-aware
                                    responses
                                </p>
                            </div>

                            {/* AI Demo Card */}
                            <div className="max-w-5xl mx-auto">
                                <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
                                    <div className="px-6 py-2 space-y-8">
                                        {/* User Query */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                                                    <User className="h-5 w-5 text-white" />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                                    Customer Question
                                                </span>
                                            </div>
                                            <div className="ml-14">
                                                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                                    <p className="text-lg text-gray-900 dark:text-white font-medium">
                                                        How can I add Retriv to my website?
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Processing */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                                                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                                    AI Processing
                                                </span>
                                            </div>
                                            <div className="ml-14">
                                                <div className="space-y-3">
                                                    <SkeletonBar />
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        Analyzing your website content...
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Response */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                                                    <CheckCircle className="h-5 w-5 text-white" />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                                    AI Response
                                                </span>
                                            </div>
                                            <div className="ml-14">
                                                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4">
                                                    <p className="text-lg text-gray-900 dark:text-white mb-4">
                                                        Here are the simple steps to add Retriv to your website:
                                                    </p>
                                                    <SetupGuide />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sources */}
                                        <div className="ml-14">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    Sources:
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                                >
                                                    📚 retriv.xyz
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                                >
                                                    🚀 retriv.xyz
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* Monitor Section */}
                    <section className="py-32 px-4  dark:from-gray-950 dark:to-black">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-20">
                                <h2 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Monitor User Interactions
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                                    Get insights into what your customers are asking and how your AI assistant is
                                    helping them
                                </p>
                            </div>
                            <div className="max-w-4xl mx-auto">
                                <MonitorQueries />
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section id="faq" className="py-32 px-4  dark:from-black dark:to-gray-950">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-20">
                                <h2 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Frequently Asked Questions
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400">
                                    Everything you need to know about Retriv
                                </p>
                            </div>

                            <div className="w-fit px-3 mx-auto flex justify-center items-center">
                                <Accordion type="single" collapsible className="sm:w-2xl">
                                    {Faq.map((item) => (
                                        <AccordionItem key={item.number} value={`item-${item.number}`}>
                                            <AccordionTrigger className="text-xl font-semibold sm:max-w-2xl hover:no-underline cursor-pointer">
                                                {item.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-typography-weak">
                                                {item.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <Footer />
            </div>

            <Toaster />
        </>
    );
}
