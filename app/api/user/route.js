import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserModel } from '@/models/User';
import { getAdminModel } from '@/models/Admin';
import { getAdministrativeHeadModel } from '@/models/Administrative';

export async function GET(request) {
    try {

        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'Authorization header missing or invalid.' },
                { status: 401 }
            );
        }
        const token = authHeader.split(' ')[1];

        const decodedPayload = await verifyToken(token);

        if (!decodedPayload || !decodedPayload.userId || !decodedPayload.role) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired token.' },
                { status: 401 }
            );
        }
        
        const { userId, role } = decodedPayload;
        let UserModel;


        switch (role) {
            case 'user':
                UserModel = await getUserModel();
                break;
            case 'admin':
                UserModel = await getAdminModel();
                break;
            case 'adminHead':
                UserModel = await getAdministrativeHeadModel();
                break;
            default:
                return NextResponse.json(
                    { success: false, message: `Forbidden: Unknown user role '${role}'.` },
                    { status: 403 }
                );
        }

        const user = await UserModel.findById( userId);
        
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: user,
        }, { status: 200 });

    } catch (error) {
        console.error('Get User Profile Error:', error);
        return NextResponse.json(
            { success: false, message: 'An internal server error occurred.' },
            { status: 500 }
        );
    }
}

