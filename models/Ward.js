// models/Ward.js
import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db.js";

const WardSchema = new mongoose.Schema(
  {
    ward_number: { type: Number, required: true },
    municipal_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Municipality",
      required: true,
    },
    geometry: {
      type: { type: String, enum: ["Polygon", "MultiPolygon"], required: true },
      coordinates: { type: Array, required: true },
    },
  },
  { collection: "wards" } // ✅ ONLY "wards", not "municipalities.wards"
);

export async function getWardModel() {
  const conn = await connectToDatabase("municipalities");
  return conn.models.Ward || conn.model("Ward", WardSchema);
}
