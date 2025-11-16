import { z } from "zod";

/**
 * Environment variables schema
 * Validates all required environment variables at build time
 */
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Stripe (optional for now, required in Phase 6)
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),

  // TikTok OAuth (optional for now, required in Phase 2)
  TIKTOK_CLIENT_KEY: z.string().min(1).optional(),
  TIKTOK_CLIENT_SECRET: z.string().min(1).optional(),
  TIKTOK_REDIRECT_URI: z.string().url().optional(),

  // Token Encryption
  TIKTOK_ENCRYPTION_KEY: z.string().min(32).optional(), // Must be at least 32 chars for AES-256
});

/**
 * Validates and exports environment variables
 * Throws an error if any required env vars are missing or invalid
 */
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:");
    console.error(error);
    throw new Error("Invalid environment variables");
  }
}

export const env = validateEnv();
