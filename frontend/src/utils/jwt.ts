// frontend/src/utils/jwt.ts
export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = JSON.parse(
      typeof window !== "undefined"
        ? window.atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        : Buffer.from(payload, "base64").toString("utf8"),
    );
    return decoded as JwtPayload;
  } catch {
    return null;
  }
}
