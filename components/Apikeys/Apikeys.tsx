'use client';

import AxiosInstance from '@/utils/axiosInstance';
import NoDataFound from '@/components/NoDataFound';
import { CreateAndUpdateApiKeyModal } from '@/components/ApiKeyModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { timeAgo } from '@/helper/time';
import { Copy, Eye } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import Loader from '@/components/Loader';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface ApiDataProp {
    id: string;
    name: string;
    shortToken: string;
    lastUsed: Date;
    createdAt: Date;
}

const fetchApiKeys = async (): Promise<ApiDataProp[]> => {
    try {
        const response = await AxiosInstance.get('/api/v1/apikey', {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch API Keys');
        }

        return response.data.data;
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error.response) {
            throw new Error((error.response.data as AxiosError)?.message || 'Failed to fetch API Keys');
        } else if (error.request) {
            throw new Error('No response from server. Check your network.');
        } else {
            throw new Error('Unexpected error occurred');
        }
    }
};

export default function Apikeys() {
    const queryClient = useQueryClient();

    const {
        data: apiKeys = [],
        error,
        isLoading,
    } = useQuery<ApiDataProp[], Error>({
        queryKey: ['apikeys'],
        queryFn: fetchApiKeys,
        retry: false,
    });

    // Copy API Key
    const apiKeyRef = useRef<HTMLInputElement | null>(null);
    const [apiKey, setApiKey] = useState<string>('');

    /** State for modal of API Key Visibility */
    const [apiKeyViewDialogOpen, setApiKeyViewDialogOpen] = useState(false);

    // State for API key visible / hidden
    const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

    // State for check Modal state (Open / Closed)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // State for modal is open for which task Create API Key or Edit
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    // Handler for open create API Key Modal
    const openCreateModal = () => {
        setModalMode('create');
        setIsModalOpen(!isModalOpen);
    };

    /** Function for create the API Key */
    const handleCreateApiKey = async (name: string) => {
        try {
            const response = await AxiosInstance.post(
                '/api/v1/apikey',
                {
                    name,
                },
                {
                    withCredentials: true,
                },
            );
            if (response.data.success == true) {
                const { apiKey, ...newApiKey } = response.data.data; // destructure apikey and create a new object except apikey

                // Update the cached data for apikeys
                queryClient.setQueryData<ApiDataProp[]>(['apikeys'], (old = []) => [newApiKey, ...old]);

                //Set new generated API Key for showing user (one time)
                setApiKey(apiKey);

                //Showing the Card of new API Key to user
                setApiKeyViewDialogOpen(!apiKeyViewDialogOpen);
            }
        } catch (err) {
            const error = err as AxiosError;

            if (error.response) {
                toast.error('Failed to create API key', {
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

    /**
     * Function for copy the created API Key
     */
    const handleCopyApiKey = useCallback(() => {
        apiKeyRef.current?.select();
        apiKeyRef.current?.setSelectionRange(0, apiKey.length);
        window.navigator.clipboard.writeText(apiKey);

        toast.success('Success', {
            description: 'Copied',
        });
    }, [apiKey]);

    /** Create API Key */
    const handleSubmit = (name: string) => {
        if (modalMode === 'create') {
            handleCreateApiKey(name);
        }
        setIsModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen">
                <Loader size="30" strokeWidth="2" />
            </div>
        );
    }

    if (error) {
        return <NoDataFound content={error.message} />;
    }
    return (
        <>
            <div className="flex items-center justify-between py-4 mx-4 md:mx-26 md:mt-12">
                <div>
                    <p className="font-semibold text-2xl">API keys</p>
                </div>
                <div>
                    {/* Create API Key Button : its open the modal  */}
                    <Button
                        onClick={openCreateModal}
                        disabled={apiKeys.length > 0}
                        className="bg-[#556B2F] hover:bg-[#4A5F25] text-white hover:text-white"
                    >
                        Create API Key
                    </Button>

                    {/* API Key view Modal  */}
                    {apiKeyViewDialogOpen && (
                        <div className="fixed top-0 left-0 flex justify-center items-center h-screen w-screen backdrop-blur-xs z-10">
                            <Card className="w-1/3">
                                <CardHeader>
                                    <CardTitle className="text-2xl">View API Key</CardTitle>
                                    <CardDescription className="text-base text-red-500 font-medium mt-2 border px-2 py-2 rounded-lg">
                                        Api key created successfully. This key will not be shown again. Save it
                                        securely!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <div>Name</div>
                                            <Label htmlFor="apikey">
                                                <Input
                                                    ref={apiKeyRef}
                                                    readOnly
                                                    id="apikey"
                                                    value={apiKey}
                                                    type={isApiKeyVisible ? 'text' : 'password'}
                                                />
                                                <Eye onClick={() => setIsApiKeyVisible(!isApiKeyVisible)} />
                                                <Copy onClick={handleCopyApiKey} />
                                            </Label>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button onClick={() => setApiKeyViewDialogOpen(false)}>Done</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            <div className="mx-4 md:mx-26 mt-12">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent cursor-pointer">
                            <TableHead className="w-[200px]">Name</TableHead>
                            <TableHead>API key</TableHead>
                            <TableHead className="text-right">Last Used</TableHead>
                            <TableHead className="text-right">Creation Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {apiKeys.length > 0 &&
                            apiKeys.map((item: ApiDataProp) => (
                                <TableRow key={item.id} className="text-base hover:bg-transparent cursor-pointer">
                                    <TableCell className="font-semibold underline decoration-dashed text-ellipsis pr-8 py-4">
                                        <span className="cursor-pointer">{item.name}</span>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <span className="bg-[#EEECE8] dark:bg-muted p-1 rounded-sm text-sm">
                                            {item.shortToken}....
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right py-4">
                                        {timeAgo(item?.lastUsed as Date) ?? 'Never'}
                                    </TableCell>
                                    <TableCell className="text-right py-4">
                                        {new Date(item?.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right py-4"></TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                {apiKeys.length === 0 && <NoDataFound content="No API Key found. Create a new one" />}
            </div>
            {
                /** Render Modal for create and edit API Key */
                isModalOpen && (
                    <CreateAndUpdateApiKeyModal
                        mode={modalMode}
                        isApiKeyCreateAndUpdateModalOpen={isModalOpen}
                        setIsApiKeyCreateAndUpdateModalOpen={setIsModalOpen}
                        onSubmit={handleSubmit}
                    />
                )
            }
        </>
    );
}
