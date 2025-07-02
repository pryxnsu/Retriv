'use client';

import { z } from 'zod';
import { SendHorizontal, Sparkles, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChatInputSchema } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import SkeletonBar from '../Skeleton/skeleton';
import { MarkdownRenderer } from '../Markdown';
import Link from 'next/link';
import { getSessionStorage, setSessionStorage } from '@/lib/storage';
import { inter } from '../../lib/fonts/fonts';
import { Textarea } from '../ui/textarea';
import { AxiosError } from 'axios';
import ErrorMessage from '../ChatErrorMessage';

interface Message {
    content: string;
    role: 'user' | 'assistant';
}

interface ChatDataProps {
    content: string;
    role: 'user' | 'assistant';
    sources?: string[];
}

interface ChatInterfaceAgentProps {
    agentName: string;
    agentId: string;
    apiKey: string;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Clear the conversation id on refresh
 */
function useClearConversationIdOnRefresh() {
    useEffect(() => {
        const handleUnload = () => {
            sessionStorage.clear();
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);
}

export default function ChatInterfaceAgent({ agentName, agentId, apiKey, isOpen, onClose }: ChatInterfaceAgentProps) {
    useClearConversationIdOnRefresh();

    const RETRIV_URL = process.env.NEXT_PUBLIC_RETRIV_URL || '';
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || '';
    const [isStreaming, setIsStreaming] = useState(false);
    const [sourcesUrl, setSourcesUrl] = useState<string[]>([]);
    const [chatData, setChatData] = useState<ChatDataProps[]>([
        {
            content: `Hey! I’m the ${agentName} AI assistant, trained on our documentation and help articles. How can I support you today?`,
            role: 'assistant',
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [error, setError] = useState<string | null>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatData]);

    const form = useForm<z.infer<typeof ChatInputSchema>>({
        resolver: zodResolver(ChatInputSchema),
        defaultValues: {
            query: '',
        },
    });

    const query = form.watch('query');

    // Focus input when chat opens
    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
    }, []);

    async function onSubmit(data: z.infer<typeof ChatInputSchema>) {
        const userMessage: Message = {
            content: data.query,
            role: 'user',
        };

        setChatData((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setSourcesUrl([]);

        try {
            const id = getSessionStorage('cnvid');
            const response = await fetch(`${SERVER_URL}/api/v1/agent/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    agentId: agentId,
                    query: data.query,
                    conversationId: id || '',
                }),
                referrerPolicy: 'origin',
            });
            form.reset();

            if (!response.ok || !response.body) {
                throw new Error('Something went wrong. Please refresh');
            }

            const reader = response?.body.getReader();
            const decoder = new TextDecoder();

            let content = '';
            let buffer = '';

            while (true) {
                setIsStreaming(true);
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                while (buffer.includes('\n\n')) {
                    const message = buffer.substring(0, buffer.indexOf('\n\n'));
                    buffer = buffer.substring(buffer.indexOf('\n\n') + 2);

                    if (message.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(message.substring(6));
                            if (data.error) throw new Error(data.error);
                            if (data.sources) {
                                setSourcesUrl(data.sources);
                            }
                            if (data.content) {
                                content += data.content;
                                setChatData((prev) => {
                                    const lastMsg = prev[prev.length - 1];
                                    if (lastMsg?.role === 'assistant') {
                                        return [
                                            ...prev.slice(0, -1),
                                            { ...lastMsg, content: content, sources: sourcesUrl },
                                        ];
                                    }
                                    return [...prev, { content, role: 'assistant' }];
                                });
                            }
                        } catch (err: unknown) {
                            console.error('Parsing error:', err);
                        }
                    } else if (message.startsWith('event: id')) {
                        // Handle temp conversation Id
                        const msg = message.substring(10);
                        if (msg.startsWith('data: ')) {
                            const data = JSON.parse(msg.substring(6));
                            console.log(`id: ${data.conversationId}`);
                            setSessionStorage('cnvid', data.conversationId);
                        }
                    } else if (message.startsWith('event: error')) {
                        // Handle Error
                        const errMsg = message.substring(13);
                        if (errMsg.startsWith('data: ')) {
                            const data = JSON.parse(errMsg.substring(6));
                            console.log(`error: ${data.error}`);
                            setError(data.error);
                        }
                    } else if (message.startsWith('event: subscription:error')) {
                        const errMsg = message.substring(26);
                        if (errMsg.startsWith('data: ')) {
                            const data = JSON.parse(errMsg.substring(6));
                            console.error(`subscription error: ${data.error}`);
                            setError(data.error);
                        }
                    }
                }
            }
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (error.response) {
                setError(
                    (error.response.data as AxiosError)?.message || 'Something went wrong. Please try again later',
                );
            } else if (error.request) {
                setError('No response from server. Please check your connection.');
            } else {
                setError('Something went wrong. Please try again later');
            }
        } finally {
            setIsStreaming(false);
            setIsLoading(false);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);
    return (
        <>
            {isOpen && (
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

                    <div className="px-5 py-1 flex flex-col border border-gray-200 dark:border-muted shadow-xl rounded-md w-full bg-white dark:bg-[#212121] max-w-screen h-[84vh] md:w-[min(600px,100%)] lg:w-[min(720px,100%)] 2xl:w-[min(760px,100%)] z-[99999]">
                        <div>
                            <div className="text-neutral-500 text-sm py-3">Ask AI</div>
                        </div>
                        {/* Chat Messages Area */}
                        <div className="flex-1 min-h-0">
                            {chatData.length > 0 && (
                                <ScrollArea className="h-full rounded-xl px-5">
                                    <div className="space-y-4">
                                        {chatData.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className={`space-y-3 py-5 ${item.role === 'user' && 'border-y border-neutral-200 dark:border-neutral-600 '}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-start justify-center w-8 h-8 rounded-full">
                                                        {item.role === 'user' ? (
                                                            <UserCircle className="h-5 w-5 text-black dark:text-white mt-2" />
                                                        ) : (
                                                            <Sparkles className="h-5 w-5 text-black dark:text-white mt-2" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        {item.role === 'assistant' ? (
                                                            <MarkdownRenderer content={item.content} />
                                                        ) : (
                                                            <p className="text-sm break-words">{item.content}</p>
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
                                                                className="h-auto py-2 px-3 text-sm rounded-lg shadow-none hover:bg-muted border"
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
                            )}
                        </div>

                        {/* Input Header */}
                        <div className="flex-shrink-0 py-t py-2 px-5">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                                    <div className="bg-gray-50 dark:bg-muted gap-3 shadow-md w-full flex justify-between items-center rounded-lg px-2">
                                        <FormField
                                            control={form.control}
                                            name="query"
                                            render={({ field }) => (
                                                <FormItem className="w-full rounded-none py-2">
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            ref={(e) => {
                                                                field.ref(e);
                                                                inputRef.current = e;
                                                            }}
                                                            className="min-h-[unset] overflow-hidden w-full resize-none dark:bg-muted placeholder:text-gray-500 dark:placeholder:text-gray-dark-200 border-none outline-none shadow-none px-3 py-2 ml-1 mr-2 max-h-[200px] overflow-y-auto disabled:cursor-not-allowed focus:border-0 active:border-0 focus-visible:ring-0 "
                                                            placeholder="Enter your query..."
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
                                            className="h-10 w-10 bg-transparent hover:bg-neutral-50 dark:hover:bg-black-80  shadow-none rounded-lg text-black dark:text-white dark:hover:text-black cursor-pointer"
                                            disabled={isLoading || isStreaming || !query.trim() || error !== null}
                                        >
                                            <SendHorizontal size={30} />
                                            <span className="sr-only">Send message</span>
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>

                        {/* Footer */}
                        <div className="flex-shrink-0 p-3">
                            <div className="text-neutral-400 text-xs text-right tracking-tighter">
                                Powered by{' '}
                                <Link href={RETRIV_URL} className="font-medium hover:text-neutral-600">
                                    Retriv
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
