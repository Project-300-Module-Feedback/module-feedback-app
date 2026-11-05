import "./loadEnvironment.mjs";     
import express from "express";
import cors from "cors";
import "express-async-errors";
import { connectDB } from "./db/connect.mjs";
import feedback from "./routes/feedback.mjs";
import courses from "./routes/courses.mjs";

const PORT = process.env.PORT || 5040;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/feedback", feedback);
app.use("/courses", courses);

app.use((err, _req, res, _next) => {
  console.error(err);                  
  res.status(500).send("Uh oh! An unexpected error occurred.");
});

try {
  await connectDB();
  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
} catch (err) {
  console.error("Could not connect to MongoDB:", err.message);
  process.exit(1);
}