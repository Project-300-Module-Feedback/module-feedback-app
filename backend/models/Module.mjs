import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, trim: true },
  name:        { type: String, required: true, trim: true },
  courseIds:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  year:        { type: Number, required: true, min: 1, max: 4 },
  semester:    { type: Number, required: true, enum: [1, 2] },
  credits:     { type: Number, default: 5 },
  lecturerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // for lecturer dashboard
  assessment:  { type: String },         
});
moduleSchema.index({ courseIds: 1, year: 1, semester: 1 }); // fast filtering
moduleSchema.index({ name: "text", code: "text" });         // search box

export default mongoose.model("Module", moduleSchema);