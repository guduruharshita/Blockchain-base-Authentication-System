const BASE = "/api";

async function request<T>(path: string, options?: RequestInit, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? res.statusText);
  return data as T;
}

export const api = {
  getNonce: (address: string) =>
    request<{ nonce: string; message: string }>("/auth/nonce", {
      method: "POST",
      body: JSON.stringify({ address }),
    }),

  verify: (address: string, signature: string, username?: string) =>
    request<{ token: string; address: string }>("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ address, signature, username }),
    }),

  me: (token: string) =>
    request<{ address: string; username: string }>("/auth/me", undefined, token),

  logAction: (action: string, token: string, metadata?: Record<string, unknown>) =>
    request<{ ok: boolean }>("/auth/audit", {
      method: "POST",
      body: JSON.stringify({ action, metadata }),
    }, token),

  getAudit: (token: string, address?: string) => {
    const qs = address ? `?address=${address}` : "";
    return request<{ id: number; address: string; action: string; created_at: string }[]>(
      `/audit${qs}`, undefined, token
    );
  },
};
