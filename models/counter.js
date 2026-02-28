import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db.js";

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // This will be the name of the counter, e.g., 'administrativeUserId'
    sequence_value: { type: Number, default: 0 }
});

export async function getCounterModel() {
    const conn = await connectToDatabase("main"); // Connect to your main database
    return conn.models.Counter || conn.model("Counter", counterSchema);
}

// Helper function to get the next sequential ID
export async function getNextSequenceValue(sequenceName) {
    const Counter = await getCounterModel();
    const sequenceDocument = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true } // `new: true` returns the updated doc, `upsert: true` creates it if it doesn't exist
    );
    return sequenceDocument.sequence_value;
}
