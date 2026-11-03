import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect(process.env.ATLAS_URI, { dbName: "moduleFeedback" });
  console.log("Connected to MongoDB");
}