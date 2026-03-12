import { Router, Request, Response } from "express";
import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import LessonContent from "../models/LessonContent.js";
import { evaluateSubmission } from "../services/evaluator.js";

const router = Router();

// GET /api/submissions
router.get("/", async (_req: Request, res: Response) => {
  try {
    const submissions = await Submission.find()
      .populate("studentId")
      .populate("problemId")
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// GET /api/submissions/student/:studentId
router.get("/student/:studentId", async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find({ studentId: req.params.studentId })
      .populate("problemId")
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// GET /api/submissions/problem/:problemId
router.get("/problem/:problemId", async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find({ problemId: req.params.problemId })
      .populate("studentId")
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// POST /api/submissions - Submit code and trigger evaluation
router.post("/", async (req: Request, res: Response) => {
  try {
    const { studentId, problemId, lessonId, htmlCode, cssCode, jsCode, timeSpent } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }
    if (!htmlCode && !cssCode && !jsCode) {
      return res.status(400).json({ error: "At least one code file is required" });
    }

    // Get reference code from problem or lesson content
    let referenceCode: { html: string; css: string; js: string } | null = null;
    let expectedOutput = "";
    let referenceImageUrl = "";

    if (problemId) {
      const problem = await Problem.findById(problemId);
      if (problem) {
        expectedOutput = problem.expectedOutput;
        if (problem.referenceHtml || problem.referenceCss || problem.referenceJs) {
          referenceCode = {
            html: problem.referenceHtml,
            css: problem.referenceCss,
            js: problem.referenceJs,
          };
        }
        if (problem.referenceImageUrl) {
          referenceImageUrl = problem.referenceImageUrl;
        }
      }
    }

    if (lessonId) {
      const lesson = await LessonContent.findOne({ lessonId });
      if (lesson) {
        if (lesson.referenceHtml || lesson.referenceCss || lesson.referenceJs) {
          referenceCode = {
            html: lesson.referenceHtml,
            css: lesson.referenceCss,
            js: lesson.referenceJs,
          };
        }
        if (!expectedOutput && lesson.task) {
          expectedOutput = lesson.task;
        }
        if (!referenceImageUrl && lesson.referenceImageUrl) {
          referenceImageUrl = lesson.referenceImageUrl;
        }
      }
    }

    // Run Puppeteer evaluation
    const studentCode = { html: htmlCode || "", css: cssCode || "", js: jsCode || "" };
    const evaluation = await evaluateSubmission(studentCode, referenceCode, expectedOutput, referenceImageUrl || undefined);

    // Save submission with evaluation results
    const submission = new Submission({
      studentId,
      problemId: problemId || undefined,
      lessonId: lessonId || "",
      htmlCode,
      cssCode,
      jsCode,
      score: evaluation.score,
      isCorrect: evaluation.isCorrect,
      testResults: evaluation.testResults,
      feedback: evaluation.feedback,
      submittedAt: new Date(),
      timeSpent: timeSpent || 0,
    });

    await submission.save();

    res.status(201).json({
      submission,
      evaluation: {
        score: evaluation.score,
        isCorrect: evaluation.isCorrect,
        testResults: evaluation.testResults,
        feedback: evaluation.feedback,
        visualMatchPercent: evaluation.visualMatchPercent,
        studentScreenshot: evaluation.studentScreenshot,
        referenceScreenshot: evaluation.referenceScreenshot,
      },
    });
  } catch (err) {
    console.error("Submission evaluation error:", err);
    res.status(500).json({ error: "Failed to evaluate submission" });
  }
});

export default router;
