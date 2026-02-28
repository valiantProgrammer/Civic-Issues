import { NextResponse } from 'next/server';
import { getUserModel } from '@/models/User';
import { verifyPassword } from '../../../lib/auth';
import { generateAccessToken, generateRefreshToken } from '../../../lib/auth';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;


        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required.' },
                { status: 400 }
            );
        }


        const User = await getUserModel();

        const user = await User.findOneAndUpdate(
            { email }, // The filter to find the document
            { $set: { timeOfLogin: new Date() } }, // The update to apply
            { new: true, select: '+password' } // Options
        );

        if (!user) {

            return NextResponse.json(
                { success: false, message: 'Invalid credentials.' },
                { status: 401 }
            );
        }


        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials.' },
                { status: 401 }
            );
        }


        const tokenPayload = {
            userId: user._id.toString(),
            role: 'user'
        };
        console.log(user._id.toString());
        const accessToken = await generateAccessToken(tokenPayload);
        const refreshToken = await generateRefreshToken(tokenPayload);



        const userObject = user.toObject();
        const { password: _, ...userWithoutPassword } = userObject;

        return NextResponse.json({
            success: true,
            message: 'Sign-in successful!',
            user: userWithoutPassword,
            accessToken,
            refreshToken
        }, { status: 200 });

    } catch (error) {
        console.error('Sign-in Error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'An internal server error occurred.',
                error: error.message
            },
            { status: 500 }
        );
    }
}