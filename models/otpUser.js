import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db.js";

const otpSchema = new mongoose.Schema(
    {
        otp: String,
        email: String,
        expiresAt: Date,
        createdAt: Date,
    },
    { collection: "OTP" }
);

export async function getOTPModel() {
    const conn = await connectToDatabase("OTP");
    return conn.models.User || conn.model("OTP", otpSchema);
}
