import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getReportModel } from '@/models/Report';
import { getWardModel } from '@/models/Ward';
import { getMunicipalityModel } from '@/models/Municipalities';
import { getUserModel } from '@/models/User';
import { getAdministrativeHeadModel } from '@/models/Administrative';
import { verifyToken } from '@/lib/auth';

/**
 * Handles the creation of a new civic issue report.
 * This is a protected route that requires a valid JWT.
 * It authenticates the user, parses the JSON payload, validates and enriches the data,
 * automatically assigns the report to the relevant authority, and saves it to the database.
 */
export async function POST(request) {
    try {
        // 1. Authenticate the user and get their ID from the token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'Authorization header is missing or invalid.' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];

        const decodedPayload = await verifyToken(token);
        const reporterId = decodedPayload?.id || decodedPayload?.userId;
        if (!reporterId) {
            return NextResponse.json({ success: false, message: 'Invalid or expired token.' }, { status: 401 });
        }

        // 2. Securely fetch the reporter's details from the database
        const User = await getUserModel();
        const reporter = await User.findById(reporterId).lean();
        if (!reporter) {
            return NextResponse.json({ success: false, message: 'Reporter not found.' }, { status: 404 });
        }
        const reporterName = reporter.fullName; // Use the authoritative name from DB

        // 3. **FIXED**: Parse the request body as JSON instead of FormData
        const data = await request.json();
        console.log(data)
        const { Title, Description, locationCoordinates, image, mediaUrl, thumbnailUrl, mediaType, severity, verified, category, sendToMunicipality, street, building, locality, propertyType } = data;

        // 4. Validate payload
        if (!Title || !Description || !locationCoordinates || !severity) {
            return NextResponse.json({ success: false, message: "Missing required report fields." }, { status: 400 });
        }
        console.log(Title)
        console.log(Description)
        console.log(locationCoordinates)
        console.log(severity)
        if (!Array.isArray(locationCoordinates) || locationCoordinates.length !== 2) {
            return NextResponse.json({ success: false, message: "Invalid or missing locationCoordinates." }, { status: 400 });
        }

        const coords = locationCoordinates.map(Number);

        // 5. Determine Ward and Municipality from coordinates
        const Ward = await getWardModel();
        let wardDoc = await Ward.findOne({ geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: coords } } } });
        console.log("Ward lookup result:", wardDoc);
        
        if (!wardDoc) {
            // If exact geospatial lookup fails, try a nearby location approach
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
                    message: `Could not determine the ward for the provided location (${coords[0]}, ${coords[1]}). Please try another location within the service area.`,
                    coordinates: coords
                }, { status: 400 });
            }
            
            wardDoc = nearbyWard;
        }

        const Municipality = await getMunicipalityModel();
        const muni = await Municipality.findById(wardDoc.municipal_id);
        if (!muni) {
            return NextResponse.json({ success: false, message: "Could not find the municipality for the determined ward." }, { status: 400 });
        }
        
        // 6. Automatically find the primary authority for the municipality to assign the report
        const AdminHead = await getAdministrativeHeadModel();
        console.log(AdminHead)
        const assignedAdmin = await AdminHead.findOne({ 
            municipality: muni.name, 
            authority: 'Low' // Assuming 'low' is the primary contact
        }).lean();

        if (!assignedAdmin) {
            return NextResponse.json({ success: false, message: `No primary authority found for ${muni.name} to assign the report to.` }, { status: 404 });
        }

        // 7. Create and save the new report
        const Report = await getReportModel();
        const newReport = new Report({
            Title,
            Description,
            category,
            severity,
            ReporterName: reporterName, // Using name from DB
            reporterId: new mongoose.Types.ObjectId(reporterId),
            locationCoordinates: { type: "Point", coordinates: coords },
            address: building || street || locality || '',
            street,
            building,
            locality,
            propertyType,
            ward: wardDoc.ward_number,
            municipalityId: muni._id,
            municipalityName: muni.name,
            image: thumbnailUrl || image,
            mediaUrl: mediaUrl || image,
            thumbnailUrl: thumbnailUrl,
            mediaType,
            verified,
            sendToMunicipality: true, // Automatically flag for municipal attention
            assignedTo: assignedAdmin._id,
            assignedRole: assignedAdmin.authority
        });
        
        await newReport.save();

        return NextResponse.json({ message: "Report submitted and assigned successfully", report: newReport }, { status: 201 });

    } catch (error) {
        console.error("Error saving report:", error.message, error.stack);
        // Handle JSON parsing errors specifically
        if (error instanceof SyntaxError) {
             return NextResponse.json({ error: "Invalid JSON format in request body.", details: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
    }
}

