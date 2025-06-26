import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="skeleton"
            className={cn('bg-[#EAE4D5] dark:bg-accent animate-pulse rounded-md', className)}
            {...props}
        />
    );
}

export { Skeleton };
