import { Metadata } from 'next';
import Queries from '@/components/Query/Queries';

export const metadata: Metadata = {
    title: 'Query',
};

export default function Page() {
    return <Queries />;
}
