import {
  users,
  type User,
  type InsertUser,
  profiles,
  type Profile,
  type InsertProfile,
  tests,
  type Test,
  type InsertTest,
  questions,
  type Question,
  type InsertQuestion,
  userScores,
  type UserScore,
  type InsertUserScore,
  discussions,
  type Discussion,
  type InsertDiscussion,
  comments,
  type Comment,
  type InsertComment,
} from "@shared/schema";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Load `.env.local` only in development
const isDev = process.env.NODE_ENV === "development";
if (isDev) {
  dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
  console.log("🛠️ Running in Development Mode - Using .env.local");
} else {
  console.log(
    "🚀 Running in Production Mode - Using system environment variables"
  );
}

// Ensure database URL is loaded
console.log(
  process.env.DATABASE_URL
    ? `✅ Using DATABASE_URL: ${process.env.DATABASE_URL}`
    : "❌ DATABASE_URL is MISSING"
);

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profile operations
  getProfile(userId: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(
    userId: number,
    profile: Partial<InsertProfile>
  ): Promise<Profile>;

  // Test operations
  getTest(id: number): Promise<Test | undefined>;
  getTestsByTopic(topicSlug: string): Promise<Test[]>;
  createTest(test: InsertTest): Promise<Test>;

  // Question operations
  getQuestions(testId: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // Score operations
  getUserScores(userId: number): Promise<UserScore[]>;
  getTestScores(testId: number): Promise<UserScore[]>;
  createUserScore(score: InsertUserScore): Promise<UserScore>;

  // Discussion operations
  getDiscussions(): Promise<Discussion[]>;
  getDiscussionById(id: number): Promise<Discussion | undefined>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Session store for authentication
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Profile operations
  async getProfile(userId: number): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }

  async updateProfile(
    userId: number,
    profile: Partial<InsertProfile>
  ): Promise<Profile> {
    const [updatedProfile] = await db
      .update(profiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  // Test operations
  async getTest(id: number): Promise<Test | undefined> {
    const [test] = await db.select().from(tests).where(eq(tests.id, id));
    return test;
  }

  async getTestsByTopic(topicSlug: string): Promise<Test[]> {
    return db.select().from(tests).where(eq(tests.topicSlug, topicSlug));
  }

  async createTest(test: InsertTest): Promise<Test> {
    const [newTest] = await db.insert(tests).values(test).returning();
    return newTest;
  }

  // Question operations
  async getQuestions(testId: number): Promise<Question[]> {
    return db
      .select()
      .from(questions)
      .where(eq(questions.testId, testId))
      .orderBy(questions.orderIndex);
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db
      .insert(questions)
      .values(question)
      .returning();
    return newQuestion;
  }

  // Score operations
  async getUserScores(userId: number): Promise<UserScore[]> {
    return db.select().from(userScores).where(eq(userScores.userId, userId));
  }

  async getTestScores(testId: number): Promise<UserScore[]> {
    return db.select().from(userScores).where(eq(userScores.testId, testId));
  }

  async createUserScore(score: InsertUserScore): Promise<UserScore> {
    const [newScore] = await db.insert(userScores).values(score).returning();
    return newScore;
  }

  // Discussion operations
  async getDiscussions(): Promise<Discussion[]> {
    return db.select().from(discussions).orderBy(discussions.createdAt);
  }

  async getDiscussionById(
    id: number
  ): Promise<(Discussion & { comments: Comment[] }) | undefined> {
    const [discussion] = await db
      .select()
      .from(discussions)
      .where(eq(discussions.id, id));

    if (discussion) {
      const discussionComments = await db
        .select()
        .from(comments)
        .where(eq(comments.discussionId, id))
        .orderBy(comments.createdAt);

      return {
        ...discussion,
        comments: discussionComments,
      };
    }

    return discussion;
  }

  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const [newDiscussion] = await db
      .insert(discussions)
      .values(discussion)
      .returning();
    return newDiscussion;
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }
}

export const storage = new DatabaseStorage();
