import { createHmac, timingSafeEqual } from "crypto";

function getSecret(): string {
  const secret = process.env.CAMPAIGN_SECRET;
  if (!secret) {
    throw new Error(
      "CAMPAIGN_SECRET no está definida. Agregala a .env.local para usar campañas."
    );
  }
  return secret;
}

export function signCampaignPayload(slug: string, vto: string): string {
  const hmac = createHmac("sha256", getSecret());
  hmac.update(`${slug}|${vto}`);
  return hmac.digest("hex");
}

export function verifyCampaignPayload(
  slug: string,
  vto: string,
  sig: string
): boolean {
  const expected = signCampaignPayload(slug, vto);
  if (expected.length !== sig.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}
