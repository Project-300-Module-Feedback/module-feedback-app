import express from "express";
import mongoose from "mongoose";
import Review from "../models/Review.mjs";
import Module from "../models/Module.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { getStats, getRatingCounts } from "../utils/stats.mjs";
import { aiReady, summariseReviews } from "../ai/gemini.mjs";

const router = express.Router();

// need at least this many reviews before we show anything, keeps it anonymous
const MIN_REVIEWS = 3;

// max reviews we send to gemini at once
const MAX_FOR_AI = 100;

// POST /reviews - a logged in student saves a review for one module
router.post("/", requireAuth, async (req, res) => {
  const { moduleId, overall, teaching, content, assessmentFairness, hoursPerWeek, yearTaken, recommend, headline, body } = req.body;

  if (!mongoose.isValidObjectId(moduleId)) {
    return res.status(400).json({ error: "Invalid module id" });
  }

  const moduleExists = await Module.exists({ _id: moduleId });
  if (!moduleExists) {
    return res.status(404).json({ error: "Module not found" });
  }

  try {
    // userId comes from the login token, not the form, so nobody can post as someone else
    const review = await Review.create({
      moduleId,
      userId: req.user.id,
      overall,
      teaching,
      content,
      assessmentFairness,
      hoursPerWeek,
      yearTaken,
      recommend,
      headline,
      body,
    });
    res.status(201).json({ message: "Review saved", id: review._id });
  } catch (err) {
    // the Review model only allows one review per student per module
    if (err.code === 11000) {
      return res.status(409).json({ error: "You have already reviewed this module" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Please fill in every field. The review needs at least 50 characters." });
    }
    throw err;
  }
});

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
    ratings: enough ? getRatingCounts(reviews) : [],
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
    console.error("Summary failed:", err.message);
    res.status(502).json({ error: "Could not make a summary right now" });
  }
});

export default router;