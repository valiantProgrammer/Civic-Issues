import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db.js";

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: Number, required: true },
        age: { type: Number, required: true },
        userId: { type: Number, unique: true },
        password: { type: String, required: true, select: false },
        address: { type: String },
    },
    {
        collection: "Admins",
        timestamps: true
    }
);

export async function getAdminModel() {
    const conn = await connectToDatabase("Admins");
    return conn.models.Report || conn.model("Admins", userSchema);
}