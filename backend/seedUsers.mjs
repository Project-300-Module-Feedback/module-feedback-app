import "./loadEnvironment.mjs";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./db/connect.mjs";
import User from "./models/User.mjs";
import Module from "./models/Module.mjs";

// makes a lecturer account for testing, password is SEED_PASSWORD in .env
await connectDB();

const lecturer = await User.create({
  email: "lecturer@atu.ie",
  passwordHash: await bcrypt.hash(process.env.SEED_PASSWORD, 10),
  role: "lecturer",
  verified: true,
});

//  Web Programming 2
await Module.updateOne({ code: "COMP07180" }, { $push: { lecturerIds: lecturer._id } });

console.log("Made lecturer@atu.ie");
await mongoose.disconnect();