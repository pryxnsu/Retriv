'use client';

export default function SetupGuide() {
    return (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">
                        1
                    </span>
                    <span>Copy the script tag</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">
                        2
                    </span>
                    <span>Paste it in your website&apos;s HTML</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
                        ✓
                    </span>
                    <span className="text-green-700 dark:text-green-400 font-medium">You&apos;re all set!</span>
                </div>
            </div>
        </div>
    );
}
