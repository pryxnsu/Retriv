'use client';

import { LoaderCircle } from 'lucide-react';
import { getLocalStorage } from '@/lib/storage';
import { useEffect, useState } from 'react';

interface LoaderProp {
    strokeWidth: string;
    size: string;
}

export default function Loader({ strokeWidth = '2px', size = '1.5px' }: LoaderProp) {
    const [isDarkTheme, setIsDarkTheme] = useState<boolean | null>(null);

    useEffect(() => {
        const isCurrentThemeDark = getLocalStorage('isDarkTheme');

        setIsDarkTheme(isCurrentThemeDark === true);
    }, []);

    if (isDarkTheme === null) return null;
    return (
        <div className="animate-spin">
            <LoaderCircle color={isDarkTheme ? 'white' : 'black'} strokeWidth={strokeWidth} size={size} />
        </div>
    );
}
