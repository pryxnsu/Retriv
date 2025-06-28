'use client';

import { CheckCircle, Loader2, Sparkles, User } from 'lucide-react';
import Footer from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/Hero';
import MonitorQueries from '@/components/Monitor';
import SetupGuide from '@/components/SetupGuide';
import SkeletonBar from '@/components/Skeleton/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

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
            <div className="bg-[#F9F6F0] dark:bg-black">
                <Header />
                <main className="min-h-screen">
                    <HeroSection />

                    {/* Features  */}
                    <section className="bg-white dark:bg-[#0C0C0C] px-4 border-y border-border py-24">
                        <div>
                            <p className="text-4xl sm:text-5xl font-semibold text-start sm:text-center mb-12">
                                Retrieve your personal assistant
                            </p>
                        </div>
                        <div>
                            <div className="mx-auto max-w-4xl">
                                <Card className="border-neutral-400 dark:border-neutral-800 bg-muted/20 backdrop-blur-sm p-0 gap-0">
                                    {/* Header */}
                                    <div className="flex items-center gap-3 border-b border-neutral-400 dark:border-neutral-800 p-4">
                                        <div className="flex items-center gap-2 text-black dark:text-slate-300">
                                            <Sparkles className="h-4 w-4" />
                                            <span className="font-medium">Your personal assistant</span>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Query Section */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                                                    <User className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-sm font-medium text-black dark:text-slate-300">
                                                    User asked
                                                </span>
                                            </div>
                                            <div className="ml-11">
                                                <p className="text-lg text-black dark:text-slate-300 leading-relaxed">
                                                    How can i add Retriv on my website ?
                                                </p>
                                            </div>
                                        </div>

                                        {/* Processing Section */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600">
                                                    <Loader2 size={17} className="text-white animate-spin" />
                                                </div>
                                                <span className="text-sm font-medium text-black dark:text-slate-300">
                                                    Analysis
                                                </span>
                                            </div>
                                            <div className="ml-11 space-y-2">
                                                <SkeletonBar />
                                            </div>
                                        </div>

                                        {/* Response Section */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-sm font-medium text-black dark:text-slate-300">
                                                    Response...
                                                </span>
                                            </div>
                                            <div className="ml-11">
                                                <p className="text-black dark:text-slate-300 leading-relaxed">
                                                    Here is the simple steps to setup Retriv on your website.
                                                </p>
                                                <SetupGuide />
                                            </div>
                                        </div>

                                        {/* Sources */}
                                        <div className="ml-11">
                                            <div className="flex flex-wrap gap-2">
                                                {['retriv.xyz'].map((item, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="secondary"
                                                        className="text-slate-900 dark:text-slate-200"
                                                    >
                                                        {item}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* Monitor  */}
                    <section className="px-4 py-24 border-b rounded-3xl mx-auto sm:py-24 max-w-5xl md:max-w-7xl">
                        <div>
                            <p className="px-2 text-4xl sm:text-5xl font-semibold text-start mb-12 mx-auto">
                                Monitor your user&apos;s queries!
                            </p>
                        </div>
                        <MonitorQueries />
                    </section>

                    {/* FAQ  */}
                    <section id="faq" className="w-full mx-auto py-24 px-2">
                        <p className="px-2 sm:mx-auto w-full text-4xl sm:text-5xl font-semibold text-start sm:text-center mb-8">
                            Frequenly asked questions
                        </p>
                        <div className="w-fit px-3 mx-auto flex justify-center items-center">
                            <Accordion type="single" collapsible className="sm:w-2xl">
                                {Faq.map((item) => (
                                    <AccordionItem key={item.number} value={`item-${item.number}`}>
                                        <AccordionTrigger className="text-xl font-semibold sm:max-w-2xl  hover:no-underline cursor-pointer">
                                            {item.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-typography-weak">
                                            {item.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
}
