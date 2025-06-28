import { Metadata } from 'next';
import Apikeys from '@/components/Apikeys/Apikeys';

export const metadata: Metadata = {
    title: 'Apikeys',
};

export default function Page() {
    return <Apikeys />;
}
