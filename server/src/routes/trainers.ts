import { Router, Request, Response } from "express";
import Trainer, { hashPassword } from "../models/Trainer.js";

const router = Router();

// POST /api/trainers/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const trainer = await Trainer.findOne({ email });
    if (!trainer) {
      return res.status(401).json({ success: false, message: "No account found with this email." });
    }

    const hash = hashPassword(password);
    if (hash !== trainer.passwordHash) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    res.json({
      success: true,
      message: "Logged in successfully.",
      trainer: { email: trainer.email, name: trainer.name },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// POST /api/trainers/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ success: false, message: "Email, name, and password are required" });
    }

    const existing = await Trainer.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    const passwordHash = hashPassword(password);
    await Trainer.create({ email, name, passwordHash });

    res.status(201).json({ success: true, message: "Account created." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

// GET /api/trainers - list all trainers (admin)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const trainers = await Trainer.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trainers" });
  }
});

export default router;
