/**
 * Diagnostic endpoint to check report ticketId status
 * Shows how many reports have ticketId vs don't
 */

import { NextResponse } from 'next/server';
import { getReportModel } from '@/models/Report';

export async function GET(request) {
  try {
    const Report = await getReportModel();
    
    const totalReports = await Report.countDocuments();
    const reportsWithTicketId = await Report.countDocuments({ ticketId: { $exists: true, $ne: null } });
    const reportsWithoutTicketId = await Report.countDocuments({ ticketId: { $exists: false } });
    
    // Get sample reports
    const sampleWithTicketId = await Report.find({ ticketId: { $exists: true, $ne: null } })
      .select('_id ticketId Title createdAt')
      .limit(3)
      .lean();
    
    const sampleWithoutTicketId = await Report.find({ ticketId: { $exists: false } })
      .select('_id Title createdAt')
      .limit(3)
      .lean();

    return NextResponse.json({
      summary: {
        totalReports,
        withTicketId: reportsWithTicketId,
        withoutTicketId: reportsWithoutTicketId,
        percentage: totalReports > 0 ? Math.round((reportsWithTicketId / totalReports) * 100) : 0
      },
      samples: {
        withTicketId: sampleWithTicketId,
        withoutTicketId: sampleWithoutTicketId
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json({ 
      error: 'Diagnostic failed',
      details: error.message 
    }, { status: 500 });
  }
}
