import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "drizzle-kit";

// 🔹 Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Check if we're in development mode
const isDev = process.env.NODE_ENV === "development";

// 🔹 Load .env.local only in development
if (isDev) {
  dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
  console.log("🛠️ Running in Development Mode - Using .env.local");
} else {
  console.log(
    "🚀 Running in Production Mode - Using system environment variables"
  );
}

console.log(process.env.DATABASE_URL ? "✅ Loaded DATABASE_URL" : "❌ MISSING");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL + "?sslmode=require", // Force SSL
  },
});
