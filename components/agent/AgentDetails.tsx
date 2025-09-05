'use client';

import { useRef, useState } from 'react';
import { Globe, BarChart, Bot, Hammer, Clock9, Copy, Check, Clock12 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { timeAgo } from '@/helper/time';
import { AgentProps } from './AgentDashboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLocalStorage } from '@/lib/storage';
import DataUpdatingAlert from '../DataUpdatingAlert';
import Feedback from '../Feedback';
import { useRouter, useSearchParams } from 'next/navigation';

interface IntegrationCodeProp {
    title: string;
    code: string;
}

const nextjsCode = `<!-- Next.js : Place this inside your layout.tsx -->
<Script
  src='https://retriv.xyz/agent-widget.js'
  data-agent-id='111223334445555' // Agent Id
  data-base-url="https://retriv.xyz"
  strategy='afterInteractive'
  async
/>`;

const javascriptCode = `<!-- Vanilla JS - Place before </body> tag -->
<script
  src="https://retriv.xyz/agent-widget.js"
  data-agent-id="111223334445555" // Agent Id
  data-base-url="https://retriv.xyz"
  async
></script>`;

const integrationCode: IntegrationCodeProp[] = [
    {
        title: 'Next.js',
        code: nextjsCode,
    },
    {
        title: 'Javascript',
        code: javascriptCode,
    },
];

export function AgentDetails({ agent }: { agent: AgentProps }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab');

    const isCurrentThemeDark = getLocalStorage('isDarkTheme');
    const codeRef = useRef<HTMLDivElement | null>(null);
    const [copied, setCopied] = useState<number | null>(null);
    const [agentIdCopied, setAgentIdCopied] = useState<boolean>(false);

    const handleCopyCode = (code: string, idx: number) => {
        if (codeRef.current) {
            navigator.clipboard.writeText(code).then(() => {
                setCopied(idx);
            });
        }
    };

    const handleCopyAgentId = async () => {
        try {
            await navigator.clipboard.writeText(agent.id);
            setAgentIdCopied(true);
            setTimeout(() => setAgentIdCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="uppercase text-xl md:text-3xl font-bold">{agent.name}</h2>
                        <Bot size={30} />
                        <Badge
                            variant={agent.status === 'Running' ? 'outline' : 'secondary'}
                            className="bg-green-500 text-white py-1 px-2 font-medium shadow-none border-none"
                        >
                            {agent.status}
                        </Badge>
                    </div>
                </div>
                <div>
                    <Feedback />
                </div>
            </div>

            <Tabs defaultValue={activeTab || 'insights'} className="w-full">
                <TabsList className="h-12 pb-0 grid w-full grid-cols-3 bg-transparent border-none shadow-none rounded-none">
                    <TabsTrigger
                        value="insights"
                        className="cursor-pointer"
                        onClick={() => router.replace('/agent?tab=insights')}
                    >
                        Insights
                    </TabsTrigger>
                    <TabsTrigger
                        value="data"
                        className="cursor-pointer"
                        onClick={() => router.replace('/agent?tab=data')}
                    >
                        Data
                    </TabsTrigger>
                    <TabsTrigger
                        value="integration"
                        className="cursor-pointer"
                        onClick={() => router.replace('/agent?tab=integration')}
                    >
                        Integration
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="insights" className="space-y-4 pt-4">
                    {
                        <DataUpdatingAlert
                            icon={<Clock12 />}
                            content="We're updating your agent’s data. This may take a few minutes."
                        />
                    }
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                        <InsightCard title="Total Queries" data={agent.totalQueries} icon={<BarChart />} />

                        <InsightCard title="Avg. Response Time" data={agent.avgResponseTime} icon={<Clock9 />} />

                        <InsightCard title="This Month Queries" data={agent.thisMonthQueries} icon={<BarChart />} />

                        <InsightCard
                            title="Last Updated"
                            data={timeAgo(agent.lastUpdated)}
                            icon={<Globe />}
                            metadata={`Website crawled on ${new Date(agent?.lastUpdated).toLocaleDateString()}`}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="data" className="space-y-7 pt-4">
                    <Card className="gap-3 shadow-none border border-neutral-300 dark:border-neutral-800 bg-transparent">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <Hammer className="h-5 w-5 text-muted-foreground" />
                                <CardTitle className="text-lg font-semibold">Training Data</CardTitle>
                            </div>
                            <CardDescription className="text-sm leading-relaxed">
                                Sources your agent uses to answer questions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <div className="font-medium text-base">Website</div>
                                    </div>
                                    <div className="pl-7 space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-sm truncate">{agent.sourceUrl}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {agent.metadata.sourceSubUrls.length} pages crawled
                                                </p>
                                            </div>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="rounded-full shadow-none text-xs px-3 py-1 h-7 shrink-0 bg-transparent"
                                                            disabled
                                                        >
                                                            Recrawl
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Coming soon</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integration" className="pt-4">
                    <Card className="mb-5 gap-2 shadow-none border border-neutral-300 dark:border-neutral-800 bg-transparent">
                        <CardHeader className="pb-3">
                            <CardTitle className="font-semibold text-base">Your Agent ID</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <code className="text-sm font-mono px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-800 block truncate ">
                                        {agent.id}
                                    </code>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopyAgentId}
                                    className="shrink-0 border border-neutral-300 dark:border-neutral-800"
                                >
                                    {agentIdCopied ? (
                                        <>
                                            <Check className="h-4 w-4 mr-1" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4 mr-1" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-1">
                                Your Agent ID — Include this in the {'<script>'} tag to load your agent.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Example questions  */}
                    <Card className="mb-5 gap-2 shadow-none border border-neutral-300 dark:border-neutral-800 bg-transparent">
                        <CardHeader className="pb-3">
                            <CardTitle className="font-semibold text-base ">Example questions</CardTitle>
                            <p className="text-sm my-2">
                                Your can enter example questions . These questions will show on chat box.
                            </p>
                        </CardHeader>
                        <CardContent className="pt-0 w-full">
                            <div className="flex flex-col items-start gap-3">
                                {[1, 2, 3].map((item, idx) => (
                                    <div key={idx}>{item}</div>
                                ))}
                            </div>
                            <Button
                                className="w-full mt-5 shadow-none border border-neutral-300 dark:border-neutral-800"
                                variant="outline"
                            >
                                Change
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none  gap-2 border border-neutral-300 dark:border-neutral-800 bg-transparent">
                        <CardHeader>
                            <CardTitle>Website Integration</CardTitle>
                            <CardDescription>Add your agent to your website</CardDescription>
                        </CardHeader>
                        <CardContent className="bg-transparent">
                            {integrationCode.map((item: IntegrationCodeProp, idx: number) => (
                                <div key={idx} className="mb-5 bg-transparent">
                                    <div className="rounded-md pt-4">
                                        <div
                                            ref={codeRef}
                                            className="bg-transparent rounded-xl font-mono text-sm overflow-x-auto"
                                        >
                                            <SyntaxHighlighter
                                                language="javascript"
                                                style={isCurrentThemeDark ? oneDark : oneLight}
                                                customStyle={{
                                                    padding: '12px',
                                                    fontSize: '15px',
                                                    borderRadius: '12px',
                                                }}
                                                wrapLongLines={true}
                                            >
                                                {item.code}
                                            </SyntaxHighlighter>
                                        </div>

                                        <Button
                                            variant="outline"
                                            onClick={() => handleCopyCode(item.code, idx)}
                                            className="w-full shrink-0 border border-neutral-300 dark:border-neutral-800"
                                        >
                                            {copied === idx ? (
                                                <>
                                                    <Check className="h-4 w-4 mr-1" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4 mr-1" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

const InsightCard = ({
    title,
    data,
    icon,
    metadata,
}: {
    title: string;
    data: number | string | undefined | null;
    icon: React.ReactNode;
    metadata?: string;
}) => {
    return (
        <Card className="shadow-none border border-neutral-300 dark:border-neutral-800 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <span>{icon}</span>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data}</div>
                <p className="text-xs text-muted-foreground">{metadata && metadata}</p>
            </CardContent>
        </Card>
    );
};
