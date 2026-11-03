import mongoose from "mongoose";

const rating = { type: Number, required: true, min: 1, max: 5 };

const reviewSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, select: false },
  overall: rating,
  teaching: rating,
  content: rating,
  assessmentFairness: rating,
  hoursPerWeek: { type: Number, min: 0, max: 60 },
  yearTaken:    { type: String, required: true },    // "2025/26"
  recommend:    { type: Boolean, required: true },
  headline:     { type: String, required: true, trim: true, maxlength: 100 },
  body:         { type: String, required: true, trim: true, minlength: 50, maxlength: 1500 },
}, { timestamps: true });

// One review per student per module
reviewSchema.index({ moduleId: 1, userId: 1 }, { unique: true });

reviewSchema.index({ moduleId: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);