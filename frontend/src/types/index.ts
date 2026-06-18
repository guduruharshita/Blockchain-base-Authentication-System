export interface UserProfile {
  username: string;
  active: boolean;
  banned: boolean;
  registeredAt: bigint;
  lastLoginAt: bigint;
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

export type AuthStep = "disconnected" | "connecting" | "connected" | "registered";
