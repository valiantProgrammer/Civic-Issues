import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db.js";

// Comprehensive grievance lifecycle statuses
export const CIVIC_REPORT_STATUSES = [
  // Primary realistic municipal lifecycle
  'submitted',
  'acknowledged',
  'triaged',
  'under_review',
  'needs_information',
  'accepted',
  'rejected',
  'duplicate',
  'assigned',
  'inspection',
  'action_planned',
  'in_progress',
  'on_hold',
  'escalated',
  'resolution_submitted',
  'verification',
  'rework_required',
  'resolved',
  'reopened',
  'appeal_requested',
  'appeal_review',
  'closed',
  // Backward compatibility
  'pending',
  'solved',
  'verified',
  'approved',
  'forwarded',
];

// A sub-schema to track every action taken on a report (comprehensive audit trail)
const HistoryEntrySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    actorId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    actorName: { type: String, default: 'System' },
    actorRole: {
      type: String,
      required: true,
      default: 'system', // 'user', 'system', 'admin', 'administrator', 'field_officer', 'supervisor', 'municipality'
    },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
    recipientId: { type: mongoose.Schema.Types.Mixed, default: null },
    recipientName: { type: String, default: null },
  },
  { _id: false }
);

// SLA Tracking Schema
const SlaSchema = new mongoose.Schema(
  {
    targetHours: { type: Number, default: 48 },
    dueAt: { type: Date },
    breached: { type: Boolean, default: false },
    breachedAt: { type: Date, default: null },
  },
  { _id: false }
);

// Citizen Feedback Schema
const CitizenFeedbackSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5 },
    satisfied: { type: Boolean },
    comment: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Citizen Appeal Schema
const AppealSchema = new mongoose.Schema(
  {
    reason: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'upheld', 'reopened', 'dismissed'],
      default: 'pending',
    },
    reviewNotes: { type: String, default: '' },
    reviewedAt: { type: Date, default: null },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    // --- Ticket ID (Unique alphanumeric identifier: e.g. CIVIC-YYYYMMDD-XXXX) ---
    ticketId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },

    // --- Core Issue Details ---
    Title: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: 'General' },
    Description: { type: String, required: true, trim: true },
    severity: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: true,
      default: 'Medium',
    },

    // --- Reporter Information ---
    ReporterName: { type: String, default: 'Anonymous' },
    reporterId: { type: mongoose.Schema.Types.Mixed, ref: 'User' },
    reporterEmail: { type: String, trim: true },
    reporterPhone: { type: String, trim: true },

    // --- Location Information ---
    locationCoordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere', required: true },
    },
    address: { type: String, default: '' },
    street: { type: String, default: '' },
    building: { type: String, default: '' },
    locality: { type: String, default: '' },
    propertyType: { type: String, default: '' },
    ward: { type: String, required: true },
    municipalityName: { type: String, required: true },
    municipalityId: { type: mongoose.Schema.Types.Mixed, ref: 'Municipality' },

    // --- Media ---
    image: { type: String }, // Thumbnail / primary display image
    mediaUrl: { type: String },
    thumbnailUrl: { type: String },
    mediaType: { type: String, enum: ['image', 'video', 'panorama', 'panaroma'], default: 'image' },

    // --- Workflow & Lifecycle Status ---
    status: {
      type: String,
      enum: CIVIC_REPORT_STATUSES,
      default: 'submitted',
      index: true,
    },
    department: { type: String, trim: true },
    assignedTo: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'AdministrativeHead',
    },
    assignedOfficer: { type: String },
    assignedDepartment: { type: String },
    assignedTeam: { type: String },
    assignedRole: { type: String },
    assignedAt: { type: Date },

    // Flags
    sendToMunicipality: {
      type: Boolean,
      default: false,
    },
    verified: { type: Boolean, default: false },

    // Reasons & Explanations
    rejectionReason: { type: String, default: null },
    rejectedBy: { type: String, default: null },
    holdReason: { type: String, default: null },
    expectedResumeDate: { type: Date, default: null },
    clarificationRequest: { type: String, default: null },
    duplicateOf: { type: String, default: null },

    // Field Inspection & Resolution Verification
    inspectionNotes: { type: String, default: null },
    inspectionImages: [{ type: String }],
    inspectedBy: { type: String, default: null },
    inspectedAt: { type: Date, default: null },

    resolutionNotes: { type: String, default: null },
    resolutionProofImages: [{ type: String }],
    resolvedBy: { type: String, default: null },
    resolvedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },

    // SLA Tracking
    sla: {
      type: SlaSchema,
      default: () => {
        const targetHours = 48;
        return {
          targetHours,
          dueAt: new Date(Date.now() + targetHours * 60 * 60 * 1000),
          breached: false,
          breachedAt: null,
        };
      },
    },

    // Citizen Engagement & Appeals
    citizenFeedback: { type: CitizenFeedbackSchema, default: null },
    appeal: { type: AppealSchema, default: null },

    // --- ML-Based Severity Validation ---
    mlPredictedSeverity: {
      type: String,
      enum: ['Low', 'Medium', 'High', null],
    },
    mlConfidence: {
      type: Number,
      min: 0,
      max: 1,
    },
    severityVerified: {
      type: Boolean,
      default: false,
    },
    severityWarning: { type: String },
    severityMatchedKeywords: [String],

    // --- Comprehensive History Audit Trail ---
    history: [HistoryEntrySchema],
  },
  {
    collection: 'reports',
    timestamps: true,
  }
);

// Pre-save hook: ensure initial history entry and SLA calculations
reportSchema.pre('save', function (next) {
  if (this.isNew) {
    if (!this.history || this.history.length === 0) {
      this.history = [
        {
          action: 'created',
          actorId: this.reporterId || null,
          actorName: this.ReporterName || 'Citizen',
          actorRole: 'user',
          timestamp: this.createdAt || new Date(),
          notes: 'Report registered and ticket generated.',
        },
      ];
    }

    if (!this.sla || !this.sla.dueAt) {
      const hours = this.sla?.targetHours || 48;
      const baseTime = this.createdAt ? new Date(this.createdAt) : new Date();
      this.sla = {
        targetHours: hours,
        dueAt: new Date(baseTime.getTime() + hours * 60 * 60 * 1000),
        breached: false,
        breachedAt: null,
      };
    }
  }
  next();
});

export async function getReportModel() {
  const conn = await connectToDatabase('reports');
  return conn.models.Report || conn.model('Report', reportSchema);
}
