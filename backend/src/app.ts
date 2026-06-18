import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import authRoutes  from "./routes/auth";
import auditRoutes from "./routes/audit";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: config.ALLOWED_ORIGINS.split(",").map((o) => o.trim()), credentials: true }));
  app.use(express.json({ limit: "16kb" }));

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 60,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many requests — try again shortly" },
    }),
  );

  app.get("/health", (_req, res) => res.json({ status: "ok", version: "2.0.0" }));
  app.use("/api/auth",  authRoutes);
  app.use("/api/audit", auditRoutes);

  app.use(errorHandler);

  return app;
}
