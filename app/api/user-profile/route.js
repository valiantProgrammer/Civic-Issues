import { NextResponse } from 'next/server';
import { getUserModel } from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
    try {
        // Get token from cookies or authorization header
        const token = request.cookies.get('accessToken')?.value || 
                      request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        // Verify token and get userId
        const payload = await verifyToken(token);
        if (!payload || !payload.userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - Invalid token' },
                { status: 401 }
            );
        }

        const User = await getUserModel();
        const user = await User.findById(payload.userId).select('-password');

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                user: {
                    _id: user._id,
                    userName: user.userName,
                    email: user.email,
                    phone: user.phone,
                    address: user.Address,
                    age: user.age,
                    userId: user.userId,
                    timeOfLogin: user.timeOfLogin
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
