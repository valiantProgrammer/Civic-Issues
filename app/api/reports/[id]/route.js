import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getReportModel } from '@/models/Report';
import { getWardModel } from '@/models/Ward';
import { getMunicipalityModel } from '@/models/Municipalities';
import { verifyToken } from '@/lib/auth';

/**
 * Handles updating a civic issue report.
 * Resets the status to pending and history to show as newly submitted for verification.
 */
export async function PUT(request, { params }) {
    try {
        const reportId = params.id;

        // 1. Authenticate the user
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'Authorization header is missing or invalid.' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];

        const decodedPayload = await verifyToken(token);
        const userId = decodedPayload?.id || decodedPayload?.userId;
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Invalid or expired token.' }, { status: 401 });
        }

        // 2. Parse request body
        const data = await request.json();
        const { Title, Description, category, locationCoordinates, image, severity, verified, building, street, locality, propertyType } = data;

        // 3. Validate required fields
        if (!Title || !Description || !locationCoordinates || !severity) {
            return NextResponse.json({ success: false, message: "Missing required report fields." }, { status: 400 });
        }

        // 4. Get the report and verify ownership
        const Report = await getReportModel();
        const report = await Report.findById(reportId);

        if (!report) {
            return NextResponse.json({ success: false, message: "Report not found." }, { status: 404 });
        }

        if (report.reporterId.toString() !== userId) {
            return NextResponse.json({ success: false, message: "You are not authorized to update this report." }, { status: 403 });
        }

        // 5. Verify coordinates are valid
        const coords = locationCoordinates.map(Number);
        if (!Array.isArray(locationCoordinates) || locationCoordinates.length !== 2) {
            return NextResponse.json({ success: false, message: "Invalid or missing locationCoordinates." }, { status: 400 });
        }

        // 6. Determine Ward and Municipality from coordinates
        const Ward = await getWardModel();
        let wardDoc = await Ward.findOne({ 
            geometry: { 
                $geoIntersects: { 
                    $geometry: { type: "Point", coordinates: coords } 
                } 
            } 
        });

        if (!wardDoc) {
            const nearbyWard = await Ward.findOne({
                geometry: {
                    $near: {
                        $geometry: { type: "Point", coordinates: coords },
                        $maxDistance: 10000 // 10km radius as fallback
                    }
                }
            });
            
            if (!nearbyWard) {
                return NextResponse.json({ 
                    success: false, 
                    message: `Could not determine the ward for the provided location.`,
                }, { status: 400 });
            }
            
            wardDoc = nearbyWard;
        }

        const Municipality = await getMunicipalityModel();
        const muni = await Municipality.findById(wardDoc.municipal_id);
        if (!muni) {
            return NextResponse.json({ success: false, message: "Could not find the municipality for the determined ward." }, { status: 400 });
        }

        // 7. Update the report
        report.Title = Title;
        report.category = category;
        report.Description = Description;
        report.severity = severity;
        report.verified = verified;
        report.image = image;
        report.locationCoordinates = { type: "Point", coordinates: coords };
        report.address = building || street || locality || '';
        report.street = street;
        report.building = building;
        report.locality = locality;
        report.propertyType = propertyType;
        report.ward = wardDoc.ward_number;
        report.municipalityId = muni._id;
        report.municipalityName = muni.name;

        // 8. Reset status and history - mark as newly submitted
        report.status = 'pending';
        report.rejectionReason = null;
        report.history = [];
        report.history.push({
            action: 'created',
            actorId: new mongoose.Types.ObjectId(userId),
            actorName: report.ReporterName,
            actorRole: 'user',
            timestamp: new Date(),
            notes: 'Report resubmitted after rejection.'
        });

        await report.save();

        return NextResponse.json({ 
            success: true,
            message: "Report updated and resubmitted for verification", 
            report: report 
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating report:", error.message, error.stack);
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid JSON format in request body.", details: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
    }
}
