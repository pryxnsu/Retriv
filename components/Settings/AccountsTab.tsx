import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { useUser } from '@/context/user.context';
import AxiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function SettingsAccountsTab() {
    const { user, error } = useUser();

    const handleDeleteAgent = async () => {
        try {
            const response = await AxiosInstance.delete('/api/v1/agent', {
                withCredentials: true,
            });
            if (response.data.success === true) {
                console.log('Deleted successful');
            }
        } catch (err: unknown) {
            const error = err as AxiosError;

            if (error.response) {
                toast.error('Failed to delete Agent', {
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
    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                        <p className="font-medium">{error ? error : user?.email}</p>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Account Type</Label>
                        <p className="font-medium">User</p>
                    </div>
                </div>

                <Separator className="my-4" />

                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Danger Zone</AlertTitle>
                    <AlertDescription>
                        Permanently deleting your agent cannot be undone. Please be certain.
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button disabled variant="destructive" className="w-full">
                            Delete Agent
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your agent and remove your
                                data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteAgent}
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}
