import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Test routes
  app.get("/api/tests/:topicSlug/questions", async (req, res) => {
    const tests = await storage.getTestsByTopic(req.params.topicSlug);
    if (!tests.length) {
      return res.json([]);
    }
    const questions = await storage.getQuestions(tests[0].id);
    res.json(questions);
  });

  app.get("/api/tests/:topicSlug/scores", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const tests = await storage.getTestsByTopic(req.params.topicSlug);
    if (!tests.length) {
      return res.json(null);
    }
    const scores = await storage.getTestScores(tests[0].id);
    const userScores = scores.filter(score => score.userId === req.user!.id);
    const latestScore = userScores.length ? userScores[0].score : null;
    res.json(latestScore);
  });

  app.post("/api/tests/:topicSlug/scores", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const tests = await storage.getTestsByTopic(req.params.topicSlug);
    if (!tests.length) {
      return res.status(404).send("Test not found");
    }
    const score = await storage.createUserScore({
      userId: req.user.id,
      testId: tests[0].id,
      score: req.body.score,
    });
    res.json(score);
  });

  // Add profile routes
  app.get("/api/profile", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const profile = await storage.getProfile(req.user.id);
    res.json(profile);
  });

  app.patch("/api/profile", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const profile = await storage.updateProfile(req.user.id, req.body);
    res.json(profile);
  });

  app.get("/api/user/scores", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const scores = await storage.getUserScores(req.user.id);
    res.json(scores);
  });

  // Discussion routes
  app.get("/api/discussions", async (req, res) => {
    const discussions = await storage.getDiscussions();
    res.json(discussions);
  });

  app.get("/api/discussions/:id", async (req, res) => {
    const discussion = await storage.getDiscussionById(parseInt(req.params.id));
    if (!discussion) {
      return res.status(404).send("Discussion not found");
    }
    res.json(discussion);
  });

  app.post("/api/discussions", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const discussion = await storage.createDiscussion({
      ...req.body,
      userId: req.user.id,
    });
    res.json(discussion);
  });

  app.post("/api/discussions/:id/comments", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const comment = await storage.createComment({
      discussionId: parseInt(req.params.id),
      userId: req.user.id,
      content: req.body.content,
    });
    res.json(comment);
  });

  app.post("/api/chat", async (req, res) => {
    if (!req.body.message) {
      return res.status(400).send("Message is required");
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: req.body.message }],
        temperature: 0.7,
      });

      res.json({ message: response.choices[0].message.content });
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).send("Failed to get AI response");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}