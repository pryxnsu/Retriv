'use client';

import clsx from 'clsx';
import { Card } from './ui/card';

const insights = [
    {
        title: 'Total queries Asked',
        data: '1,247',
        className: 'text-blue-600 dark:text-blue-400',
    },
    {
        title: 'This month queries',
        data: '678',
        className: 'text-green-600 dark:text-green-400',
    },
    {
        title: 'Avg Response Time',
        data: '2.3s',
        className: 'text-purple-600 dark:text-purple-400',
    },
];

function MonitorQueries() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((insight) => (
                    <Card
                        key={insight.title}
                        className="p-4 text-center border  border-neutral-300 dark:border-neutral-800"
                    >
                        <div className={clsx('text-2xl font-bold text-blue-600 dark:text-blue-400', insight.className)}>
                            {insight.data}
                        </div>
                        <div className="text-sm text-muted-foreground">{insight.title}</div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default MonitorQueries;
