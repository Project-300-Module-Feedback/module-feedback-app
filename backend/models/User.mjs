import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
    match: [/@atu\.ie$/, "Must be an ATU email address"],
  },
  passwordHash: { type: String, required: true, select: false },
  role:     { type: String, enum: ["student", "lecturer", "admin"], default: "student" },
  verified: { type: Boolean, default: false },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  year:     { type: Number, min: 1, max: 4 },
}, { timestamps: true });

export default mongoose.model("User", userSchema);