"use client";

import { useState, useCallback, useEffect } from "react";
import type { Question, GamePhase } from "@/lib/types";
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
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswerText, setCorrectAnswerText] = useState<string>("");
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    playStart();
  }, []);

  // Fire-and-forget: update registration with game result
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
    window.location.href = registrationId ? "/feria" : "/";
  }, [registrationId]);

  if (phase === "won" || phase === "lost") {
    return (
      <ResultScreen
        won={phase === "won"}
        winMessage={winMessage}
        correctAnswer={phase === "lost" ? correctAnswerText : undefined}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  return (
    <div>
      <ProgressBar current={currentIndex} total={questions.length} />

      <div
        key={animKey}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8 md:p-10 animate-slide-up"
      >
        <div className="mb-3 text-center">
          <span className="inline-block bg-orange-brand/10 text-orange-brand text-sm sm:text-base font-bold px-4 py-1.5 rounded-full animate-tick">
            Pregunta {currentIndex + 1} de {questions.length}
          </span>
        </div>

        <QuestionCard
          question={questions[currentIndex]}
          onAnswer={handleAnswer}
          selectedOption={selectedOption}
          showFeedback={showFeedback}
        />
      </div>
    </div>
  );
}
