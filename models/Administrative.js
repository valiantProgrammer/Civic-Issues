import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db.js";
import { getNextSequenceValue } from "./counter.js"; // Import the helper function

const administrativeHeadSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: Number, required: true },
        age: { type: Number, required: true },
        designation: { type: String, required: true },
        authority: { type: String, required: true, enum: ['High', 'Medium', 'Low'] },
        municipality: { type: String, required: true },
        municipalId: { type: mongoose.mongo.ObjectId },
        userId: { type: Number, unique: true }, 
        password: { type: String, required: true, select: false },
    },
    { 
        collection: "AdministrativeHeads",
        timestamps: true 
    }
);

administrativeHeadSchema.pre('save', async function (next) {
    if (this.isNew) {
        this.userId = await getNextSequenceValue('administrativeHeadId');
    }
    next();
});

export async function getAdministrativeHeadModel() {
    const conn = await connectToDatabase("Administrative");
    return conn.models.AdministrativeHead || conn.model("AdministrativeHead", administrativeHeadSchema);
}
