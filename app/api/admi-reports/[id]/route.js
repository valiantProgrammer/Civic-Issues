import { NextResponse } from 'next/server';
import { getReportModel, CIVIC_REPORT_STATUSES } from '@/models/Report';
import { getAdminModel } from '@/models/Admin';
import { getAdministrativeHeadModel } from '@/models/Administrative';
import mongoose from 'mongoose';
import { getUserModel } from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { sendReportNotificationEmail } from '@/lib/emailService';

export async function PUT(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid report ID format' }, { status: 400 });
  }

  try {
    // 1. Authenticate the actor
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization header is missing or invalid.' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decodedPayload = await verifyToken(token);
    const actorId = decodedPayload?.userId || decodedPayload?.id;

    if (!actorId) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token.' },
        { status: 401 }
      );
    }

    // 2. Identify actor role and name
    let actorRole = 'user';
    let actorName = 'Citizen';

    const AdminModel = await getAdminModel();
    const admin = await AdminModel.findById(actorId).select('fullName name email authority').lean();
    if (admin) {
      actorRole = 'admin';
      actorName = admin.fullName || admin.name || admin.email || 'Admin';
    } else {
      const AdministratorModel = await getAdministrativeHeadModel();
      const administrator = await AdministratorModel.findById(actorId).select('fullName name email designation authority').lean();
      if (administrator) {
        actorRole = 'administrator';
        actorName = administrator.fullName || administrator.name || administrator.email || 'Municipal Officer';
      } else {
        const UserModel = await getUserModel();
        const user = await UserModel.findById(actorId).select('userName email').lean();
        if (user) {
          actorRole = 'user';
          actorName = user.userName || user.email || 'Citizen';
        }
      }
    }

    const body = await request.json();
    const {
      status,
      action,
      notes,
      rejectedReason,
      rejectionReason,
      holdReason,
      expectedResumeDate,
      clarificationRequest,
      assignedOfficer,
      assignedDepartment,
      assignedTeam,
      inspectionNotes,
      resolutionNotes,
      citizenFeedback,
      appeal,
      duplicateOf,
    } = body;

    const chosenStatus = status || action;

    if (!chosenStatus || !CIVIC_REPORT_STATUSES.includes(chosenStatus)) {
      return NextResponse.json(
        { message: `Invalid status or action '${chosenStatus}'. Supported: ${CIVIC_REPORT_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const updatePayload = { status: chosenStatus };
    const historyAction = action || chosenStatus;
    let historyNotes = notes || '';

    // Handle lifecycle state specifics
    if (['rejected'].includes(chosenStatus)) {
      const reason = rejectionReason || rejectedReason || 'No reason specified';
      updatePayload.rejectionReason = reason;
      updatePayload.rejectedBy = actorName;
      updatePayload.sendToMunicipality = false;
      historyNotes = historyNotes || `Rejection Reason: ${reason}`;
    } else if (['needs_information'].includes(chosenStatus)) {
      updatePayload.clarificationRequest = clarificationRequest || notes || 'Clarification required';
      historyNotes = historyNotes || `Clarification requested: ${updatePayload.clarificationRequest}`;
    } else if (['accepted', 'approved'].includes(chosenStatus)) {
      updatePayload.sendToMunicipality = true;
      updatePayload.rejectionReason = null;
      updatePayload.verified = true;
      historyNotes = historyNotes || `Accepted into municipal workflow by ${actorName}`;
    } else if (['assigned'].includes(chosenStatus)) {
      if (assignedOfficer) updatePayload.assignedOfficer = assignedOfficer;
      if (assignedDepartment) updatePayload.assignedDepartment = assignedDepartment;
      if (assignedTeam) updatePayload.assignedTeam = assignedTeam;
      updatePayload.assignedAt = new Date();
      historyNotes = historyNotes || `Assigned to ${assignedDepartment || 'Department'} (${assignedOfficer || assignedTeam || 'Field Unit'})`;
    } else if (['inspection'].includes(chosenStatus)) {
      if (inspectionNotes) updatePayload.inspectionNotes = inspectionNotes;
      updatePayload.inspectedBy = actorName;
      updatePayload.inspectedAt = new Date();
      historyNotes = historyNotes || `Field inspection performed by ${actorName}: ${inspectionNotes || 'Completed'}`;
    } else if (['on_hold'].includes(chosenStatus)) {
      updatePayload.holdReason = holdReason || notes || 'Work temporarily suspended';
      if (expectedResumeDate) updatePayload.expectedResumeDate = new Date(expectedResumeDate);
      historyNotes = historyNotes || `Placed on hold: ${updatePayload.holdReason}`;
    } else if (['resolution_submitted'].includes(chosenStatus)) {
      updatePayload.resolutionNotes = resolutionNotes || notes;
      updatePayload.resolvedBy = actorName;
      historyNotes = historyNotes || `Work completion proof submitted by ${actorName}: ${resolutionNotes || 'Ready for supervisor verification'}`;
    } else if (['resolved', 'solved'].includes(chosenStatus)) {
      updatePayload.resolvedAt = new Date();
      updatePayload.sendToMunicipality = true;
      historyNotes = historyNotes || `Resolved and certified by supervisor ${actorName}`;
    } else if (['closed'].includes(chosenStatus)) {
      updatePayload.closedAt = new Date();
      historyNotes = historyNotes || `Grievance case formally closed after feedback/verification`;
    } else if (['reopened'].includes(chosenStatus)) {
      historyNotes = historyNotes || `Citizen indicated issue not resolved: Case reopened for field re-inspection`;
    } else if (['duplicate'].includes(chosenStatus)) {
      if (duplicateOf) updatePayload.duplicateOf = duplicateOf;
      historyNotes = historyNotes || `Marked as duplicate of primary ticket ${duplicateOf || 'CIVIC-REPORT'}`;
    }

    if (citizenFeedback) {
      updatePayload.citizenFeedback = citizenFeedback;
    }
    if (appeal) {
      updatePayload.appeal = appeal;
    }

    // Build audit trail history entry
    const historyEntry = {
      action: historyAction,
      actorId: new mongoose.Types.ObjectId(actorId),
      actorName: actorName,
      actorRole: actorRole,
      timestamp: new Date(),
      notes: historyNotes,
    };

    updatePayload.$push = { history: historyEntry };

    const Report = await getReportModel();
    const updatedReport = await Report.findByIdAndUpdate(id, updatePayload, { new: true });

    if (!updatedReport) {
      return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }

    console.log(`✅ Report ${id} lifecycle transitioned to ${chosenStatus} by ${actorRole}: ${actorName}`);

    // Send status update notification email if reporter exists
    try {
      const userModel = await getUserModel();
      const user = await userModel.findById(updatedReport.reporterId).select('email').lean();
      if (user && user.email) {
        const reason = chosenStatus === 'rejected' ? (rejectionReason || rejectedReason) : undefined;
        await sendReportNotificationEmail(user.email, updatedReport, chosenStatus, reason);
      }
    } catch (emailError) {
      console.error('Status email dispatch error:', emailError.message);
    }

    return NextResponse.json({
      success: true,
      message: `Report status updated to ${chosenStatus}`,
      report: updatedReport,
    });
  } catch (error) {
    console.error(`Failed to update report ${id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Error updating report in database', error: error.message },
      { status: 500 }
    );
  }
}
