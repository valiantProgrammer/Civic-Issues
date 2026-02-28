// lib/db.js
import mongoose from "mongoose";

const connections = {};

export async function connectToDatabase(dbName = "test") {
  if (connections[dbName]) {
    return connections[dbName];
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  // ensure no double slash
  const baseUri = process.env.MONGODB_URI.replace(/\/$/, "");

  const conn = await mongoose.createConnection(`${baseUri}/${dbName}`);

  connections[dbName] = conn;
  return conn;
}