import localFont from 'next/font/local';

export const orbitron = localFont({
    src: [
        {
            path: './files/Orbitron-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: './files/Orbitron-Medium.ttf',
            weight: '600',
            style: 'normal',
        },
        {
            path: './files/Orbitron-SemiBold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: './files/Orbitron-Bold.ttf',
            weight: '800',
            style: 'normal',
        },
        {
            path: './files/Orbitron-ExtraBold.ttf',
            weight: '900',
            style: 'normal',
        },
    ],
    display: 'swap',
});

export const inter = localFont({
    src: [
        {
            path: './files/Inter-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: './files/Inter-Medium.ttf',
            weight: '600',
            style: 'normal',
        },
        {
            path: './files/Inter-SemiBold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: './files/Inter-Bold.ttf',
            weight: '800',
            style: 'normal',
        },
        {
            path: './files/Inter-ExtraBold.ttf',
            weight: '900',
            style: 'normal',
        },
    ],
    display: 'swap',
});
