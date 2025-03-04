import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Local database setup
import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";

// Serverless database setup
// import { Pool, neonConfig } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-serverless";
// import ws from "ws";

import * as schema from "@shared/schema";

// Serverless setup
// neonConfig.webSocketConstructor = ws;

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

// 🔹 Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set!");
}
// Serverless only:
// export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// export const db = drizzle({ client: pool, schema });


export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });


