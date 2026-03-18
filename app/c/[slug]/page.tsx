import { validateCampaignUrl } from "@/lib/campaigns";
import { getRandomQuestions, getConfig } from "@/lib/kv";
import { FeriaClient } from "@/components/FeriaClient";
import { GameScreen } from "@/components/game/GameScreen";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CampaignPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ vto?: string; sig?: string }>;
}) {
  const { slug } = await params;
  const { vto, sig } = await searchParams;

  if (!vto || !sig) {
    return <ErrorScreen message="Enlace inválido" />;
  }

  const result = await validateCampaignUrl(slug, vto, sig);

  if (!result.valid) {
    return <ErrorScreen message={result.error} />;
  }

  const { campaign } = result;
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

  const prizeDeadline = campaign.expiresAt.split("T")[0];

  if (campaign.flowType === "jugar") {
    return (
      <main className="h-dvh flex flex-col bg-gradient-to-b from-orange-50 via-white to-orange-50 px-6 py-2 overflow-hidden max-w-3xl mx-auto">
        <GameScreen
          questions={questions}
          winMessage={config.winMessage}
          campaignId={campaign.id}
          prizeDeadline={prizeDeadline}
        />
      </main>
    );
  }

  return (
    <FeriaClient
      questions={questions}
      winMessage={config.winMessage}
      campaignId={campaign.id}
      prizeDeadline={prizeDeadline}
    />
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4">
      <Logo size="sm" className="mb-6" />
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{message}</h1>
        <p className="text-gray-500 mb-6">
          Contactá al organizador para obtener un nuevo enlace.
        </p>
        <Link
          href="/"
          className="text-orange-brand font-semibold underline underline-offset-2 cursor-pointer"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
