import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db.js";

// A sub-schema to track every action taken on a report (audit trail)
const HistoryEntrySchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['created', 'approved', 'rejected', 'forwarded', 'transferred', 'pending'], // 'pending' for when it's reassigned
    },
    actorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    actorName: { type: String },
    actorRole: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String }, // For rejection reasons, transfer notes, etc.
    recipientId: { type: mongoose.Schema.Types.ObjectId },
    recipientName: { type: String },
}, { _id: false });


const reportSchema = new mongoose.Schema(
    {
        // --- Core Issue Details ---
        Title: { type: String, required: true, trim: true },
        category: { type: String, trim: true },
        Description: { type: String, required: true, trim: true },
        severity: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
        
        // --- Reporter Information ---
        ReporterName: { type: String, default: 'Anonymous' },
        reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        // --- Location Information ---
        locationCoordinates: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number], index: '2dsphere', required: true },
        },
        address: { type: String },
        street: { type: String },
        building: { type: String },
        locality: { type: String },
        propertyType: { type: String },
        ward: { type: String, required: true },
        municipalityName: { type: String, required: true },
        municipalityId: { type: mongoose.Schema.Types.ObjectId, ref: "Municipality" },
        
        // --- Media ---
        image: { type: String }, // For general-purpose display, could be a thumbnail
        mediaType: { type: String, enum: ['video', 'panaroma'] },

        // --- Workflow & Status ---
        status: {
            type: String,
            enum: ["pending", "solved", "rejected", "forwarded"],
            default: "pending",
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AdministrativeHead", 
        },
        assignedRole: {
            type: String,
            enum: ["Low", "Medium", "High"],
        },
        // This field is required for the new API route logic
        sendToMunicipality: {
            type: Boolean,
            default: false,
        },
        rejectionReason: { type: String },
        verified: { type: Boolean, default: false }, // For AI verification
        
        history: [HistoryEntrySchema],
    },
    { 
        collection: "reports",
        timestamps: true // Adds createdAt and updatedAt fields automatically
    }
);

// Pre-save hook to add the initial 'created' entry to the history
reportSchema.pre('save', function(next) {
    if (this.isNew) {
        this.history.push({
            action: 'created',
            actorId: this.reporterId,
            actorName: this.ReporterName,
            actorRole: 'user', // Assuming the initial reporter is a 'user'
            notes: 'Report submitted by citizen.'
        });
    }
    next();
});

export async function getReportModel() {
    const conn = await connectToDatabase("reports");
    return conn.models.Report || conn.model("Report", reportSchema);
}

