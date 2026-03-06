import { createClient } from "@vercel/kv";
import { SEED_QUESTIONS } from "../lib/questions-data";

async function seed() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.error("Missing KV_REST_API_URL or KV_REST_API_TOKEN env vars");
    console.error("Run: npx vercel env pull .env.local");
    process.exit(1);
  }

  const kv = createClient({ url, token });

  console.log(`Seeding ${SEED_QUESTIONS.length} questions...`);
  await kv.set("questions", SEED_QUESTIONS);

  const defaultConfig = {
    questionsPerRound: 3,
    winMessage:
      "Acercate al stand de Dental Medrano para reclamar tu premio!",
  };
  await kv.set("game-config", defaultConfig);

  console.log("Done! Questions and config seeded to Vercel KV.");
}

seed().catch(console.error);
