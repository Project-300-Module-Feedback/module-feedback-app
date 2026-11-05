import express from "express";
import mongoose from "mongoose";
import Module from "../models/Module.mjs";
import Review from "../models/Review.mjs";

const router = express.Router();

async function getReviewStats(moduleIds) {
  const match = moduleIds ? { $match: { moduleId: { $in: moduleIds } } } : null;
  const pipeline = [
    ...(match ? [match] : []),
    {
      $group: {
        _id: "$moduleId",
        averageRating: { $avg: "$overall" },
        averageHoursPerWeek: { $avg: "$hoursPerWeek" },
        reviewCount: { $sum: 1 },
        recommendedCount: { $sum: { $cond: ["$recommend", 1, 0] } }
      }
    }
  ];
  const results = await Review.aggregate(pipeline);

  return new Map(results.map(result => [String(result._id), {
    averageRating: result.averageRating,
    averageHoursPerWeek: result.averageHoursPerWeek ?? null,
    reviewCount: result.reviewCount,
    recommendedPercentage: Math.round(result.recommendedCount / result.reviewCount * 100)
  }]));
}

function withStats(module, statsById) {
  return {
    ...module,
    ...(statsById.get(String(module._id)) ?? {
      averageRating: null,
      averageHoursPerWeek: null,
      reviewCount: 0,
      recommendedPercentage: null
    })
  };
}

router.get("/", async (_req, res) => {
  const modules = await Module.find()
    .populate("courseIds", "code name department campus")
    .sort({ name: 1 })
    .lean();
  const statsById = await getReviewStats(modules.map(module => module._id));
  res.status(200).json(modules.map(module => withStats(module, statsById)));
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid module id" });
  }

  const module = await Module.findById(req.params.id)
    .populate("courseIds", "code name department campus")
    .lean();
  if (!module) return res.status(404).json({ error: "Module not found" });

  const statsById = await getReviewStats([module._id]);
  const reviews = await Review.find({ moduleId: module._id })
    .select("overall hoursPerWeek recommend yearTaken headline body createdAt")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  const ratingDistribution = await Review.aggregate([
    { $match: { moduleId: module._id } },
    { $group: { _id: "$overall", count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);

  res.status(200).json({ module: withStats(module, statsById), reviews, ratingDistribution: ratingDistribution.map(item => ({
    rating: item._id,
    count: item.count
  })) });
});

export default router;