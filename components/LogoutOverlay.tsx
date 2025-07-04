import { Loader2 } from 'lucide-react';

export default function LogoutOverlay() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
            <div className="animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="flex items-center gap-3 rounded-lg border bg-background/95 px-6 py-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">Logging out...</p>
                        <p className="text-xs text-muted-foreground">Please wait a moment</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
