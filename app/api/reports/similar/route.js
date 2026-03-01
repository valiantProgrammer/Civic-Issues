import { NextResponse } from 'next/server';
import { getReportModel } from '@/models/Report';

/**
 * Fetches count of similar reports by:
 * 1. Same ward/area
 * 2. Same category
 * 3. Combination of both
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const reportId = searchParams.get('reportId');
        const ward = searchParams.get('ward');
        const category = searchParams.get('category');

        if (!reportId || !ward || !category) {
            return NextResponse.json({ 
                success: false, 
                message: "Missing required parameters: reportId, ward, category" 
            }, { status: 400 });
        }

        const Report = await getReportModel();

        // Count reports in the same area (same ward)
        const areaCount = await Report.countDocuments({
            _id: { $ne: reportId },
            ward: ward,
            status: { $ne: 'rejected' } // Don't count rejected reports
        });

        // Count reports with the same category
        const categoryCount = await Report.countDocuments({
            _id: { $ne: reportId },
            category: category,
            status: { $ne: 'rejected' }
        });

        // Count reports with both same area AND category (overlap)
        const similarCount = await Report.countDocuments({
            _id: { $ne: reportId },
            ward: ward,
            category: category,
            status: { $ne: 'rejected' }
        });

        return NextResponse.json({
            success: true,
            areaCount,       // Total reports in same ward
            categoryCount,   // Total reports with same category
            totalSimilar: similarCount // Reports with both same ward AND category
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching similar reports:", error.message);
        return NextResponse.json({ 
            error: "Internal server error", 
            details: error.message 
        }, { status: 500 });
    }
}
