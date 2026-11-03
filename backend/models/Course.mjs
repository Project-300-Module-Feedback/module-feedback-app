import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  code:       { type: String, required: true, unique: true, trim: true },
  name:       { type: String, required: true, trim: true },
  department: { type: String, required: true },
  campus:     { type: String, required: true },
});

export default mongoose.model("Course", courseSchema);