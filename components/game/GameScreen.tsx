"use client";

import { useState, useCallback, useEffect } from "react";
import type { Question, GamePhase, Branch } from "@/lib/types";
import { Logo } from "../Logo";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { ResultScreen } from "./ResultScreen";
import { playCorrect, playWrong, playWin, playStart } from "@/lib/sounds";

interface GameScreenProps {
  questions: Question[];
  winMessage: string;
  registrationId?: string | null;
  playerName?: string;
  prizeDeadline?: string;
  replayUrl?: string;
}

interface PrizeData {
  code: string;
  branches: Branch[];
}

export function GameScreen({ questions, winMessage, registrationId, playerName, prizeDeadline, replayUrl }: GameScreenProps) {
  const [phase, setPhase] = useState<GamePhase>(registrationId ? "playing" : "idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswerText, setCorrectAnswerText] = useState<string>("");
  const [animKey, setAnimKey] = useState(0);
  const [prizeData, setPrizeData] = useState<PrizeData | null>(null);

  useEffect(() => {
    if (phase === "playing") playStart();
  }, [phase]);

  const reportResult = useCallback(
    async (result: "won" | "lost") => {
      if (!registrationId) return;
      try {
        const res = await fetch(`/api/registros/${registrationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameResult: result }),
        });
        if (res.ok && result === "won") {
          const data = await res.json();
          if (data.prize) {
            setPrizeData({
              code: data.prize.code,
              branches: data.branches || [],
            });
          }
        }
      } catch {
        // ignore
      }
    },
    [registrationId]
  );

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (showFeedback) return;

      const question = questions[currentIndex];
      const isCorrect = optionIndex === question.correctIndex;

      setSelectedOption(optionIndex);
      setShowFeedback(true);

      if (isCorrect) {
        playCorrect();
        setTimeout(async () => {
          if (currentIndex + 1 >= questions.length) {
            playWin();
            if (registrationId) {
              await reportResult("won");
            }
            setPhase("won");
            if (!registrationId) {
              reportResult("won");
            }
          } else {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
            setAnimKey((k) => k + 1);
          }
        }, 1200);
      } else {
        playWrong();
        setCorrectAnswerText(question.options[question.correctIndex]);
        setTimeout(() => {
          setPhase("lost");
          reportResult("lost");
        }, 2200);
      }
    },
    [currentIndex, questions, showFeedback, reportResult, registrationId]
  );

  const handlePlayAgain = useCallback(() => {
    window.location.href = replayUrl || (registrationId ? "/feria" : "/jugar");
  }, [registrationId, replayUrl]);

  if (phase === "idle") {
    return (
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="text-center max-w-lg mx-auto animate-bounce-in">
          <div className="mb-4 animate-float">
            <Logo size="sm" className="mx-auto drop-shadow-lg" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-brand mb-1">
            ¡TRIVIA
            <span className="text-orange-brand"> DENTAL!</span>
          </h1>
          <p className="text-gray-400 mb-6 text-base">
            Respondé {questions.length} preguntas y ganá un premio
          </p>

          <button
            onClick={() => setPhase("playing")}
            className="bg-orange-brand hover:bg-orange-dark text-white font-extrabold text-xl px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-[0.97]"
          >
            ¡JUGAR!
          </button>

          <button
            onClick={() => { window.location.href = "/"; }}
            className="block mx-auto mt-4 text-sm text-gray-400 hover:text-orange-brand transition-colors cursor-pointer"
          >
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  if (phase === "won" || phase === "lost") {
    return (
      <div className="flex-1 flex items-center justify-center min-h-0">
        <ResultScreen
          won={phase === "won"}
          winMessage={winMessage}
          correctAnswer={phase === "lost" ? correctAnswerText : undefined}
          onPlayAgain={handlePlayAgain}
          playerName={playerName}
          prizeCode={prizeData?.code}
          branches={prizeData?.branches}
          prizeDeadline={prizeDeadline}
        />
      </div>
    );
  }

  return (
    <>
      {/* Compact header: logo + progress + badge in ONE row */}
      <div className="flex items-center justify-between shrink-0 px-1 mb-2">
        <Logo size="xs" className="h-9 w-auto" />
        <ProgressBar current={currentIndex} total={questions.length} />
        <span className="inline-block bg-orange-brand/10 text-orange-brand text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
          Pregunta {currentIndex + 1} de {questions.length}
        </span>
      </div>

      {/* Game card fills remaining height */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div
          key={animKey}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-full animate-slide-up"
        >
          <QuestionCard
            question={questions[currentIndex]}
            onAnswer={handleAnswer}
            selectedOption={selectedOption}
            showFeedback={showFeedback}
          />
        </div>
      </div>
    </>
  );
}
