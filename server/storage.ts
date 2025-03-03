import { 
  users, type User, type InsertUser,
  profiles, type Profile, type InsertProfile,
  tests, type Test, type InsertTest,
  questions, type Question, type InsertQuestion,
  userScores, type UserScore, type InsertUserScore
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profile operations
  getProfile(userId: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: number, profile: Partial<InsertProfile>): Promise<Profile>;

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

  // Session store for authentication
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

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
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Profile operations
  async getProfile(userId: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }

  async updateProfile(userId: number, profile: Partial<InsertProfile>): Promise<Profile> {
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
    const [newQuestion] = await db.insert(questions).values(question).returning();
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
}

export const storage = new DatabaseStorage();