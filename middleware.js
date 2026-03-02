import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export default async function middleware(request) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;

    
    const loginUrl = new URL('/login', request.url);

    
    if (!accessToken) {
        return NextResponse.redirect(loginUrl);
    }

    try {
        const payload = await verifyToken(accessToken);

        if (!payload) {
        
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('accessToken');
            response.cookies.delete('refreshToken');
            return response;
        }

        const { role } = payload;

        
        if (pathname.startsWith('/user') && role !== 'user') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        else if (pathname.startsWith('/administration') && role !== 'adminHead') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        else if ((pathname.startsWith('/s/admin') || pathname.startsWith('/administration-signup')) && (role !== 'admin' && role !== 'adminHead')) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        // 4. If all checks pass, allow the request to continue.
        return NextResponse.next();

    } catch (error) {
        console.error('Middleware error:', error);
        // In case of any unexpected error during token verification, redirect to login.
        return NextResponse.redirect(loginUrl);
    }
}

// The 'matcher' configuration specifies which paths this middleware will run on.
export const config = {
    matcher: [
        '/user/:path*',
        '/admin/:path*',
        // '/administration/:path*',
        // '/admin-signup/:path*',
        // '/administration-signup/:path*',
    ],
};
