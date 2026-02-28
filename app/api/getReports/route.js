import { NextResponse } from 'next/server';
import { getReportModel } from '@/models/Report';
import { verifyToken } from '@/lib/auth';

/**
 * Fetches all reports submitted by the currently authenticated user.
 * This is a protected route that requires a valid JWT.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} A JSON response containing the user's reports or an error.
 */
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
        const userReports = await Report.find({ reporterId: decodedPayload.userId })
            .sort({ createdAt: -1 }) // Sort by the newest reports first
            .lean(); // .lean() returns plain JavaScript objects for better performance
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

