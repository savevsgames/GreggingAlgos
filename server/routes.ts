import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

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

  const httpServer = createServer(app);
  return httpServer;
}