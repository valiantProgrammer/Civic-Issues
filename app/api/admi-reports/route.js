import { NextResponse } from 'next/server';
import { getReportModel } from '@/models/Report';
import { verifyToken } from '@/lib/auth';


export async function POST(request) {
    try {
        // 1. Get the Authorization header from the request
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'Authorization header is missing or invalid.' },
                { status: 401 }
            );
        }
        console.log("step 1")
        const token = authHeader.split(' ')[1];

        // 2. Verify the token to get the user's information
        const decodedPayload = await verifyToken(token);
        if (!decodedPayload || !decodedPayload.userId) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired token.' },
                { status: 401 }
            );
        }

        // 3. Get the Report model
        const Report = await getReportModel();

        // 4. Find all reports where the 'reporterId' matches the user's ID from the token
        const userReports = await Report.find().sort({ createdAt: -1 }); // .lean() returns plain JavaScript objects for better performance
        console.log(userReports)
        return NextResponse.json({
            success: true,
            reports: userReports
        });

    } catch (error) {
        console.error("Failed to fetch user reports:", error);
        return NextResponse.json(
            { success: false, message: "An error occurred while fetching reports." },
            { status: 500 }
        );
    }
}