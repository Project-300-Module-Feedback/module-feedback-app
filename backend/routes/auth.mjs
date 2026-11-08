import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

import User from "../models/User.mjs";
import VerificationCode from "../models/VerificationCode.mjs";
import { sendCode } from "../utils/sendCode.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = express.Router();

const BCRYPT_ROUNDS = 10;
const CODE_EXPIRY_MINUTES = 15;
const MAX_CODE_ATTEMPTS = 5;
const MIN_PASSWORD_LENGTH = 8;
const TOKEN_LIFETIME = "1d";

// Rate limiter for verification code requests
const makeLimiter = () =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === "test",
    message: { error: "Too many attempts, try again in 15 minutes" },
  });


  // Helper functions
  const normaliseEmail = (email) => String(email || "").trim().toLowerCase();
const isAtuEmail = (email) => /^[^\s@]+@atu\.ie$/.test(email);

async function issueCode(email) {
  await VerificationCode.deleteMany({ email });

  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

  await VerificationCode.create({
    email,
    codeHash: await bcrypt.hash(code, BCRYPT_ROUNDS),
    expiresAt: new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000),
  });

  await sendCode(email, code);
}
// Registration endpoint
router.post("/register", makeLimiter(), async (req, res) => {
  const email = normaliseEmail(req.body.email);
  const { password } = req.body;

  if (!isAtuEmail(email)) {
    return res.status(400).json({ error: "Please use your @atu.ie email" });
  }
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const existing = await User.findOne({ email });

  if (existing?.verified) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  if (existing) {
    existing.passwordHash = passwordHash;
    await existing.save();
  } else {
    await User.create({ email, passwordHash, role: "student", verified: false });
  }

  await issueCode(email);
  res.status(201).json({ message: "Account created. Check your email for a 6-digit code." });
});


 // Verify endpoint
router.post("/verify", makeLimiter(), async (req, res) => {
  const email = normaliseEmail(req.body.email);
  const code = String(req.body.code || "").trim();

  const record = await VerificationCode.findOne({ email });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ error: "Code expired or not found. Request a new one." });
  }

  if (record.attempts >= MAX_CODE_ATTEMPTS) {
    await record.deleteOne();
    return res.status(429).json({ error: "Too many wrong codes. Request a new one." });
  }

  const correct = await bcrypt.compare(code, record.codeHash);
  if (!correct) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({
      error: "Incorrect code",
      attemptsLeft: MAX_CODE_ATTEMPTS - record.attempts,
    });
  }

  await User.updateOne({ email }, { verified: true });
  await VerificationCode.deleteMany({ email });
  res.json({ message: "Email verified. You can now log in." });
});

 // Resend 
router.post("/resend", makeLimiter(), async (req, res) => {
  const email = normaliseEmail(req.body.email);
  const user = await User.findOne({ email });

  if (user && !user.verified) {
    await issueCode(email);
  }
  res.json({ message: "If that account needs verifying, a new code has been sent." });
});


// Logging in endpoint
router.post("/login", makeLimiter(), async (req, res) => {
  const email = normaliseEmail(req.body.email);
  const { password } = req.body;

  const user = await User.findOne({ email }).select("+passwordHash");

  const ok = user && typeof password === "string" && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (!user.verified) {
    return res.status(403).json({ error: "Please verify your email first" });
  }

  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_LIFETIME }
  );

  res.json({
    token,
    user: { id: user._id, email: user.email, role: user.role },
  });
});
// Get current user info
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ id: user._id, email: user.email, role: user.role, verified: user.verified });
});

export default router;