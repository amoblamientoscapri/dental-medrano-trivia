"use client";

import { Confetti } from "./Confetti";

interface ResultScreenProps {
  won: boolean;
  winMessage: string;
  correctAnswer?: string;
  onPlayAgain: () => void;
}

export function ResultScreen({
  won,
  winMessage,
  correctAnswer,
  onPlayAgain,
}: ResultScreenProps) {
  if (won) {
    return (
      <div className="text-center max-w-md mx-auto">
        <Confetti />

        {/* Trophy icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-orange-brand/10 flex items-center justify-center glow-orange">
          <svg
            className="w-12 h-12 text-orange-brand"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0019.875 10.875h-.375a.375.375 0 01-.375-.375V7.5a.375.375 0 01.375-.375h.375A3.375 3.375 0 0023.25 3.75V3a.75.75 0 00-.75-.75h-3.375a.375.375 0 01-.375-.375V1.5a.75.75 0 00-.75-.75h-12a.75.75 0 00-.75.75v.375a.375.375 0 01-.375.375H1.5a.75.75 0 00-.75.75v.75a3.375 3.375 0 003.375 3.375h.375a.375.375 0 01.375.375v3a.375.375 0 01-.375.375h-.375A3.375 3.375 0 001.125 13.5v1.125c0 .207.168.375.375.375H4.5a3.375 3.375 0 003.375 3.375h.375"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-brand mb-2">
          GANASTE!
        </h2>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
          <p className="text-green-800 font-semibold text-base">{winMessage}</p>
        </div>
        <button
          onClick={onPlayAgain}
          className="bg-orange-brand hover:bg-orange-dark text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98]"
        >
          Jugar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="text-center max-w-md mx-auto">
      {/* Close/X icon */}
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2 className="text-3xl font-extrabold text-gray-brand mb-2">
        Estuviste cerca!
      </h2>
      {correctAnswer && (
        <div className="mb-8">
          <p className="text-gray-400 mb-2 text-sm">
            La respuesta correcta era:
          </p>
          <p className="text-green-700 font-semibold bg-green-50 border border-green-200 p-3 rounded-xl">
            {correctAnswer}
          </p>
        </div>
      )}
      <button
        onClick={onPlayAgain}
        className="bg-orange-brand hover:bg-orange-dark text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98]"
      >
        Volver al inicio
      </button>
    </div>
  );
}
