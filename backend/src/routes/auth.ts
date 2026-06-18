import { Router, Request, Response } from "express";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "../db/schema";
import { config } from "../config";
import { AppError } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

const nonceRequestSchema = z.object({
  address: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid Ethereum address"),
});

const verifySchema = z.object({
  address:   z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  signature: z.string().min(1),
  username:  z.string().min(1).max(32).optional(),
});

// POST /api/auth/nonce — issue a challenge nonce for EIP-191 signature
router.post("/nonce", (req: Request, res: Response) => {
  const { address } = nonceRequestSchema.parse(req.body);
  const nonce     = uuidv4();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min

  const db = getDb();
  db.prepare(`
    INSERT INTO nonces (address, nonce, expires_at)
    VALUES (?, ?, ?)
    ON CONFLICT(address) DO UPDATE SET nonce = excluded.nonce, expires_at = excluded.expires_at
  `).run(address.toLowerCase(), nonce, expiresAt);

  res.json({ nonce, message: buildLoginMessage(address, nonce) });
});

// POST /api/auth/verify — verify signature, issue JWT
router.post("/verify", (req: Request, res: Response) => {
  const { address, signature, username } = verifySchema.parse(req.body);
  const lowerAddress = address.toLowerCase();

  const db = getDb();
  const row = db.prepare(
    "SELECT nonce, expires_at FROM nonces WHERE address = ?"
  ).get(lowerAddress) as { nonce: string; expires_at: string } | undefined;

  if (!row) throw new AppError(400, "No nonce found — request a new nonce first");
  if (new Date(row.expires_at) < new Date()) {
    db.prepare("DELETE FROM nonces WHERE address = ?").run(lowerAddress);
    throw new AppError(400, "Nonce expired — request a new nonce");
  }

  const message   = buildLoginMessage(address, row.nonce);
  const recovered = ethers.verifyMessage(message, signature).toLowerCase();

  if (recovered !== lowerAddress) throw new AppError(401, "Signature verification failed");

  // Invalidate nonce (one-time use)
  db.prepare("DELETE FROM nonces WHERE address = ?").run(lowerAddress);

  // Write audit log
  db.prepare(`
    INSERT INTO audit_log (address, action, ip, user_agent)
    VALUES (?, 'login', ?, ?)
  `).run(lowerAddress, req.ip ?? null, req.headers["user-agent"] ?? null);

  const token = jwt.sign(
    { address: lowerAddress, username: username ?? lowerAddress } satisfies { address: string; username: string },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
  );

  res.json({ token, address: lowerAddress });
});

// GET /api/auth/me — return current user info (requires valid JWT)
router.get("/me", requireAuth, (req: Request, res: Response) => {
  res.json(req.user);
});

// POST /api/auth/audit — log an on-chain action (called after tx confirmation)
router.post("/audit", requireAuth, (req: Request, res: Response) => {
  const schema = z.object({ action: z.enum(["register", "deactivate", "ban", "unban"]), metadata: z.record(z.unknown()).optional() });
  const { action, metadata } = schema.parse(req.body);

  const db = getDb();
  db.prepare(`
    INSERT INTO audit_log (address, action, ip, user_agent, metadata)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    req.user!.address,
    action,
    req.ip ?? null,
    req.headers["user-agent"] ?? null,
    metadata ? JSON.stringify(metadata) : null,
  );

  res.status(201).json({ ok: true });
});

function buildLoginMessage(address: string, nonce: string): string {
  return `Sign in to AuthChain\nAddress: ${address}\nNonce: ${nonce}`;
}

export default router;
