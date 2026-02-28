import { NextResponse } from 'next/server';
import { getAdministrativeHeadModel } from '@/models/Administrative';
import { verifyPassword, generateAccessToken, generateRefreshToken } from '@/lib/auth';

export async function POST(request) {
    try {
        const { loginId, password } = await request.json();

        // 1. Validate incoming data
        if (!loginId || !password) {
            return NextResponse.json(
                { success: false, message: 'User ID and password are required.' },
                { status: 400 }
            );
        }

        // 2. Get the model for Administrative Heads
        const AdministrativeHead = await getAdministrativeHeadModel();

        // 3. Find the user by either email or userId.
        // The '.select("+password")' is crucial to retrieve the password for verification.
        const adminHead = await AdministrativeHead.findOne({
            $or: [{ userId: loginId }],
        }).select('+password');

        if (!adminHead) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials. Please try again.' },
                { status: 401 } // 401 Unauthorized
            );
        }

        // 4. Verify the provided password against the stored hash
        const isPasswordValid = await verifyPassword(password, adminHead.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials. Please try again.' },
                { status: 401 }
            );
        }

        // 5. Generate JWTs with the correct role
        const tokenPayload = {
            userId: adminHead._id.toString(),
            role: 'adminHead' // Set the role specifically for this user type
        };

        const [accessToken, refreshToken] = await Promise.all([
            generateAccessToken(tokenPayload),
            generateRefreshToken(tokenPayload)
        ]);

        // 6. Prepare the user data to send back, excluding the password
        const { password: _, ...headData } = adminHead.toObject();

        // 7. Return a success response
        return NextResponse.json({
            success: true,
            message: 'Login successful!',
            accessToken,
            refreshToken,
            user: headData,
        }, { status: 200 });

    } catch (error) {
        console.error('Administrative Head Signin Error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'An internal server error occurred.',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
