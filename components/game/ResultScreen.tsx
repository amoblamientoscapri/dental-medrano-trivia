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
        <div className="text-7xl mb-6">🏆</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          GANASTE!
        </h2>
        <p className="text-lg text-gray-600 mb-8">{winMessage}</p>
        <button
          onClick={onPlayAgain}
          className="bg-orange-brand hover:bg-orange-dark text-white font-bold px-8 py-3 rounded-xl transition-all duration-200"
        >
          Jugar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="text-7xl mb-6">😅</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Estuviste cerca!
      </h2>
      {correctAnswer && (
        <p className="text-gray-500 mb-2 text-sm">
          La respuesta correcta era:
        </p>
      )}
      {correctAnswer && (
        <p className="text-green-700 font-semibold mb-8 bg-green-50 p-3 rounded-lg">
          {correctAnswer}
        </p>
      )}
      <button
        onClick={onPlayAgain}
        className="bg-orange-brand hover:bg-orange-dark text-white font-bold px-8 py-3 rounded-xl transition-all duration-200"
      >
        Volver al inicio
      </button>
    </div>
  );
}
