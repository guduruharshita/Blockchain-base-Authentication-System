import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT:             z.string().default("3001"),
  JWT_SECRET:       z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN:   z.string().default("24h"),
  DATABASE_PATH:    z.string().default("authchain.db"),
  ALLOWED_ORIGINS:  z.string().default("http://localhost:5173"),
  NODE_ENV:         z.enum(["development", "production", "test"]).default("development"),
  CONTRACT_ADDRESS: z.string().optional(),
  CHAIN_RPC_URL:    z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
export type Config = typeof config;
