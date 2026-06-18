import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AppError } from "./errorHandler";

export interface AuthPayload {
  address: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new AppError(401, "Missing authorization header");
  }

  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, config.JWT_SECRET) as AuthPayload;
    next();
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
}
