import { NextResponse } from 'next/server';


export async function POST() {
    try {

        const response = NextResponse.json({
            success: true,
            message: 'Logout successful.',
        }, { status: 200 });


        const cookieOptions = {
            path: '/',
            maxAge: 0, 
            secure: process.env.NEXT_PUBLIC_API_BASE_URL,
            sameSite: 'strict',
        };

        response.cookies.set('accessToken', '', cookieOptions);
        response.cookies.set('refreshToken', '', cookieOptions);

        return response;

    } catch (error) {
        console.error('Logout Error:', error);
        return NextResponse.json(
            { success: false, message: 'An internal server error occurred during logout.' },
            { status: 500 }
        );
    }
}

