import express from "express";
import mongoose from "mongoose";
import { aiReady, summariseComments } from "../ai/gemini.mjs";

const router = express.Router();
const collection = () => mongoose.connection.collection("feedback");

// Most comments we send to the AI in one go
const MAX_FOR_AI = 100;

router.get("/", async (req, res) => {
  const results = await collection().find({}).sort({ date: -1 }).toArray();
  res.status(200).json(results);
});

// GET /feedback/summary - AI summary of the newest comments (admin page)
router.get("/summary", async (req, res) => {
  if (!aiReady()) {
    return res.status(503).json({ error: "AI summary isn't set up yet. Add GEMINI_API_KEY to backend/.env" });
  }

  const comments = await collection()
    .find({}, { projection: { comment: 1, _id: 0 } })
    .sort({ date: -1 })
    .limit(MAX_FOR_AI)
    .toArray();

  if (comments.length === 0) {
    return res.status(200).json({ summary: "No feedback yet." });
  }

  try {
    const summary = await summariseComments(comments);
    res.status(200).json({ summary });
  } catch (err) {
    res.status(502).json({ error: "Could not make a summary right now" });
  }
});

router.post("/", async (req, res) => {
  const comment = req.body.comment?.trim();
  if (!comment) return res.status(400).json({ error: "Comment is required" });

  const result = await collection().insertOne({ comment, date: new Date() });
  res.status(201).json(result);
});

export default router;