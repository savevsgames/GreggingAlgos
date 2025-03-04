import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import {
  users,
  profiles,
  tests,
  questions,
  discussions,
  comments,
} from "../shared/schema.js";
import dotenv from "dotenv";

// Ensure NODE_ENV is set to "development" if not explicitly defined
const ENV = process.env.NODE_ENV || "development";

// Load the correct environment file
if (ENV === "development") {
  dotenv.config({ path: "./.env.local" }); // Explicitly load .env.local
} else {
  dotenv.config(); // Default to .env for production
}

// Debugging: Print DATABASE_URL to check if it's loaded
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Check your .env file.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seedDatabase() {
  // Insert users
  const user1 = await db
    .insert(users)
    .values({
      username: "john_doe",
      password: "password123",
      email: "john@example.com",
    })
    .returning();

  const user2 = await db
    .insert(users)
    .values({
      username: "jane_doe",
      password: "password123",
      email: "jane@example.com",
    })
    .returning();

  // Insert profiles
  await db.insert(profiles).values({
    userId: user1[0].id,
    displayName: "John Doe",
    bio: "Software Developer",
  });

  await db.insert(profiles).values({
    userId: user2[0].id,
    displayName: "Jane Doe",
    bio: "Data Scientist",
  });

  // Insert tests
  const test1 = await db
    .insert(tests)
    .values({
      topicSlug: "javascript",
      title: "JavaScript Basics",
      difficulty: "easy",
    })
    .returning();

  // Insert questions
  await db.insert(questions).values({
    testId: test1[0].id,
    questionText: "What is a closure?",
    correctAnswer:
      "A closure is a function that retains access to its lexical scope.",
    orderIndex: 1,
  });

  // Insert discussions
  const discussion1 = await db
    .insert(discussions)
    .values({
      userId: user1[0].id,
      title: "JavaScript Closures",
      content: "Can someone explain closures in JavaScript?",
    })
    .returning();

  // Insert comments
  await db.insert(comments).values({
    discussionId: discussion1[0].id,
    userId: user2[0].id,
    content:
      "A closure is a function that retains access to its lexical scope.",
  });

  console.log("Database seeded successfully");
}

seedDatabase()
  .catch((err) => {
    console.error("Error seeding database:", err);
  })
  .finally(() => {
    pool.end();
  });
