import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('rtv-auth.0')?.value;
    const { pathname } = request.nextUrl;

    if (token && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
        return NextResponse.redirect(new URL('/agent', request.url));
    }

    const protectedRoutes = ['/agent', '/settings', '/profile', '/apikeys', '/logs', '/query'];

    if (!token && protectedRoutes.some((item) => pathname.startsWith(item))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/login',
        '/signup',
        '/agent/:path*',
        '/apikeys/:path*',
        '/settings/:path*',
        '/profile/:path*',
        '/logs/:path*',
        '/query/:path*',
    ],
};
