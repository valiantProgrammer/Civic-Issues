// models/Report.js
import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db.js";

const userSchema = new mongoose.Schema(
  {
    userName: String,
    Address: String,
    userId: Number,
    age: Number,
    phone: Number,
    timeOfLogin: String,
    email: String,
    password: String,
  },
  { collection: "User" }
);

export async function getUserModel() {
  const conn = await connectToDatabase("User");
  return conn.models.User || conn.model("User", userSchema);
}
