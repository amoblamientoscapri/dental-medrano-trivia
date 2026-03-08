import { getRandomQuestions, getConfig } from "@/lib/kv";
import { FeriaClient } from "@/components/FeriaClient";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FeriaPage() {
  const config = await getConfig();
  const questions = await getRandomQuestions(config.questionsPerRound);

  if (questions.length === 0) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4 sm:px-6">
        <Logo size="sm" className="mb-6" />
        <div className="text-center">
          <p className="text-gray-500 mb-4 text-lg sm:text-xl">
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

  return <FeriaClient questions={questions} winMessage={config.winMessage} />;
}
