import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://retriv.xyz/',
            lastModified: new Date('2025-06-23'),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: 'https://retriv.xyz/pricing',
            lastModified: new Date(),
            changeFrequency: 'monthly',
        },
        {
            url: 'https://retriv.xyz/legal/privacy-policy',
            lastModified: new Date(),
            changeFrequency: 'yearly',
        },
        {
            url: 'https://retriv.xyz/legal/terms-of-service',
            lastModified: new Date(),
            changeFrequency: 'yearly',
        },
    ];
}
