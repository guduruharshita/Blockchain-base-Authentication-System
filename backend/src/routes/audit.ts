import { Router, Request, Response } from "express";
import { z } from "zod";
import { getDb, AuditEntry } from "../db/schema";
import { requireAuth } from "../middleware/auth";

const router = Router();

// GET /api/audit?address=0x...&limit=50&offset=0 — fetch audit log entries
router.get("/", requireAuth, (req: Request, res: Response) => {
  const schema = z.object({
    address: z.string().regex(/^0x[0-9a-fA-F]{40}$/).optional(),
    limit:   z.coerce.number().int().min(1).max(100).default(20),
    offset:  z.coerce.number().int().min(0).default(0),
  });
  const { address, limit, offset } = schema.parse(req.query);

  const db = getDb();
  let rows: AuditEntry[];

  if (address) {
    rows = db.prepare(`
      SELECT * FROM audit_log WHERE address = ?
      ORDER BY created_at DESC LIMIT ? OFFSET ?
    `).all(address.toLowerCase(), limit, offset) as AuditEntry[];
  } else {
    rows = db.prepare(`
      SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ? OFFSET ?
    `).all(limit, offset) as AuditEntry[];
  }

  res.json(rows);
});

export default router;
