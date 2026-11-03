import "./loadEnvironment.mjs";
import mongoose from "mongoose";
import { connectDB } from "./db/connect.mjs";
import Module from "./models/Module.mjs";
import Review from "./models/Review.mjs";

// TEST DATA ONLY. Run seed.mjs first so the modules exist.
// Change this to seed a different module.
const MODULE_CODE = "COMP07180"; // Web Programming 2

// PLACEHOLDER: fake student ids until real users exist
const fakeUserId = n => new mongoose.Types.ObjectId(n.toString(16).padStart(24, "0"));

const reviews = [
  {
    overall: 4, teaching: 5, content: 4, assessmentFairness: 3, hoursPerWeek: 6,
    yearTaken: "2026/27", recommend: true,
    headline: "Good lecturer, heavy CA",
    body: "The lecturer explains Express really well and the labs help a lot, but the CA deadlines all landed in the same week.",
  },
  {
    overall: 3, teaching: 4, content: 3, assessmentFairness: 3, hoursPerWeek: 8,
    yearTaken: "2026/27", recommend: true,
    headline: "Useful but fast",
    body: "Angular was new to me and the pace was quick. More worked examples in class would make the second half easier.",
  },
  {
    overall: 5, teaching: 5, content: 5, assessmentFairness: 4, hoursPerWeek: 5,
    yearTaken: "2026/27", recommend: true,
    headline: "Best module this year",
    body: "Building a real full stack app felt really practical. The worksheets on GitHub were easy to follow and useful for my CV.",
  },
  {
    overall: 2, teaching: 3, content: 3, assessmentFairness: 2, hoursPerWeek: 10,
    yearTaken: "2026/27", recommend: false,
    headline: "Confusing project brief",
    body: "I was confused about what the overall project needed. The marking scheme came out late and the brief changed twice.",
  },
  {
    overall: 4, teaching: 4, content: 4, assessmentFairness: 4, hoursPerWeek: 7,
    yearTaken: "2026/27", recommend: true,
    headline: "Solid module",
    body: "Good mix of theory and labs. MongoDB setup took a while at the start but once it worked the rest went fine.",
  },
];

try {
  await connectDB();

  const targetModule = await Module.findOne({ code: MODULE_CODE });
  if (!targetModule) throw new Error(`Module ${MODULE_CODE} not found. Run seed.mjs first.`);

  // Create or update each test review (safe to run more than once)
  const ops = reviews.map((review, i) => {
    const userId = fakeUserId(i + 1);
    return {
      updateOne: {
        filter: { moduleId: targetModule._id, userId },
        update: { $set: { ...review, moduleId: targetModule._id, userId } },
        upsert: true,
      },
    };
  });

  const result = await Review.bulkWrite(ops);
  await Review.syncIndexes();

  console.log(`Module: ${targetModule.name}`);
  console.log(`Reviews: ${result.upsertedCount} created, ${result.modifiedCount} updated`);
} catch (err) {
  console.error("Seeding reviews failed:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}