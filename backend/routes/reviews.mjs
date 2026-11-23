import express from "express";
import mongoose from "mongoose";
import Review from "../models/Review.mjs";
import { getStats } from "../utils/stats.mjs";
import { aiReady, summariseReviews } from "../ai/gemini.mjs";
import { requireAuth, requireRole } from "./middleware/auth.mjs";
import { hasBadWords } from "./utils/badwords.mjs";

const router = express.Router();

// need at least this many reviews before we show anything, keeps it anonymous
const MIN_REVIEWS = 3;

// max reviews we send to gemini at once
const MAX_FOR_AI = 100;

// GET /reviews/module/:moduleId - stats and reviews for one module
router.get("/module/:moduleId", async (req, res) => {
  const { moduleId } = req.params;
  if (!mongoose.isValidObjectId(moduleId)) {
    return res.status(400).json({ error: "Invalid module id" });
  }

  const reviews = await Review.find({ moduleId })
    .select("overall teaching content assessmentFairness hoursPerWeek yearTaken recommend headline body createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const enough = reviews.length >= MIN_REVIEWS;

  res.status(200).json({
    count: reviews.length,
    enough,
    minReviews: MIN_REVIEWS,
    stats: enough ? getStats(reviews) : null,
    reviews: enough ? reviews : [],
  });
});

// GET /reviews/summary/:moduleId - gemini summary for one module
router.get("/summary/:moduleId", async (req, res) => {
  const { moduleId } = req.params;
  if (!mongoose.isValidObjectId(moduleId)) {
    return res.status(400).json({ error: "Invalid module id" });
  }

  if (!aiReady()) {
    return res.status(503).json({ error: "AI summary isn't set up yet. Add GEMINI_API_KEY to backend/.env" });
  }

  const reviews = await Review.find({ moduleId })
    .select("headline body")
    .sort({ createdAt: -1 })
    .limit(MAX_FOR_AI)
    .lean();

  if (reviews.length < MIN_REVIEWS) {
    return res.status(400).json({ error: `Needs at least ${MIN_REVIEWS} reviews before it can be summarised` });
  }

  try {
    const summary = await summariseReviews(reviews);
    res.status(200).json({ summary });
  } catch (err) {
    res.status(502).json({ error: "Could not make a summary right now" });
  }
});

router.post("/", requireAuth, requireRole("student"), async (req, res) => {
  // one review per student per module
  const existing = await Review.findOne({ moduleId: req.body.moduleId, userId: req.user.id });
  if (existing) {
    return res.status(409).json({ error: "You have already reviewed this module" });
  }

  if (hasBadWords(req.body.headline) || hasBadWords(req.body.body)) {
    return res.status(400).json({ error: "Please keep your review respectful" });
  }

  const review = new Review({
    moduleId: req.body.moduleId,
    userId: req.user.id,
    overall: req.body.overall,
    teaching: req.body.teaching,
    content: req.body.content,
    assessmentFairness: req.body.assessmentFairness,
    hoursPerWeek: req.body.hoursPerWeek,
    yearTaken: req.body.yearTaken,
    recommend: req.body.recommend,
    headline: req.body.headline,
    body: req.body.body,
  });

  try {
    await review.save();
    res.status(201).json({ message: "Review saved" });
  } catch (err) {
    res.status(400).json({ error: "Please fill in all the fields correctly" });
  }
});

export default router;