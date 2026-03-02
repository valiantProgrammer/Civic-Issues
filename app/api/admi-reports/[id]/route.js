import { NextResponse } from 'next/server';
import { getReportModel } from '@/models/Report';
import mongoose from 'mongoose';
import { getUserModel } from '@/models/User';
import { sendReportNotificationEmail } from '@/lib/emailService';


export async function PUT(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid report ID format" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { status, rejectedReason } = body;

    const validClientStatuses = ["pending", "verified", "solved", "rejected", "approved"];
    if (!status || !validClientStatuses.includes(status)) {
      return NextResponse.json({ message: "A valid status ('pending', 'verified', 'approved', 'rejected') is required" }, { status: 400 });
    }
    const finalStatus = status;
    const updatePayload = { status: finalStatus };

    if (finalStatus === 'approved') {
      updatePayload.sendToMunicipality = true;
      updatePayload.rejectedReason = null;
    } else if (finalStatus === 'rejected') {
      updatePayload.rejectedReason = rejectedReason || "No reason provided.";
      updatePayload.sendToMunicipality = false;
      updatePayload.rejectedBy = 'Admin';
    } else {
      updatePayload.rejectedReason = null;
      updatePayload.sendToMunicipality = false;
    }

    const Report = await getReportModel();
    const updatedReport = await Report.findByIdAndUpdate(
      {_id : id},
      { $set: updatePayload },
      { new: true }
    );

    if (!updatedReport) {
      return NextResponse.json({ message: "Report not found" }, { status: 404 });
    }

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

