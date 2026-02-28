import { NextResponse } from 'next/server';
import { getAdminModel } from '@/models/Admin';
import { verifyPassword } from '@/lib/auth';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth';

export async function POST(request) {
    try {
        const body = await request.json();
        console.log(body);
        const { userId, password } = body;


        if (!userId || !password) {
            return NextResponse.json(
                { success: false, message: 'UserId and password are required.' },
                { status: 400 }
            );
        }

        const Admin = await getAdminModel();
        const admin = await Admin.findOne({ userId }).select('+password');
        console.log(admin)
        if (!admin) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials. Please try again.' },
                { status: 401 } // Ata change hoye giyechilo...
            );
        }
        // console.log("Step 1 cleared")
        
        
        const isPasswordValid = await verifyPassword(password, admin.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials. Please try again.' },
                { status: 401 }
            );
        }
        // console.log("Step 2 cleared")
        

        const tokenPayload = {
            userId: admin._id.toString(),
            role: admin.role || 'admin'
        };

        const [accessToken, refreshToken] = await Promise.all([
            generateAccessToken(tokenPayload),
            generateRefreshToken(tokenPayload)
        ]);


        const { password: _, ...adminData } = admin.toObject();


        return NextResponse.json({
            success: true,
            message: 'Admin sign-in successful!',
            accessToken,
            refreshToken,
            user: adminData
        }, { status: 200 });

    } catch (error) {
        console.error('Admin Signin Error:', error);
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
