'use client';

import { type FormEvent, useState } from 'react';
import { Globe, Bot, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import AxiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface CreateAgentFormProps {
    onSuccess?: () => void;
}

export function CreateAgentForm({ onSuccess }: CreateAgentFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState<string>('');
    const [sourceUrl, setSourceUrl] = useState<string>('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccess(false);
        try {
            const response = await AxiosInstance.post(
                '/api/v1/agent',
                {
                    name,
                    sourceUrl,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            if (response.data.success === true) {
                setSuccess(true);
                setName('');
                setSourceUrl('');
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess();
                    }, 2000);
                }
            }
        } catch (err: unknown) {
            const error = err as AxiosError;
            const errMsg = (error.response?.data as AxiosError)?.message || 'Something went wrong'; 
            setError(errMsg);
            if (error.response) {
                toast.error('Failed to create agent', {
                    description: errMsg,
                });
            } else if (error.request) {
                toast.error('Network error', {
                    description: 'No response from server. Please check your connection.',
                });
            } else {
                toast.error('Unexpected error', {
                    description: error.message,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <Card className="border-none shadow-none bg-transparent py-0">
                <CardHeader className="pb-0 px-0 pt-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                            <Bot className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create AI Agent</h2>
                            <CardDescription className="text-slate-500 dark:text-slate-400 mt-0.5">
                                Fill in the details below to create a custom AI agent for your website
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-0 pb-0">
                    {success && (
                        <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-green-800 dark:text-green-200">
                                Agent created successfully! Your website will be crawled automatically.
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-white">
                                Agent Name
                            </Label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Support Assistant"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="pl-10 h-12 border-slate-200 dark:border-slate-700 focus:border-violet-500 dark:focus:border-violet-400 focus:ring-violet-500 dark:focus:ring-violet-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                                />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Choose a descriptive name for your AI assistant
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="source-url" className="text-sm font-medium text-slate-700 dark:text-white">
                                Website URL
                            </Label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <Input
                                    id="source-url"
                                    placeholder="https://yourwebsite.com"
                                    value={sourceUrl}
                                    onChange={(e) => setSourceUrl(e.target.value)}
                                    required
                                    type="url"
                                    className="pl-10 h-12 border-slate-200 dark:border-slate-700 focus:border-violet-500 dark:focus:border-violet-400 focus:ring-violet-500 dark:focus:ring-violet-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                                />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                We will automatically crawl this website to train your AI agent
                            </p>
                        </div>
                        {/* Error message  */}
                        <div>
                            <span className='text-red-500 text-sm'>{error}</span>
                        </div>
                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full h-12 bg-[#556B2F] hover:bg-[#4A5F25] dark:bg-[#556B2F] dark:hover:bg-[#4A5F25] text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Creating your agent...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Bot className="h-5 w-5" />
                                        Create Agent
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="border-t border-slate-100 dark:border-slate-700 px-4 py-4 mt-6 mx-0">
                    <div className="w-full text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Your agent will be ready to answer questions about your website content after crawling is
                            complete
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
