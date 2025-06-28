'use client';

import { orbitron } from '@/lib/fonts/fonts';
import MobileMenuItems from '@/components/MenuItems';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

export const useMediaQuery = (): boolean => {
    const isMobileOrTabletMediaQuery = '(max-width: 1024px)';
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const media = window.matchMedia(isMobileOrTabletMediaQuery);
        const updateMatch = () => setMatches(media.matches);

        updateMatch();

        media.addEventListener('change', updateMatch);

        return () => media.removeEventListener('change', updateMatch);
    }, []);

    return matches;
};

export default function MobileNavbar() {
    const pathname = usePathname();
    const isMobileOrTablet = useMediaQuery();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const handleMenuToggle = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    if (!isMobileOrTablet) return null;
    return (
        <>
            <div
                aria-label="mobile-menu"
                className="sticky top-0 bg-[#F9F6F0] dark:bg-black flex justify-between px-4 py-4 border-b z-50"
            >
                <div className={`flex justify-between px-2 ${orbitron.className}`}>
                    <span className="text-2xl font-semibold">Retriv</span>
                </div>
                <span>
                    <Button variant={'link'} onClick={handleMenuToggle}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </Button>
                </span>
            </div>
            {isMobileMenuOpen && <MobileMenuItems onItemClick={handleMenuToggle} />}
        </>
    );
}
