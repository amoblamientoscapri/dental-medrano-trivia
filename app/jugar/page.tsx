import { getRandomQuestions, getConfig } from "@/lib/kv";
import { verifyCampaignPayload } from "@/lib/campaign";
import { GameScreen } from "@/components/game/GameScreen";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export const dynamic = "force-dynamic";

function InvalidCodeScreen() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4">
      <Logo size="sm" className="mb-6" />
      <div className="text-center max-w-md mx-auto animate-bounce-in">
        <div className="w-28 h-28 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
          <svg
            className="w-14 h-14 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-brand mb-3">
          Este código no es válido
        </h2>
        <p className="text-gray-400 mb-6 text-lg">
          El enlace que usaste no funciona o fue modificado.
        </p>
        <Link
          href="/"
          className="inline-block bg-orange-brand hover:bg-orange-dark text-white font-bold px-8 py-3 rounded-xl text-lg transition-all duration-200"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

function ExpiredCodeScreen({ vto }: { vto: string }) {
  const formattedDate = new Date(vto + "T12:00:00").toLocaleDateString(
    "es-AR",
    { day: "2-digit", month: "2-digit", year: "numeric" }
  );

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4">
      <Logo size="sm" className="mb-6" />
      <div className="text-center max-w-md mx-auto animate-bounce-in">
        <div className="w-28 h-28 mx-auto mb-5 rounded-full bg-orange-50 flex items-center justify-center">
          <svg
            className="w-14 h-14 text-orange-brand"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-brand mb-3">
          Este código QR ya expiró
        </h2>
        <p className="text-gray-400 mb-6 text-lg">
          La fecha límite era el {formattedDate}
        </p>
        <Link
          href="/"
          className="inline-block bg-orange-brand hover:bg-orange-dark text-white font-bold px-8 py-3 rounded-xl text-lg transition-all duration-200"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

interface JugarPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JugarPage({ searchParams }: JugarPageProps) {
  const params = await searchParams;
  const campaign = typeof params.campaign === "string" ? params.campaign : undefined;
  const vto = typeof params.vto === "string" ? params.vto : undefined;
  const sig = typeof params.sig === "string" ? params.sig : undefined;

  const hasCampaignParams = campaign !== undefined || vto !== undefined || sig !== undefined;

  if (hasCampaignParams) {
    if (!campaign || !vto || !sig) {
      return <InvalidCodeScreen />;
    }

    if (!verifyCampaignPayload(campaign, vto, sig)) {
      return <InvalidCodeScreen />;
    }

    const now = new Date();
    const expiry = new Date(vto + "T23:59:59");
    if (expiry < now) {
      return <ExpiredCodeScreen vto={vto} />;
    }
  }

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

  const prizeDeadline = hasCampaignParams ? vto : undefined;
  const replayUrl = hasCampaignParams
    ? `/jugar?campaign=${encodeURIComponent(campaign!)}&vto=${vto}&sig=${sig}`
    : undefined;

  return (
    <main className="h-dvh flex flex-col bg-gradient-to-b from-orange-50 via-white to-orange-50 px-6 py-2 overflow-hidden max-w-3xl mx-auto">
      <GameScreen
        questions={questions}
        winMessage={config.winMessage}
        prizeDeadline={prizeDeadline}
        replayUrl={replayUrl}
      />
    </main>
  );
}
