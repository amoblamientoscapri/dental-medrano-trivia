"use client";

import { useState, useCallback, useEffect } from "react";
import type { Question, GamePhase } from "@/lib/types";
import { Logo } from "../Logo";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { ResultScreen } from "./ResultScreen";
import { playCorrect, playWrong, playWin, playStart } from "@/lib/sounds";

interface GameScreenProps {
  questions: Question[];
  winMessage: string;
  registrationId?: string | null;
}

export function GameScreen({ questions, winMessage, registrationId }: GameScreenProps) {
  const [phase, setPhase] = useState<GamePhase>(registrationId ? "playing" : "idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswerText, setCorrectAnswerText] = useState<string>("");
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (phase === "playing") playStart();
  }, [phase]);

  const reportResult = useCallback(
    (result: "won" | "lost") => {
      if (!registrationId) return;
      fetch(`/api/registros/${registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameResult: result }),
      }).catch(() => {});
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
        setTimeout(() => {
          if (currentIndex + 1 >= questions.length) {
            playWin();
            setPhase("won");
            reportResult("won");
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
    [currentIndex, questions, showFeedback, reportResult]
  );

  const handlePlayAgain = useCallback(() => {
    window.location.href = registrationId ? "/feria" : "/jugar";
  }, [registrationId]);

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
