import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
  email:     { type: String, required: true, lowercase: true },
  codeHash:  { type: String, required: true },
  attempts:  { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, expires: 0 }, // auto-deletes when expired
});

export default mongoose.model("VerificationCode", codeSchema);