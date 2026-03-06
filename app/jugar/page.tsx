import { getRandomQuestions, getConfig } from "@/lib/kv";
import { GameScreen } from "@/components/game/GameScreen";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function JugarPage() {
  const config = await getConfig();
  const questions = await getRandomQuestions(config.questionsPerRound);

  if (questions.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4">
        <Logo size="md" className="mb-6" />
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            No hay preguntas cargadas todavia.
          </p>
          <Link
            href="/"
            className="text-orange-brand font-semibold underline underline-offset-2 cursor-pointer"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4 py-6">
      <div className="w-full max-w-lg mx-auto">
        <div className="flex justify-center mb-6">
          <Logo size="sm" />
        </div>
        <GameScreen questions={questions} winMessage={config.winMessage} />
      </div>
    </main>
  );
}
