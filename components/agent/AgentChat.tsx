'use client';

import { z } from 'zod';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChatInputSchema } from '@/types';
import { getSessionStorage, setSessionStorage } from '@/lib/storage';
import { AxiosError } from 'axios';
import AIChatInterface from '../AIChatInterface';
import AxiosInstance from '@/utils/axiosInstance';

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
    agentId: string;
    isOpen: boolean;
    onClose: () => void;
}

function useFetchExampleQuestions(agentId: string) {
    const [agentName, setAgentName] = useState<string | null>(null);
    const [exampleQuestions, setExampleQuestions] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            if (!agentId) return;
            try {
                const response = await AxiosInstance.get(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/agent/example-questions/${agentId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                );
                if (response.data.success == true) {
                    setAgentName(response.data.data.name);
                    setExampleQuestions(response.data.data.questions);
                }
                return response.data.data;
            } catch (err) {
                console.error(`Failed to fetch chat. Please try again. ${err}`);
            }
        };
        fetchData();
    }, [agentId]);

    return {
        exampleQuestions,
        name: agentName,
    };
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

export default function ChatInterfaceAgent({ agentId, isOpen, onClose }: ChatInterfaceAgentProps) {
    useClearConversationIdOnRefresh();
    const RETRIV_URL = process.env.NEXT_PUBLIC_RETRIV_URL || '';
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || '';

    const { name, exampleQuestions } = useFetchExampleQuestions(agentId);

    const [isStreaming, setIsStreaming] = useState(false);
    const [sourcesUrl, setSourcesUrl] = useState<string[]>([]);
    const [chatData, setChatData] = useState<ChatDataProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        setChatData([
            {
                content: `Hey there! I’m ${name}, an AI assistant trained on docs and help content. What can I help you with today?`,
                role: 'assistant',
            },
        ]);
    }, [name]);

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

    if (!agentId) {
        return <div className="flex justify-center items-center h-full w-full">Loading....</div>;
    }
    return (
        <>
            {isOpen && (
                <AIChatInterface
                    chatData={chatData}
                    isLoading={isLoading}
                    isStreaming={isStreaming}
                    error={error}
                    form={form}
                    onSubmit={onSubmit}
                    name={name || ''}
                    exampleQuestions={exampleQuestions as []}
                    query={query}
                    RETRIV_URL={RETRIV_URL}
                    inputRef={inputRef}
                    messagesEndRef={messagesEndRef}
                />
            )}
        </>
    );
}
