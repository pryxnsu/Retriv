'use client';

import Link from 'next/link';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AxiosInstance from '@/utils/axiosInstance';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { SigninFormSchema } from '@/types';
import GoogleLoginButton from './GoogleLogin';
import { AxiosError } from 'axios';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm<z.infer<typeof SigninFormSchema>>({
        resolver: zodResolver(SigninFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof SigninFormSchema>) {
        try {
            setIsSubmitting(true);
            const response = await AxiosInstance.post(
                '/api/v1/auth/login',
                {
                    email: values.email,
                    password: values.password,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                },
            );
            if (response.data.success === true) {
                toast.success('Login Successful', {
                    description: 'Redirecting to agents...',
                });
                router.push('/agent');
            }
        } catch (err: unknown) {
            const error = err as AxiosError;

            if (error.response) {
                toast.error('Login failed', {
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
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={cn('flex justify-center items-center gap-6', className)} {...props}>
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="flex flex-col items-start text-center mb-4">
                    <h1 className="text-start text-2xl font-bold mb-1">Welcome to Retriv</h1>
                    <p className="text-balance text-muted-foreground">A smarter way to add AI to your website.</p>
                </div>

                {/* Manual login (conditionally rendered) */}
                {process.env.NEXT_PUBLIC_ENABLE_MANUAL_LOGIN == 'true' && (
                    <>
                        {/* Sign up link */}
                        <div className="text-start text-base mb-8">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="underline underline-offset-4 text-blue-500 hover:underline">
                                Sign up
                            </Link>
                        </div>

                        {/* Form */}
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6 mb-4"
                                aria-label="Login form"
                            >
                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    autoComplete="email"
                                                    aria-label="Email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Password Field with Toggle */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex justify-between items-center">
                                                <FormLabel className="text-base">Password</FormLabel>
                                                <Link
                                                    href="/forget-password"
                                                    className="text-base text-blue-500 hover:underline"
                                                >
                                                    Forgot Password?
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    autoComplete="current-password"
                                                    aria-label="Password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="text-white dark:text-white w-full h-10 text-base bg-[#556B2F] hover:bg-[#4A5F25] focus:ring-2 focus:ring-offset-2 focus:ring-[#556B2F]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <Loader className="animate-spin" /> Please wait
                                        </span>
                                    ) : (
                                        'Continue'
                                    )}
                                </Button>
                            </form>
                        </Form>

                        {/* Divider */}
                        <div className="my-6 flex items-center">
                            <div className="flex-grow border-t border-gray-200" />
                            <span className="mx-4 text-xs text-gray-400">OR</span>
                            <div className="flex-grow border-t border-gray-200" />
                        </div>
                    </>
                )}

                {/* Google Login */}
                <GoogleLoginButton />

                {/* Terms */}
                <div className="text-balance text-center text-xs text-muted-foreground mt-4">
                    By signing in, you agree to our{' '}
                    <Link href="/legal/terms-of-services" className="text-blue-500 hover:underline">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/legal/privacy-policy" className="text-blue-500 hover:underline">
                        Privacy Policy
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
}
