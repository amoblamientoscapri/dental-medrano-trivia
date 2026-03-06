import { kv } from "@vercel/kv";
import type { Question, GameConfig } from "./types";

const QUESTIONS_KEY = "questions";
const CONFIG_KEY = "game-config";

const DEFAULT_CONFIG: GameConfig = {
  questionsPerRound: 3,
  winMessage:
    "Acercate al stand de Dental Medrano para reclamar tu premio!",
};

export async function getQuestions(): Promise<Question[]> {
  const questions = await kv.get<Question[]>(QUESTIONS_KEY);
  return questions || [];
}

export async function setQuestions(questions: Question[]): Promise<void> {
  await kv.set(QUESTIONS_KEY, questions);
}

export async function getConfig(): Promise<GameConfig> {
  const config = await kv.get<GameConfig>(CONFIG_KEY);
  return config || DEFAULT_CONFIG;
}

export async function setConfig(config: GameConfig): Promise<void> {
  await kv.set(CONFIG_KEY, config);
}

export async function getRandomQuestions(count: number): Promise<Question[]> {
  const all = await getQuestions();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
