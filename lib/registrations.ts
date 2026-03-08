import { Redis } from "@upstash/redis";
import type { Registration } from "./types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const REGISTRATIONS_KEY = "registrations";

export async function saveRegistration(
  reg: Omit<Registration, "id" | "timestamp">
): Promise<Registration> {
  const full: Registration = {
    ...reg,
    id: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };
  await redis.lpush(REGISTRATIONS_KEY, JSON.stringify(full));
  return full;
}

export async function updateRegistrationResult(
  id: string,
  gameResult: "won" | "lost"
): Promise<boolean> {
  const all = await getAllRegistrations();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return false;

  all[idx].gameResult = gameResult;

  // Rewrite the list
  await redis.del(REGISTRATIONS_KEY);
  if (all.length > 0) {
    const items = all.map((r) => JSON.stringify(r));
    await redis.rpush(REGISTRATIONS_KEY, ...items);
  }
  return true;
}

export async function getAllRegistrations(): Promise<Registration[]> {
  const raw = await redis.lrange<string>(REGISTRATIONS_KEY, 0, -1);
  return raw.map((item) =>
    typeof item === "string" ? JSON.parse(item) : (item as unknown as Registration)
  );
}

export async function clearRegistrations(): Promise<void> {
  await redis.del(REGISTRATIONS_KEY);
}
