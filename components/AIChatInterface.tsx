'use client';

import { z } from 'zod';
import Link from 'next/link';
import { inter } from '@/lib/fonts/fonts';
import { RefObject } from 'react';
import { ChatInputSchema } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Sparkles, SendHorizontal, Info, User, Brain } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { MarkdownRenderer } from './Markdown';
import SkeletonBar from './Skeleton/skeleton';
import ErrorMessage from './ChatErrorMessage';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    sources?: string[];
}

interface AIChatInterfaceProps {
    chatData: ChatMessage[];
    isLoading: boolean;
    isStreaming: boolean;
    error: string | null;
    form: UseFormReturn<z.infer<typeof ChatInputSchema>>;
    onSubmit: (data: z.infer<typeof ChatInputSchema>) => void;
    exampleQuestions?: [];
    name?: string | null;
    query: string;
    RETRIV_URL: string;
    inputRef: RefObject<HTMLTextAreaElement | null>;
    messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function AIChatInterface({
    chatData,
    isLoading,
    isStreaming,
    error,
    form,
    name,
    onSubmit,
    exampleQuestions,
    query,
    RETRIV_URL,
    inputRef,
    messagesEndRef,
}: AIChatInterfaceProps) {
    const handleExampleClick = (question: string) => {
        form.setValue('query', question);
        form.handleSubmit(onSubmit)();
    };

    const showWelcomeScreen = chatData.length <= 1 && !isLoading && !error;
    return (
        <div
            className={`${inter.className} backdrop-blur-xs p-4 md:p-8 fixed inset-0 flex justify-center items-start z-[99999] animate-fade-in`}
        >
            <style jsx global>{`
                html,
                body {
                    margin: 0;
                    padding: 0;
                    background: #fff2;
                }
            `}</style>

            <div className="px-5 py-1 flex flex-col border border-gray-200 dark:border-muted shadow-xl rounded-md w-full bg-white dark:bg-[#212121] max-w-screen h-[84vh]  md:w-[min(600px,100%)] lg:w-[min(720px,100%)] 2xl:w-[min(760px,100%)] z-[99999]">
                {/* Header with Navigation */}
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-neutral-800 z-50">
                    <div className="flex items-center gap-2">
                        <div className="text-neutral-500 text-sm">Ask AI</div>
                        <div className="relative group">
                            <Info className="h-4 w-4 text-neutral-400" />
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                This may produce wrong information.
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs bg-transparent border-neutral-600 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                        >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Ask AI
                        </Button>
                    </div>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 min-h-0">
                    {showWelcomeScreen ? (
                        /* Welcome Screen */
                        <div className="h-full flex flex-col py-3 px-5">
                            <div className="space-y-6">
                                {/* AI Avatar and Welcome Message */}
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                                        <AssistantIcon />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-neutral-200 text-[15px] leading-relaxed">
                                            Hey there! I’m {name}, an AI assistant trained on docs and help content.
                                            What can I help you with today?
                                        </p>
                                    </div>
                                </div>

                                {/* Example Questions */}
                                <div className="space-y-4">
                                    <div className="text-neutral-400 text-sm font-medium tracking-wide uppercase">
                                        Example Questions
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {exampleQuestions?.map((question, index) => (
                                            <div
                                                key={index}
                                                className="relative p-[1px] rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    className="w-fit h-auto px-3 py-2 text-left justify-start bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors rounded-lg border-0"
                                                    onClick={() => handleExampleClick(question)}
                                                >
                                                    {question}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Chat Messages */
                        chatData.length > 0 && (
                            <ScrollArea className="h-full rounded-xl px-5">
                                <div className="space-y-4">
                                    {chatData.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`space-y-3 py-5 ${item.role === 'user' && 'border-y border-neutral-200 dark:border-neutral-800'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-start justify-center w-8 h-8 rounded-full">
                                                    {item.role === 'user' ? <UserIcon /> : <AssistantIcon />}
                                                </div>
                                                <div className="flex-1">
                                                    {item.role === 'assistant' ? (
                                                        <MarkdownRenderer content={item.content} />
                                                    ) : (
                                                        <p className="text-[15px] break-words">{item.content}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Sources */}
                                            {item.sources && item.sources?.length > 0 && (
                                                <div className="flex flex-wrap gap-3">
                                                    {item.sources.map((source, i) => (
                                                        <Button
                                                            key={i}
                                                            variant="outline"
                                                            className="h-auto py-2 px-3 text-sm rounded-lg shadow-none hover:bg-muted border bg-transparent"
                                                        >
                                                            <Link href={source} target="_blank">
                                                                {source}
                                                            </Link>
                                                        </Button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {isLoading && <SkeletonBar />}
                                    <div ref={messagesEndRef} />
                                </div>
                                {error && (
                                    <div className="space-y-2 mb-3">
                                        <ErrorMessage err={error} />
                                    </div>
                                )}
                            </ScrollArea>
                        )
                    )}
                </div>

                {/* Input Area */}
                <div className="flex-shrink-0 py-4 px-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                            <div className="bg-gray-50 dark:bg-neutral-800 gap-3 shadow-md w-full flex justify-between items-center rounded-lg px-2 border border-neutral-200 dark:border-neutral-700">
                                <FormField
                                    control={form.control}
                                    name="query"
                                    render={({ field }) => (
                                        <FormItem className="w-full rounded-none py-2">
                                            <FormControl>
                                                <Textarea
                                                    style={{ fontSize: '17px' }}
                                                    {...field}
                                                    ref={(e) => {
                                                        field.ref(e);
                                                        inputRef.current = e;
                                                    }}
                                                    className="min-h-[unset] overflow-hidden w-full resize-none placeholder:text-base dark:bg-neutral-800 placeholder:text-gray-500 dark:placeholder:text-gray-400 border-none outline-none shadow-none px-3 py-2 ml-1 mr-2 max-h-[200px] overflow-y-auto disabled:cursor-not-allowed focus:border-0 active:border-0 focus-visible:ring-0"
                                                    placeholder={
                                                        showWelcomeScreen
                                                            ? 'Ask anything about this site...'
                                                            : 'Enter your query'
                                                    }
                                                    disabled={isLoading || isStreaming || error !== null}
                                                    onKeyDown={(e) => {
                                                        if (e.key == 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            form.handleSubmit(onSubmit)();
                                                        } else if (e.key == 'Enter' && e.shiftKey) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="h-10 w-10 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-700 shadow-none rounded-lg text-black dark:text-white cursor-pointer"
                                    disabled={isLoading || isStreaming || !query.trim() || error !== null}
                                >
                                    <SendHorizontal size={20} />
                                    <span className="sr-only">Send message</span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 py-3 px-5 flex items-center justify-between">
                    <Link href="mailto:priyanshu@retriv.xyz" className="font-medium hover:text-neutral-600">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-3 text-xs bg-transparent border-neutral-600 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                        >
                            Contact Support
                        </Button>
                    </Link>
                    <div className="text-neutral-400 text-xs tracking-tighter">
                        Powered by{' '}
                        <Link href={RETRIV_URL} className="font-medium hover:text-neutral-600">
                            Retriv
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

const UserIcon = () => (
    <div className="relative">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-sm">
            <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
        </div>
    </div>
);

const AssistantIcon = () => (
    <div className="relative group">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <div className="relative">
                <Brain className="h-4 w-4 text-white animate-pulse" />
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
            </div>
        </div>
    </div>
);
