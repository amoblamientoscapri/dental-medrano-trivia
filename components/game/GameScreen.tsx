"use client";

import { useState, useCallback } from "react";
import type { Question, GamePhase } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { ResultScreen } from "./ResultScreen";

interface GameScreenProps {
  questions: Question[];
  winMessage: string;
}

export function GameScreen({ questions, winMessage }: GameScreenProps) {
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswerText, setCorrectAnswerText] = useState<string>("");

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (showFeedback) return;

      const question = questions[currentIndex];
      const isCorrect = optionIndex === question.correctIndex;

      setSelectedOption(optionIndex);
      setShowFeedback(true);

      if (isCorrect) {
        setTimeout(() => {
          if (currentIndex + 1 >= questions.length) {
            setPhase("won");
          } else {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
          }
        }, 1200);
      } else {
        setCorrectAnswerText(question.options[question.correctIndex]);
        setTimeout(() => {
          setPhase("lost");
        }, 2000);
      }
    },
    [currentIndex, questions, showFeedback]
  );

  const handlePlayAgain = useCallback(() => {
    window.location.href = "/";
  }, []);

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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="mb-4 text-center">
          <span className="text-sm text-gray-400 font-medium">
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
