import { NextResponse } from 'next/server';
import { generateAccessToken, generateRefreshToken } from '../../../lib/auth';
import { getOTPModel } from '@/models/otpUser';
import { getUserModel } from '@/models/User';
import { hashPassword } from '../../../lib/auth';
import { generateNumericId } from '@/utils/idGenerator';

/**
 * @param {Request} request
 * @returns {NextResponse}
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { fullName, address, email, phone, age, password, otp } = body;


        if (!fullName || !email || !password || !otp) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields: fullName, email, password, and otp are required.' },
                { status: 401 }
            );
        }


        const OTP = await getOTPModel();
        console.log(typeof(otp))
        const verification = await OTP.findOne({
            email,
            otp,
            expiresAt: { $gt: new Date() }
        });

        if (!verification) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired OTP. Please try again.' },
                { status: 400 }
            );
        }


        const User = await getUserModel();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'A user with this email already exists.' },
                { status: 409 }
            );
        }


        const hashedPassword = await hashPassword(password);
        const userId = generateNumericId();

        const newUser = new User({
            userName: fullName,
            Address: address,
            email,
            phone,
            age,
            password: hashedPassword,
            userId,
            timeOfLogin: new Date()
        });


        const savedUser = await newUser.save();


        await OTP.deleteOne({ email });


        const user = {
            id: savedUser.userId.toString(),
            role: 'user'
        };
        const [accessToken, refreshToken] = await Promise.all([
            generateAccessToken(user),
            generateRefreshToken(user)
        ]);



        const { password: _, ...userWithoutPassword } = savedUser.toObject();

        return NextResponse.json(
            {
                success: true,
                message: 'Registration successful!',
                accessToken,
                refreshToken,
                user: userWithoutPassword
            },
            { status: 201 }
        );

    } catch (err) {

        console.error('Registration Error:', err);
        return NextResponse.json(
            {
                success: false,
                message: 'An internal server error occurred.',
                error: err.message
            },
            { status: 500 }
        );
    }
}