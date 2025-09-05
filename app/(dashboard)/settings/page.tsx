import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Settings2, User } from 'lucide-react';
import SettingsBillingTab from '@/components/Settings/BillingTab';
import SettingsAccountsTab from '@/components/Settings/AccountsTab';
import SettingsGeneralTab from '@/components/Settings/GeneralTab';

export const metadata: Metadata = {
    title: 'Settings',
};

export default function Settings() {
    return (
        <div className="container mx-auto pt-4 max-w-4xl md:pt-12 h-screen">
            <div className="ml-3 mb-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your agent preferences and account settings</p>
                </div>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-transparent h-12 pb-0 grid w-full grid-cols-3 border-none shadow-none rounded-none">
                    <TabsTrigger value="general" className="flex items-center gap-2 cursor-pointer">
                        <Settings2 className="h-4 w-4" />
                        <span className="hidden sm:inline">General</span>
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        <span className="hidden sm:inline">Billing</span>
                    </TabsTrigger>
                    <TabsTrigger value="account" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Account</span>
                    </TabsTrigger>
                </TabsList>

                {/* General Tab Content */}
                <TabsContent value="general" className="space-y-6">
                    <SettingsGeneralTab />
                </TabsContent>

                {/* Billing Tab Content */}
                <TabsContent value="billing" className="space-y-6">
                    <SettingsBillingTab />
                </TabsContent>

                {/* Account Tab Content */}
                <TabsContent value="account" className="space-y-6">
                    <SettingsAccountsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
