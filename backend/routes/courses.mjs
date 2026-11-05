import express from "express";
import Course from "../models/Course.mjs";

const router = express.Router();

router.get("/", async (_req, res) => {
  const courses = await Course.find().sort({ code: 1 }).lean();
  res.status(200).json(courses);
});

export default router;