import { Redis } from "@upstash/redis";
import { PrismaClient } from "@prisma/client";
import { SEED_QUESTIONS } from "../lib/questions-data";

async function seed() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.error("Missing KV_REST_API_URL or KV_REST_API_TOKEN env vars");
    console.error("Run: npx vercel env pull .env.local");
    process.exit(1);
  }

  const redis = new Redis({ url, token });

  console.log(`Seeding ${SEED_QUESTIONS.length} questions...`);
  await redis.set("questions", SEED_QUESTIONS);

  const defaultConfig = {
    questionsPerRound: 3,
    winMessage:
      "Acercate al stand de Dental Medrano para reclamar tu premio!",
  };
  await redis.set("game-config", defaultConfig);

  console.log("Done! Questions and config seeded to Upstash Redis.");

  // Seed default branches
  const prisma = new PrismaClient();

  const existingBranches = await prisma.branch.count();
  if (existingBranches === 0) {
    console.log("Seeding default branches...");
    await prisma.branch.createMany({
      data: [
        { name: "Sucursal Centro", address: "Av. Medrano 123, CABA" },
        { name: "Sucursal Norte", address: "Av. Cabildo 456, CABA" },
        { name: "Sucursal Sur", address: "Av. Caseros 789, CABA" },
      ],
    });
    console.log("3 default branches created.");
  } else {
    console.log(`${existingBranches} branches already exist, skipping.`);
  }

  await prisma.$disconnect();
}

seed().catch(console.error);
