import { prisma } from "./db";
import type { Campaign, OptionalField } from "./types";

// --- CRUD ---

export async function createCampaign(data: {
  name: string;
  slug: string;
  flowType: "jugar" | "feria";
  expiresAt: Date;
  optionalFields?: OptionalField[];
}): Promise<Campaign> {
  const created = await prisma.campaign.create({
    data: {
      name: data.name,
      slug: data.slug,
      flowType: data.flowType,
      expiresAt: data.expiresAt,
      optionalFields: JSON.stringify(data.optionalFields ?? []),
    },
  });
  return toCampaign(created);
}

export async function updateCampaign(
  id: string,
  data: Partial<{ name: string; slug: string; flowType: string; expiresAt: Date; active: boolean; optionalFields: OptionalField[] }>
): Promise<Campaign> {
  const prismaData: Record<string, unknown> = { ...data };
  if (data.optionalFields !== undefined) {
    prismaData.optionalFields = JSON.stringify(data.optionalFields);
  }
  const updated = await prisma.campaign.update({
    where: { id },
    data: prismaData,
  });
  return toCampaign(updated);
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  const row = await prisma.campaign.findUnique({ where: { slug } });
  return row ? toCampaign(row) : null;
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const row = await prisma.campaign.findUnique({ where: { id } });
  return row ? toCampaign(row) : null;
}

export async function getAllCampaigns(): Promise<(Campaign & { _count: { registrations: number } })[]> {
  const rows = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { registrations: true } } },
  });
  return rows.map((r) => ({
    ...toCampaign(r),
    _count: r._count,
  }));
}

export async function getActiveCampaigns(): Promise<Campaign[]> {
  const rows = await prisma.campaign.findMany({
    where: {
      active: true,
      expiresAt: { gte: new Date(new Date().toISOString().split("T")[0] + "T00:00:00Z") },
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toCampaign);
}

export async function deleteCampaign(id: string): Promise<Campaign> {
  const updated = await prisma.campaign.update({
    where: { id },
    data: { active: false },
  });
  return toCampaign(updated);
}

function toCampaign(row: { id: string; name: string; slug: string; flowType: string; expiresAt: Date; active: boolean; optionalFields: string; createdAt: Date }): Campaign {
  let optionalFields: OptionalField[] = [];
  try {
    optionalFields = JSON.parse(row.optionalFields);
  } catch { /* default empty */ }
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    flowType: row.flowType as "jugar" | "feria",
    expiresAt: row.expiresAt.toISOString(),
    active: row.active,
    optionalFields,
    createdAt: row.createdAt.toISOString(),
  };
}

// --- HMAC Signing (Web Crypto API) ---

function getSecret(): Uint8Array {
  const secret = process.env.CAMPAIGN_SECRET;
  if (!secret) throw new Error("CAMPAIGN_SECRET env var is not set");
  return new TextEncoder().encode(secret);
}

async function hmacSign(payload: string): Promise<string> {
  const secret = getSecret();
  const key = await crypto.subtle.importKey(
    "raw",
    secret.buffer as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const encoded = new TextEncoder().encode(payload);
  const sig = await crypto.subtle.sign("HMAC", key, encoded.buffer as ArrayBuffer);
  // URL-safe base64, trimmed to 16 chars (still 96 bits of security)
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
    .slice(0, 16);
}

async function hmacVerify(payload: string, signature: string): Promise<boolean> {
  const expected = await hmacSign(payload);
  return expected === signature;
}

export async function generateSignedUrl(campaign: Campaign): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const vto = campaign.expiresAt.split("T")[0]; // YYYY-MM-DD
  const payload = `${campaign.slug}:${vto}`;
  const sig = await hmacSign(payload);
  return `${baseUrl}/c/${campaign.slug}?vto=${vto}&sig=${sig}`;
}

export async function validateCampaignUrl(
  slug: string,
  vto: string,
  sig: string
): Promise<{ valid: true; campaign: Campaign } | { valid: false; error: string }> {
  // Verify signature
  const payload = `${slug}:${vto}`;
  const isValid = await hmacVerify(payload, sig);
  if (!isValid) {
    return { valid: false, error: "Firma inválida" };
  }

  // Check expiration
  const expirationDate = new Date(vto + "T23:59:59Z");
  if (isNaN(expirationDate.getTime()) || expirationDate < new Date()) {
    return { valid: false, error: "Este enlace ha expirado" };
  }

  // Check campaign exists and is active
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) {
    return { valid: false, error: "Campaña no encontrada" };
  }
  if (!campaign.active) {
    return { valid: false, error: "Esta campaña ya no está activa" };
  }

  return { valid: true, campaign };
}
