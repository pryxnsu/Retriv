import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/agent', '/apikeys', '/logs', '/query/*', '/settings', '/profile'],
        },
        sitemap: 'https://retriv.xyz/sitemap.xml',
    };
}
