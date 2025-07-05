'use client';

import { useCallback, useState } from 'react';
import { timeAgo } from '@/helper/time';
import { Bot } from 'lucide-react';

interface ResponseEntry {
    query: string;
    timestamp: string | Date;
}

function MonitorQueries() {
    const [responses, setResponses] = useState<ResponseEntry[]>([
        { query: 'How to add Retriv on my website?', timestamp: new Date(Date.now() - 30000) },
        { query: 'What are your pricing plans?', timestamp: new Date(Date.now() - 120000) },
        { query: 'Does it work with React?', timestamp: new Date(Date.now() - 300000) },
        { query: 'How to customize the assistant?', timestamp: new Date(Date.now() - 600000) },
    ]);

    const handleSend = useCallback(() => {
        const queries = [
            'How to integrate Retriv on my website?',
            'Can I customize the AI responses?',
            'What languages do you support?',
            'How do you know me ?',
        ];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];

        const newLog: ResponseEntry = {
            query: randomQuery,
            timestamp: new Date(),
        };
        setResponses((prev) => [newLog, ...prev.slice(0, 5)]);
    }, []);

    return (
        <div className="relative z-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
            <div className="space-y-6">
                <div className="flex items-center justify-end p-4 rounded-xl ">
                    <button
                        className="py-1 flex items-center gap-2 rounded-full border border-slate-600 px-3 text-sm outline-none transition-transform duration-150 ease-in-out hover:scale-105 focus-visible:ring-2 focus-visible:ring-slate-600 active:scale-100 bg-black text-white"
                        onClick={handleSend}
                    >
                        <Bot size={15} />
                        Send
                    </button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-hidden">
                    {responses.map((response, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-4 p-3 bg-white dark:bg-gray-950 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 animate-fade-in"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {timeAgo(response.timestamp as Date)}
                            </div>
                            <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                                <span className="text-gray-400">{'{ query: "'}</span>
                                <span className="text-blue-600 dark:text-blue-400 font-medium">{response.query}</span>
                                <span className="text-gray-400">{'" }'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MonitorQueries;

// export default function MonitorQueries() {
//     const [responses, setResponses] = useState<ResponseEntry[]>([
//         { query: 'How to add Retriv on my website ?', timestamp: '2025-06-02T09:37:44.209Z' },
//         { query: 'How to add Retriv on my website ?', timestamp: '2025-06-02T09:37:44.209Z' },
//         { query: 'How to add Retriv on my website ?', timestamp: '2025-06-02T09:37:44.209Z' },
//         { query: 'How to add Retriv on my website ?', timestamp: '2025-06-02T09:37:44.209Z' },
//     ]);

//     const handleSend = useCallback(() => {
//         const newLog: ResponseEntry = {
//             query: 'How to add Retriv on my website ?',
//             timestamp: new Date().toISOString(),
//         };
//         setResponses((prev) => [newLog, ...prev]);
//     }, []);
//     return (
//         <div className="relative z-10 h-[324px] overflow-hidden">
//             <div className="h-full w-full overflow-hidden">
//                 {/* Main Control Panel */}
//                 <div className="w-full md:max-w-2/3 lg:max-w-1/2">
//                     <div className="w-full sm:max-w-2/3 px-4">
//                         <div className="mt-5">
//                             <div
//                                 className="relative inline-flex rounded-lg border border-slate-600 p-3 w-full items-center justify-between"
//                                 style={{
//                                     background:
//                                         'border-box linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0))',
//                                 }}
//                             >
//                                 <Badge
//                                     variant="secondary"
//                                     className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 px-4 py-2 text-sm font-medium"
//                                 >
//                                     User&apos;s queries
//                                 </Badge>

//                                 {/* Send Button */}
//                                 <button
//                                     onClick={handleSend}
//                                     className="py-1 flex items-center gap-2 rounded-full border border-slate-600 px-3 text-sm outline-none transition-transform duration-150 ease-in-out hover:scale-105 focus-visible:ring-2 focus-visible:ring-slate-600 active:scale-100 bg-black text-white"
//                                 >
//                                     <Bot size={15} />
//                                     Send
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Response Log */}
//                     <div className="mt-8 h-[200px] w-full overflow-hidden px-4 md:h-[120px] md:w-auto">
//                         <div className="flex flex-col">
//                             {responses.map((response, idx) => (
//                                 <div
//                                     key={idx}
//                                     className="mb-2 flex gap-4 text-slate-400"
//                                     style={{
//                                         opacity: 1,
//                                         transform: 'none',
//                                         transformOrigin: '50% 50% 0px',
//                                     }}
//                                 >
//                                     <pre>{timeAgo(response.timestamp as Date)}:</pre>
//                                     <pre className="truncate">
//                                         {`{ "query": "`}
//                                         <span className="text-slate-500">{response.query}</span>
//                                         {`" }`}
//                                     </pre>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
