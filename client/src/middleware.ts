import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next/static') ||
        pathname.startsWith('/_next/image') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('/signup') ||
        pathname.endsWith('/signin')
    ) {
        return NextResponse.next();
    }

    if (!req.cookies.get('token')) {
        return NextResponse.redirect(new URL('/signup', req.url));
    }

    // matcher config can also be used

    return NextResponse.next();
}
