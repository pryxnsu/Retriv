import MobileNavbar from '@/components/MobileNavbar';
import Sidebar from '@/components/Sidebar';
import { UserProvider } from '@/context/user.context';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <div className="flex w-full">
                {/* Sidebar */}
                <nav className="hidden lg:block">
                    <aside className="w-64 flex flex-col justify-between h-screen border-r border-neutral-300 dark:border-neutral-800 p-4">
                        <Suspense fallback={<div />}>
                            <Sidebar />
                        </Suspense>
                    </aside>
                </nav>

                {/* Main */}
                <main className="w-full min-h-screen">
                    {/* Mobile view Navbar */}
                    <MobileNavbar />

                    <div className="h-screen overflow-auto">{children}</div>
                </main>
            </div>
        </UserProvider>
    );
}
