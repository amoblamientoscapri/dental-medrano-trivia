import { getRandomQuestions, getConfig } from "@/lib/kv";
import { GameScreen } from "@/components/game/GameScreen";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function JugarPage() {
  const config = await getConfig();
  const questions = await getRandomQuestions(config.questionsPerRound);

  if (questions.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No hay preguntas cargadas todavia.</p>
          <Link href="/" className="text-orange-brand underline">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4 py-8">
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-orange-brand">
            Trivia Dental Medrano
          </h1>
        </div>
        <GameScreen questions={questions} winMessage={config.winMessage} />
      </div>
    </main>
  );
}
