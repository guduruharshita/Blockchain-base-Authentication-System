import Database from "better-sqlite3";
import { config } from "../config";

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(config.DATABASE_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    migrate(_db);
  }
  return _db;
}

function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      address     TEXT    NOT NULL,
      action      TEXT    NOT NULL CHECK(action IN ('register','login','deactivate','ban','unban')),
      ip          TEXT,
      user_agent  TEXT,
      metadata    TEXT,
      created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE INDEX IF NOT EXISTS idx_audit_address ON audit_log(address);
    CREATE INDEX IF NOT EXISTS idx_audit_action  ON audit_log(action);
    CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);

    CREATE TABLE IF NOT EXISTS nonces (
      address    TEXT    PRIMARY KEY,
      nonce      TEXT    NOT NULL,
      expires_at TEXT    NOT NULL
    );
  `);
}

export interface AuditEntry {
  id: number;
  address: string;
  action: string;
  ip: string | null;
  user_agent: string | null;
  metadata: string | null;
  created_at: string;
}
