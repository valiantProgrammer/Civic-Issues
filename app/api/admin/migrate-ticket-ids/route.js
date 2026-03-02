/**
 * Migration Script to Add Ticket IDs to Existing Reports
 * Run this once to backfill ticketId for all reports missing one
 * 
 * Usage:
 * 1. Copy this to app/api/admin/migrate-ticket-ids/route.js
 * 2. Call: POST http://localhost:3000/api/admin/migrate-ticket-ids
 * 3. Delete the endpoint after running
 */

import { NextResponse } from 'next/server';
import { getReportModel } from '@/models/Report';
import { getCounterModel } from '@/models/counter';

export async function POST(request) {
  try {
    const Report = await getReportModel();
    
    // Find all reports without ticketId
    const reportsWithoutTicketId = await Report.find({ ticketId: { $exists: false } });
    
    if (reportsWithoutTicketId.length === 0) {
      return NextResponse.json({ 
        message: 'All reports already have ticket IDs',
        count: 0 
      }, { status: 200 });
    }

    const Counter = await getCounterModel();
    let successCount = 0;
    let errorCount = 0;

    // Process each report
    for (const report of reportsWithoutTicketId) {
      try {
        // Get the date from the report's createdAt
        const createdDate = new Date(report.createdAt);
        const year = createdDate.getFullYear();
        const month = String(createdDate.getMonth() + 1).padStart(2, '0');
        const day = String(createdDate.getDate()).padStart(2, '0');
        const dateStr = `${year}${month}${day}`;

        // Get next sequence number for that date
        const counter = await Counter.findByIdAndUpdate(
          dateStr,
          { $inc: { sequence_value: 1 } },
          { new: true, upsert: true }
        );

        const sequence = String(counter.sequence_value).padStart(5, '0');
        const ticketId = `CIVIC-${dateStr}-${sequence}`;

        // Update the report with the new ticket ID
        await Report.findByIdAndUpdate(report._id, { ticketId }, { new: true });
        
        successCount++;
        console.log(`✅ Added ticketId ${ticketId} to report ${report._id}`);
      } catch (reportError) {
        errorCount++;
        console.error(`❌ Error updating report ${report._id}:`, reportError.message);
      }
    }

    return NextResponse.json({
      message: 'Migration completed',
      totalProcessed: reportsWithoutTicketId.length,
      successCount,
      errorCount
    }, { status: 200 });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed',
      details: error.message 
    }, { status: 500 });
  }
}
