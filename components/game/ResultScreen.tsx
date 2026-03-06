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
      <div className="text-center max-w-md sm:max-w-lg mx-auto animate-bounce-in">
        <Confetti />

        {/* Trophy */}
        <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-5 rounded-full bg-orange-brand/10 flex items-center justify-center glow-orange">
          <svg
            className="w-16 h-16 sm:w-18 sm:h-18 text-orange-brand"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 3h14c.6 0 1 .4 1 1v2c0 2.8-2.2 5-5 5h-.2c-.5 1.5-1.5 2.7-2.8 3.5V17h3v2H8v-2h3v-2.5c-1.3-.8-2.3-2-2.8-3.5H8C5.2 11 3 8.8 3 6V4c0-.6.4-1 1-1h1zm0 2v1c0 1.7 1.3 3 3 3h.1c0-.3 0-.7.1-1H5V5zm14 0h-3.2c.1.3.1.7.1 1H16c1.7 0 3-1.3 3-3V5z"/>
          </svg>
        </div>

        <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-brand mb-2 animate-sparkle">
          ¡¡GANASTE!!
        </h2>
        <p className="text-orange-brand font-bold text-xl sm:text-2xl mb-5">
          ¡Felicitaciones!
        </p>

        <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 sm:p-7 mb-7 animate-slide-up">
          <svg className="w-10 h-10 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <p className="text-green-800 font-bold text-lg sm:text-xl">{winMessage}</p>
        </div>

        <button
          onClick={onPlayAgain}
          className="bg-orange-brand hover:bg-orange-dark text-white font-bold px-10 py-4 rounded-xl text-lg sm:text-xl transition-all duration-200 cursor-pointer active:scale-[0.97] animate-scale-pop"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          ¡Jugar de nuevo!
        </button>
      </div>
    );
  }

  return (
    <div className="text-center max-w-md sm:max-w-lg mx-auto animate-bounce-in">
      {/* Sad face icon */}
      <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
        <svg
          className="w-16 h-16 sm:w-18 sm:h-18 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
          />
        </svg>
      </div>

      <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-brand mb-2">
        ¡Casi casi!
      </h2>
      <p className="text-gray-400 mb-5 text-lg sm:text-xl">
        No te preocupes, ¡la próxima seguro la clavás!
      </p>

      {correctAnswer && (
        <div className="mb-7 animate-slide-up">
          <p className="text-gray-400 mb-2 text-sm sm:text-base uppercase tracking-wider font-semibold">
            La respuesta correcta era
          </p>
          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-800 font-bold text-lg sm:text-xl">{correctAnswer}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onPlayAgain}
        className="bg-orange-brand hover:bg-orange-dark text-white font-bold px-10 py-4 rounded-xl text-lg sm:text-xl transition-all duration-200 cursor-pointer active:scale-[0.97] animate-scale-pop"
        style={{ animationDelay: "0.3s", opacity: 0 }}
      >
        ¡Intentar de nuevo!
      </button>
    </div>
  );
}
