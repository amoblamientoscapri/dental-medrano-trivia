"use client";

import type { Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  onAnswer: (optionIndex: number) => void;
  selectedOption: number | null;
  showFeedback: boolean;
}

export function QuestionCard({
  question,
  onAnswer,
  selectedOption,
  showFeedback,
}: QuestionCardProps) {
  const letters = ["A", "B", "C"];
  const isCorrectAnswer = showFeedback && selectedOption === question.correctIndex;

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-gray-brand mb-3 text-center leading-snug">
        {question.text}
      </h2>

      {/* Feedback banner */}
      {showFeedback && (
        <div
          className={`text-center mb-2 py-1.5 px-4 rounded-xl text-sm font-bold animate-bounce-in ${
            isCorrectAnswer
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isCorrectAnswer ? "¡¡Correcto!!" : "¡Incorrecto!"}
        </div>
      )}

      <div className="space-y-2">
        {question.options.map((option, i) => {
          let btnClass =
            "option-btn w-full text-left py-2.5 px-3 rounded-xl border-2 font-medium transition-all duration-200 ";

          let extraAnim = "";

          if (showFeedback && selectedOption !== null) {
            if (i === question.correctIndex) {
              btnClass += "border-green-500 bg-green-50 text-green-800 ";
              if (i === selectedOption) {
                extraAnim = "animate-pulse-green";
              }
            } else if (i === selectedOption && i !== question.correctIndex) {
              btnClass += "border-red-500 bg-red-50 text-red-800 ";
              extraAnim = "animate-shake";
            } else {
              btnClass += "border-gray-200 bg-gray-50 text-gray-400 ";
            }
          } else {
            btnClass +=
              "border-gray-200 bg-white text-gray-700 hover:border-orange-brand hover:bg-orange-50 cursor-pointer ";
          }

          const staggerClass = `stagger-${i + 1}`;

          return (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              disabled={showFeedback}
              className={`${btnClass} ${extraAnim} animate-slide-up ${staggerClass}`}
              style={{ opacity: 0 }}
            >
              <span className="inline-flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-200 ${
                    showFeedback && i === question.correctIndex
                      ? "bg-green-500 text-white"
                      : showFeedback &&
                          i === selectedOption &&
                          i !== question.correctIndex
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {showFeedback && i === question.correctIndex ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : showFeedback &&
                    i === selectedOption &&
                    i !== question.correctIndex ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    letters[i]
                  )}
                </span>
                <span className="text-sm">{option}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
