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

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center leading-relaxed">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, i) => {
          let btnClass =
            "option-btn w-full text-left p-4 rounded-xl border-2 font-medium transition-all duration-200 ";

          if (showFeedback && selectedOption !== null) {
            if (i === question.correctIndex) {
              btnClass +=
                "border-green-500 bg-green-50 text-green-800";
            } else if (i === selectedOption && i !== question.correctIndex) {
              btnClass +=
                "border-red-500 bg-red-50 text-red-800";
            } else {
              btnClass += "border-gray-200 bg-gray-50 text-gray-400";
            }
          } else {
            btnClass +=
              "border-gray-200 bg-white text-gray-700 hover:border-orange-brand hover:bg-orange-50 cursor-pointer";
          }

          return (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              disabled={showFeedback}
              className={btnClass}
            >
              <span className="inline-flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
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
                <span>{option}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
