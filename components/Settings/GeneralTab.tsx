'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import AxiosInstance from '@/utils/axiosInstance';
import Loader from '../Loader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AgentSettingsSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import NoDataFound from '../NoDataFound';
import { useQuery } from '@tanstack/react-query';

interface GeneralTabProps {
    basicInfo: {
        id: string;
        agentName: string;
        sourceUrl: string;
        creationDate: Date | string;
        status: 'Running' | 'Error' | 'Pending';
    };
    responseSettings: {
        responseLength: 'Balanced' | 'Concise' | 'Detailed';
        sourceLinkEnable: boolean;
    };
}

const fetchGeneralSettings = async (): Promise<GeneralTabProps> => {
    try {
        const response = await AxiosInstance.get('/api/v1/settings/general', {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch general settings');
        }

        return response.data.data;
    } catch (err) {
        const error = err as AxiosError;

        if (error.response) {
            throw new Error((error.response.data as AxiosError)?.message || 'Failed to fetch settings');
        } else if (error.request) {
            throw new Error('No response from server. Check your network.');
        } else {
            throw new Error('Unexpected error occurred');
        }
    }
};

export default function SettingsGeneralTab() {
    const {
        data: generalSettings,
        error,
        isLoading,
    } = useQuery<GeneralTabProps, Error>({
        queryKey: ['general-settings'],
        queryFn: fetchGeneralSettings,
        retry: false,
    });

    const form = useForm<z.infer<typeof AgentSettingsSchema>>({
        resolver: zodResolver(AgentSettingsSchema),
        defaultValues: {
            responseLength: generalSettings?.responseSettings.responseLength,
            enableSources: generalSettings?.responseSettings.sourceLinkEnable,
        },
    });

    async function onSubmit(data: z.infer<typeof AgentSettingsSchema>) {
        try {
            const response = await AxiosInstance.patch(
                '/api/v1/settings/general',
                {
                    responseLength: data.responseLength,
                    enableSources: data.enableSources,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            if (response.data.success === true) {
                toast.success('Updated successfully');
            }
        } catch (err: unknown) {
            const error = err as AxiosError;

            if (error.response) {
                toast.error('Failed to update agent settings', {
                    description: (error.response.data as AxiosError)?.message || 'An error occurred',
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
        }
    }

    const resetSettingsToDefault = async () => {
        try {
            const response = await AxiosInstance.patch(
                '/api/v1/settings/general/reset',
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            if (response.data.success === true) {
                toast.success('Reset successfully');
            }
        } catch (err: unknown) {
            const error = err as AxiosError;

            if (error.response) {
                toast.error('Failed to reset settings', {
                    description: (error.response.data as AxiosError)?.message || 'An error occurred',
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
        }
    };

    if (isLoading && !generalSettings) {
        return (
            <div className="flex h-90 justify-center items-center">
                <Loader size="30" strokeWidth="2" />
            </div>
        );
    }

    if (error) {
        return <NoDataFound content={error.message} />;
    }

    if ((!isLoading && !generalSettings) || Object.keys(generalSettings?.basicInfo || {}).length === 0) {
        return <NoDataFound content="To access these settings, please create an agent first." />;
    }
    return (
        <>
            <Card className="border-none shadow-none bg-transparent mb-0">
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>View and manage your agent&apos;s basic information</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                            <p className="font-medium">{generalSettings?.basicInfo.agentName}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Agent LLM</Label>
                            <p className="font-medium">Open AI | Gemini</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Source URL</Label>
                            <p className="font-medium truncate">{generalSettings?.basicInfo?.sourceUrl}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-[#556B2F] text-white py-1 px-2 font-medium">
                                    {generalSettings?.basicInfo?.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <Label className="text-sm font-medium text-muted-foreground">Creation Date</Label>
                            <p className="font-medium">
                                {new Date(generalSettings?.basicInfo?.creationDate || '').toDateString()}
                            </p>
                        </div>
                    </div>
                    <Separator />
                </CardContent>
            </Card>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} onInvalid={() => console.log('Invalid')}>
                    <Card className="border-none shadow-none bg-transparent">
                        <CardHeader>
                            <CardTitle>Response Settings</CardTitle>
                            <CardDescription>Customize how your agent responds to queries</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="response-length">Response Length</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Choose how detailed you want the responses to be
                                        </p>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="responseLength"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Select length" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Concise">Concise</SelectItem>
                                                        <SelectItem value="Balanced">Balanced</SelectItem>
                                                        <SelectItem value="Detailed">Detailed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="enable-sources">Enable Source Links</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Include reference links in the agent&apos;s responses
                                        </p>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="enableSources"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Switch
                                                        id="enable-sources"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Separator />
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between">
                            <Button onClick={resetSettingsToDefault} variant="destructive" className="cursor-pointer">
                                Reset to Defaults
                            </Button>
                            <Button type="submit" className="bg-[#556B2F] text-white hover:bg-[#4A5F25] cursor-pointer">
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </>
    );
}
