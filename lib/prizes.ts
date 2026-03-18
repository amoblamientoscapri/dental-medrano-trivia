import { prisma } from "./db";

const SAFE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generatePrizeCode(): string {
  let code = "DM-";
  for (let i = 0; i < 6; i++) {
    code += SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)];
  }
  return code;
}

export async function createPrize(registrationId: string) {
  // Retry up to 5 times for code collisions
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generatePrizeCode();
    try {
      return await prisma.prize.create({
        data: { code, registrationId },
      });
    } catch {
      // Likely unique constraint violation, retry
      continue;
    }
  }
  throw new Error("Failed to generate unique prize code");
}

export async function getPrizeByCode(code: string) {
  return prisma.prize.findUnique({
    where: { code },
    include: {
      registration: { include: { campaign: true } },
      branch: true,
    },
  });
}

export async function redeemPrize(code: string, branchId: string) {
  // Use updateMany with status condition to avoid race conditions
  const result = await prisma.prize.updateMany({
    where: { code, status: "pending" },
    data: {
      status: "redeemed",
      redeemedAt: new Date(),
      branchId,
    },
  });
  return result.count > 0;
}
