import { CheckCircle, Loader2, User } from 'lucide-react';
import { Header } from '@/components/Header';
import MonitorQueries from '@/components/Monitor';
import SetupGuide from '@/components/SetupGuide';
import SkeletonBar from '@/components/Skeleton/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { HeroSection } from '@/components/Hero';

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
        answer: 'We provide a script code to add your agent easily on your website. ',
    },
    {
        number: 4,
        question: 'What if my website changes later?',
        answer: 'Retriv can re-crawl your website and update the AI’s knowledge base whenever you want.',
    },
];

export default function Home() {
    return (
        <main>
            <section className="relative h-[60vh] sm:h-screen sm:min-h-screen rounded-2xl mt-12 mx-auto w-10/12 border border-neutral-300 dark:border-neutral-800">
                <Header />
                <HeroSection />
                <div className="hidden sm:block h-[400px] md:h-[500px] lg:h-[600px]"></div>
            </section>

            <div className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 sm:mt-40">
                <div className="max-w-7xl mx-auto space-y-16 lg:space-y-24">
                    <section className="text-center">
                        <div className="mb-12 lg:mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-balance">
                                Empower your website with AI
                            </h2>
                            <p className="text-base lg:text-lg text-muted-foreground max-w-xl sm:max-w-3xl mx-auto text-pretty">
                                See how Retriv transforms customer interactions with intelligent, context-aware
                                responses
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <Card className="p-3 shadow-md border-neutral-300 dark:border-neutral-800">
                                <div className="p-2 sm:p-4 lg:p-6 space-y-6 lg:space-y-8">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 shadow-sm">
                                                <User className="h-4 w-4 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                User Question
                                            </span>
                                        </div>
                                        <div className="ml-11">
                                            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                                <p className="text-gray-900 dark:text-gray-100 text-left">
                                                    How can I add Retriv to my website?
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 shadow-sm">
                                                <Loader2 className="h-4 w-4 text-white animate-spin" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                AI Processing
                                            </span>
                                        </div>
                                        <div className="ml-11">
                                            <div className="space-y-3">
                                                <SkeletonBar />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 shadow-sm">
                                                <CheckCircle className="h-4 w-4 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                AI Response
                                            </span>
                                        </div>
                                        <div className="ml-11">
                                            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                                <p className="text-gray-900 dark:text-gray-100 mb-4 text-left">
                                                    Here are the simple steps to add Retriv to your website:
                                                </p>
                                                <SetupGuide />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ml-11">
                                        <div className="mb-3">
                                            <p className="text-start text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Sources:
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className="text-gray-700 dark:text-gray-300 border-neutral-300 dark:border-neutral-800">
                                                📚 retriv.xyz
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>
                    <section className="text-center">
                        <div className="mb-12 lg:mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-balance">
                                Monitor User Interactions
                            </h2>
                            <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
                                Get insights into what your customers are asking and how your AI assistant is helping
                                them
                            </p>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <MonitorQueries />
                        </div>
                    </section>
                </div>
            </div>
            <section id="faq" className="py-5 px-4 bg-muted/20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
                        <p className="text-xl text-muted-foreground">Everything you need to know about Retriv</p>
                    </div>

                    <div className="w-full max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="w-full">
                            {Faq.map((item) => (
                                <AccordionItem
                                    key={item.number}
                                    value={`item-${item.number}`}
                                    className=" border-neutral-300 dark:border-neutral-800"
                                >
                                    <AccordionTrigger className="text-base sm:text-lg lg:text-xl font-semibold hover:no-underline cursor-pointer text-foreground text-left">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
