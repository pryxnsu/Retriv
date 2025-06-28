import { Metadata } from 'next';
import Pricing from '@/components/Pricing/Pricing';

export const metadata: Metadata = {
    title: 'Pricing',
};

export default function Page() {
    return <Pricing />;
}
