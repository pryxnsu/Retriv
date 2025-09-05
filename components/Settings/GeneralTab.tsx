'use client';

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
        <div className="my-8 space-y-8 px-6">
            {/* Basic Information Section */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Basic Information</h2>
                    <p className="text-sm text-muted-foreground">View and manage your agent&aspo;s basic information</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
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
                            <Badge
                                variant="outline"
                                className="py-1 px-2 font-medium border-neutral-300 dark:border-neutral-800 bg-muted-light dark:bg-muted-dark"
                            >
                                {generalSettings?.basicInfo?.status}
                            </Badge>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Creation Date</Label>
                        <p className="font-medium">
                            {new Date(generalSettings?.basicInfo?.creationDate || '').toDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Response Settings Section */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} onInvalid={() => console.log('Invalid')}>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">Response Settings</h2>
                            <p className="text-sm text-muted-foreground">
                                Customize how your agent responds to queries
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="response-length" className="text-base font-medium">
                                        Response Length
                                    </Label>
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
                                                <FormControl className="border-neutral-300 dark:border-neutral-800">
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select length" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-background  border-neutral-300 dark:border-neutral-800 z-20">
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
                                <div className="space-y-1">
                                    <Label htmlFor="enable-sources" className="text-base font-medium">
                                        Enable Source Links
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Include reference links in the agent&aspo;s responses
                                    </p>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="enableSources"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl className="border-neutral-300 dark:border-neutral-800">
                                                <Switch
                                                    className="data-[state=checked]:bg-neutral-800 dark:data-[state=checked]:bg-white data-[state=unchecked]:bg-neutral-200 dark:data-[state=unchecked]:bg-neutral-700"
                                                    id="enable-sources"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="flex justify-between pt-4">
                            <Button
                                onClick={resetSettingsToDefault}
                                variant="destructive"
                                type="button"
                                className="cursor-pointer"
                            >
                                Reset to Defaults
                            </Button>
                            <Button
                                type="submit"
                                className="cursor-pointer bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
        // <>
        //     <Card className="border-none shadow-none bg-transparent mb-0">
        //         <CardHeader>
        //             <CardTitle>Basic Information</CardTitle>
        //             <CardDescription>View and manage your agent&apos;s basic information</CardDescription>
        //         </CardHeader>

        //         <CardContent className="space-y-4">
        //             <div className="grid grid-cols-2 gap-4">
        //                 <div className="space-y-2">
        //                     <Label className="text-sm font-medium text-muted-foreground">Name</Label>
        //                     <p className="font-medium">{generalSettings?.basicInfo.agentName}</p>
        //                 </div>
        //                 <div className="space-y-2">
        //                     <Label className="text-sm font-medium text-muted-foreground">Agent LLM</Label>
        //                     <p className="font-medium">Open AI | Gemini</p>
        //                 </div>
        //                 <div className="space-y-2">
        //                     <Label className="text-sm font-medium text-muted-foreground">Source URL</Label>
        //                     <p className="font-medium truncate">{generalSettings?.basicInfo?.sourceUrl}</p>
        //                 </div>
        //                 <div className="space-y-2">
        //                     <Label className="text-sm font-medium text-muted-foreground">Status</Label>
        //                     <div className="flex items-center gap-2">
        //                         <Badge
        //                             variant="outline"
        //                             className="py-1 px-2 font-medium border-neutral-300 dark:border-neutral-800 bg-muted-light dark:bg-muted-dark"
        //                         >
        //                             {generalSettings?.basicInfo?.status}
        //                         </Badge>
        //                     </div>
        //                 </div>
        //                 <div className="space-y-2 mb-4">
        //                     <Label className="text-sm font-medium text-muted-foreground">Creation Date</Label>
        //                     <p className="font-medium">
        //                         {new Date(generalSettings?.basicInfo?.creationDate || '').toDateString()}
        //                     </p>
        //                 </div>
        //             </div>
        //             <Separator />
        //         </CardContent>
        //     </Card>

        //     <Form {...form}>
        //         <form onSubmit={form.handleSubmit(onSubmit)} onInvalid={() => console.log('Invalid')}>
        //             <div className="border-none shadow-none bg-transparent">
        //                 <div>
        //                     <p>Response Settings</p>
        //                     <p>Customize how your agent responds to queries</p>
        //                 </div>

        //                 <div className="space-y-6">
        //                     <div className="flex flex-col space-y-4">
        //                         <div className="flex items-center justify-between">
        //                             <div className="space-y-0.5">
        //                                 <Label htmlFor="response-length">Response Length</Label>
        //                                 <p className="text-sm text-muted-foreground">
        //                                     Choose how detailed you want the responses to be
        //                                 </p>
        //                             </div>
        //                             <FormField
        //                                 control={form.control}
        //                                 name="responseLength"
        //                                 render={({ field }) => (
        //                                     <FormItem>
        //                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
        //                                             <FormControl className="border-neutral-300 dark:border-neutral-800">
        //                                                 <SelectTrigger className="w-[180px]">
        //                                                     <SelectValue placeholder="Select length" />
        //                                                 </SelectTrigger>
        //                                             </FormControl>
        //                                             <SelectContent className="bg-muted-light dark:bg-muted-dark border-neutral-300 dark:border-neutral-800">
        //                                                 <SelectItem value="Concise">Concise</SelectItem>
        //                                                 <SelectItem value="Balanced">Balanced</SelectItem>
        //                                                 <SelectItem value="Detailed">Detailed</SelectItem>
        //                                             </SelectContent>
        //                                         </Select>
        //                                     </FormItem>
        //                                 )}
        //                             />
        //                         </div>

        //                         <Separator />

        //                         <div className="flex items-center justify-between">
        //                             <div className="space-y-0.5">
        //                                 <Label htmlFor="enable-sources text-sm">Enable Source Links</Label>
        //                                 <p className="text-sm text-muted-foreground">
        //                                     Include reference links in the agent&apos;s responses
        //                                 </p>
        //                             </div>
        //                             <FormField
        //                                 control={form.control}
        //                                 name="enableSources"
        //                                 render={({ field }) => (
        //                                     <FormItem>
        //                                         <FormControl className="border-neutral-300 dark:border-neutral-800">
        //                                             <Switch
        //                                                 className="data-[state=checked]:bg-neutral-800 dark:data-[state=checked]:bg-white data-[state=unchecked]:bg-neutral-200 dark:data-[state=unchecked]:bg-neutral-700"
        //                                                 id="enable-sources"
        //                                                 checked={field.value}
        //                                                 onCheckedChange={field.onChange}
        //                                             />
        //                                         </FormControl>
        //                                     </FormItem>
        //                                 )}
        //                             />
        //                         </div>
        //                         <Separator />
        //                     </div>
        //                 </div>

        //                 <p className="flex justify-between">
        //                     <Button onClick={resetSettingsToDefault} variant="destructive" className="cursor-pointer">
        //                         Reset to Defaults
        //                     </Button>
        //                     <Button type="submit" className="cursor-pointer bg-muted-light dark:bg-muted-dark">
        //                         Save Changes
        //                     </Button>
        //                 </p>
        //             </div>
        //         </form>
        //     </Form>
        // </>
    );
}
