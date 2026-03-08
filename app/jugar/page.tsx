import { getRandomQuestions, getConfig } from "@/lib/kv";
import { GameScreen } from "@/components/game/GameScreen";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  manifest: "/manifest-jugar.json",
};

export default async function JugarPage() {
  const config = await getConfig();
  const questions = await getRandomQuestions(config.questionsPerRound);

  if (questions.length === 0) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4">
        <Logo size="sm" className="mb-6" />
        <div className="text-center">
          <p className="text-gray-500 mb-4 text-lg">
            No hay preguntas cargadas todavía.
          </p>
          <Link
            href="/"
            className="text-orange-brand font-semibold underline underline-offset-2 cursor-pointer text-lg"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="h-dvh flex flex-col bg-gradient-to-b from-orange-50 via-white to-orange-50 px-6 py-2 overflow-hidden max-w-3xl mx-auto">
      <GameScreen questions={questions} winMessage={config.winMessage} />
    </main>
  );
}
