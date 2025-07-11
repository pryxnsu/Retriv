import { Metadata } from 'next';
import { SignupForm } from '@/components/SignupForm';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Signup',
};

export default function Page() {
    // Disable manual signup process
    redirect('/login');
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <SignupForm />
            </div>
        </div>
    );
}
