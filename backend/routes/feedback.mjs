import express from "express";
import mongoose from "mongoose";

const router = express.Router();
const collection = () => mongoose.connection.collection("feedback");

router.get("/", async (req, res) => {
  const results = await collection().find({}).sort({ date: -1 }).toArray();
  res.status(200).json(results);
});

router.post("/", async (req, res) => {
  const comment = req.body.comment?.trim();
  if (!comment) return res.status(400).json({ error: "Comment is required" });

  const result = await collection().insertOne({ comment, date: new Date() });
  res.status(201).json(result);
});

export default router;