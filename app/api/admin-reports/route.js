import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getReportModel } from '@/models/Report';
import { getAdminModel } from '@/models/Admin'; 
import { getAdministrativeHeadModel } from '@/models/Administrative'; 
import mongoose from 'mongoose';
import { useId } from 'react';

/**
 * Fetches reports for an authenticated admin based on their authority level.
 * - 'low' authority: Gets all reports for their municipality where sendToMunicipality is true.
 * - 'medium'/'high' authority: Gets reports directly assigned to them.
 */
export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ success: false, message: 'Authorization token not provided.' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded || !decoded.role || !decoded.userId) {
            return NextResponse.json({ success: false, message: 'Invalid or expired token.' }, { status: 401 });
        }
        
        const { userId, role } = decoded;
        let UserModel = await getAdministrativeHeadModel();

        // Determine which model to use based on the role in the token
        console.log(userId)

        const user = await UserModel.findById(userId);
        console.log(user)
        if (!user) {
            return NextResponse.json({ success: false, message: 'Authenticated user not found.' }, { status: 404 });
        }

        const Report = await getReportModel();
        let reports;

        // Fetch reports based on the user's authority level
        // These fields (authority, municipality) MUST exist on the user/admin model
        const userAuthority = user.authority; 

        if (userAuthority === 'Low') {
            // Low authority sees all pending reports for their municipality that have been flagged for municipal attention.
            reports = await Report.find({
                municipalityId : user.municipalId,
                sendToMunicipality: true
            }).sort({ createdAt: -1 }); // Sort by newest first
            console.log(reports)
        } else if (userAuthority === 'medium' || userAuthority === 'high') {
            // Medium and High authority see reports specifically assigned to them.
            reports = await Report.find({
                assignedTo: user._id
            }).sort({ createdAt: -1 });
        } else {
            // If the user has no defined authority, return an empty list.
            reports = [];
        }

        return NextResponse.json({
            success: true,
            reports: reports,
        }, { status: 200 });

    } catch (error) {
        console.error('Get Admin Reports Error:', error);
        return NextResponse.json(
            { success: false, message: 'An internal server error occurred.' },
            { status: 500 }
        );
    }
}
