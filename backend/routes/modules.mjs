import express from "express";
import Module from "../models/Module.mjs";

const router = express.Router();

// GET /modules - every module, for the dropdown
router.get("/", async (req, res) => {
  const modules = await Module.find({})
    .select("code name year semester")
    .sort({ year: 1, semester: 1, name: 1 })
    .lean();
  res.status(200).json(modules);
});

export default router;