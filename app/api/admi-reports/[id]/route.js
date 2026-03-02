import { NextResponse } from 'next/server';
import { getReportModel } from '@/models/Report';
import { getAdminModel } from '@/models/Admin';
import { getAdministrativeHeadModel } from '@/models/Administrative';
import mongoose from 'mongoose';
import { getUserModel } from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { sendReportNotificationEmail } from '@/lib/emailService';


export async function PUT(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid report ID format" }, { status: 400 });
  }

  try {
    // 1. Authenticate the user making the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization header is missing or invalid.' 
      }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedPayload = await verifyToken(token);
    const actorId = decodedPayload?.userId || decodedPayload?.id;
    
    if (!actorId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token.' 
      }, { status: 401 });
    }

    // 2. Determine actor role and get actor details
    let actorRole = 'unknown';
    let actorName = 'Unknown User';
    let admin = null;
    let administrator = null;

    // Check if actor is an Admin
    const AdminModel = await getAdminModel();
    admin = await AdminModel.findById(actorId).select('name email authority').lean();
    if (admin) {
      actorRole = 'admin';
      actorName = admin.name || admin.email || 'Admin User';
    } else {
      // Check if actor is an Administrator (Municipal Staff)
      const AdministratorModel = await getAdministrativeHeadModel();
      administrator = await AdministratorModel.findById(actorId).select('name email authority').lean();
      if (administrator) {
        actorRole = 'administrator';
        actorName = administrator.name || administrator.email || 'Administrator';
      }
    }

    const body = await request.json();
    const { status, rejectedReason } = body;

    const validClientStatuses = ["pending", "verified", "solved", "rejected", "approved"];
    if (!status || !validClientStatuses.includes(status)) {
      return NextResponse.json({ message: "A valid status ('pending', 'verified', 'approved', 'rejected') is required" }, { status: 400 });
    }

    const finalStatus = status;
    const updatePayload = { status: finalStatus };

    // Map action name for history
    let historyAction = status;
    if (finalStatus === 'verified') {
      historyAction = 'approved'; // First verification by admin
    }

    // Build history entry
    const historyEntry = {
      action: historyAction,
      actorId: new mongoose.Types.ObjectId(actorId),
      actorName: actorName,
      actorRole: actorRole,
      timestamp: new Date(),
      notes: ''
    };

    if (finalStatus === 'approved') {
      updatePayload.sendToMunicipality = true;
      updatePayload.rejectedReason = null;
      historyEntry.notes = `Report approved and forwarded to municipality by ${actorRole}: ${actorName}`;
    } else if (finalStatus === 'rejected') {
      updatePayload.rejectedReason = rejectedReason || "No reason provided.";
      updatePayload.sendToMunicipality = false;
      updatePayload.rejectedBy = actorName;
      historyEntry.notes = `Reason: ${rejectedReason || 'No reason provided.'}`;
    } else if (finalStatus === 'verified') {
      historyEntry.notes = `Report verified by ${actorRole}: ${actorName}`;
    } else {
      updatePayload.rejectedReason = null;
      updatePayload.sendToMunicipality = false;
      historyEntry.notes = `Status updated to ${status} by ${actorRole}: ${actorName}`;
    }

    // Add history entry to report
    updatePayload.$push = { history: historyEntry };

    const Report = await getReportModel();
    const updatedReport = await Report.findByIdAndUpdate(
      { _id: id },
      updatePayload,
      { new: true }
    );

    if (!updatedReport) {
      return NextResponse.json({ message: "Report not found" }, { status: 404 });
    }

    console.log(`✅ Report ${id} status updated to ${finalStatus} by ${actorRole} ${actorName}`);
    console.log(`✅ History Entry Added:`, historyEntry);

    // Send email notification to user based on status change
    try {
      const userModel = await getUserModel();
      const user = await userModel.findById(updatedReport.reporterId).select('email').lean();
      
      if (user && user.email) {
        const emailStatus = finalStatus === 'verified' ? 'verified' : finalStatus;
        const reason = finalStatus === 'rejected' ? rejectedReason : undefined;
        await sendReportNotificationEmail(user.email, updatedReport, emailStatus, reason);
      }
    } catch (emailError) {
      console.error("Error sending status update email:", emailError.message);
      // Don't block report status update if email fails
    }

    return NextResponse.json(updatedReport);

  } catch (error) {
    console.error(`Failed to update report with ID ${id}:`, error);
    return NextResponse.json(
      { message: "Error updating the report in the database" },
      { status: 500 }
    );
  }
}

