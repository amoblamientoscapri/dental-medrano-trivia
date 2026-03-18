"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";
import { RegistrationForm, type RegistrationData } from "./RegistrationForm";
import { GameScreen } from "./game/GameScreen";
import { Logo } from "./Logo";

interface FeriaClientProps {
  questions: Question[];
  winMessage: string;
  campaignId?: string;
  prizeDeadline?: string;
}

type FeriaPhase = "register" | "playing";

export function FeriaClient({ questions, winMessage, campaignId, prizeDeadline }: FeriaClientProps) {
  const [phase, setPhase] = useState<FeriaPhase>("register");
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleRegistration(data: RegistrationData) {
    setLoading(true);
    try {
      const res = await fetch("/api/registros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, campaignId }),
      });
      if (res.ok) {
        const reg = await res.json();
        setRegistrationId(reg.id);
        setPlayerName(data.nombre);
        setPhase("playing");
      }
    } finally {
      setLoading(false);
    }
  }

  if (phase === "register") {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4 py-3">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex justify-center mb-3">
            <Logo size="xs" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
            <div className="text-center mb-4">
              <span className="inline-block bg-orange-brand/10 text-orange-brand text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Registrate para jugar
              </span>
            </div>

            <RegistrationForm onSubmit={handleRegistration} loading={loading} />
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="h-dvh flex flex-col bg-gradient-to-b from-orange-50 via-white to-orange-50 px-6 py-2 overflow-hidden max-w-3xl mx-auto">
      <GameScreen
        questions={questions}
        winMessage={winMessage}
        registrationId={registrationId}
        playerName={playerName}
        prizeDeadline={prizeDeadline}
      />
    </main>
  );
}
