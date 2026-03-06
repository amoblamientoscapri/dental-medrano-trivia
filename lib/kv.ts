import { Redis } from "@upstash/redis";
import type { Question, GameConfig } from "./types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const QUESTIONS_KEY = "questions";
const CONFIG_KEY = "game-config";

const DEFAULT_CONFIG: GameConfig = {
  questionsPerRound: 3,
  winMessage:
    "Acercate al stand de Dental Medrano para reclamar tu premio!",
};

export async function getQuestions(): Promise<Question[]> {
  const questions = await redis.get<Question[]>(QUESTIONS_KEY);
  return questions || [];
}

export async function setQuestions(questions: Question[]): Promise<void> {
  await redis.set(QUESTIONS_KEY, questions);
}

export async function getConfig(): Promise<GameConfig> {
  const config = await redis.get<GameConfig>(CONFIG_KEY);
  return config || DEFAULT_CONFIG;
}

export async function setConfig(config: GameConfig): Promise<void> {
  await redis.set(CONFIG_KEY, config);
}

export async function getRandomQuestions(count: number): Promise<Question[]> {
  const all = await getQuestions();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
