"use client";

import { Confetti } from "./Confetti";
import { QRCodeSVG } from "qrcode.react";
import type { Branch } from "@/lib/types";

interface ResultScreenProps {
  won: boolean;
  winMessage: string;
  correctAnswer?: string;
  onPlayAgain: () => void;
  playerName?: string;
  prizeCode?: string;
  branches?: Branch[];
  prizeDeadline?: string;
}

function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-4 mt-3">
      <a
        href="https://dentalmedrano.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-brand transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9 9 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
        dentalmedrano.com
      </a>
      <a
        href="https://instagram.com/dentalmedrano/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-brand transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
        @dentalmedrano
      </a>
    </div>
  );
}

export function ResultScreen({
  won,
  winMessage,
  correctAnswer,
  onPlayAgain,
  playerName,
  prizeCode,
  branches,
  prizeDeadline,
}: ResultScreenProps) {
  const displayName = playerName ? playerName.split(" ")[0] : "";
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  if (won) {
    return (
      <div className="text-center w-full max-w-lg mx-auto animate-bounce-in overflow-y-auto max-h-[90vh]">
        <Confetti />

        {/* Trophy */}
        <div className="w-14 h-14 mx-auto mb-1 rounded-full bg-orange-brand/10 flex items-center justify-center glow-orange">
          <svg
            className="w-7 h-7 text-orange-brand"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 3h14c.6 0 1 .4 1 1v2c0 2.8-2.2 5-5 5h-.2c-.5 1.5-1.5 2.7-2.8 3.5V17h3v2H8v-2h3v-2.5c-1.3-.8-2.3-2-2.8-3.5H8C5.2 11 3 8.8 3 6V4c0-.6.4-1 1-1h1zm0 2v1c0 1.7 1.3 3 3 3h.1c0-.3 0-.7.1-1H5V5zm14 0h-3.2c.1.3.1.7.1 1H16c1.7 0 3-1.3 3-3V5z"/>
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-brand mb-0.5 animate-sparkle">
          {displayName ? `${displayName}, ¡¡GANASTE!!` : "¡¡GANASTE!!"}
        </h2>
        <p className="text-orange-brand font-bold text-base mb-1">
          ¡Felicitaciones!
        </p>

        {/* Prize code + QR */}
        {prizeCode ? (
          <div className="animate-slide-up">
            <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-3 mb-2">
              <p className="text-sm text-gray-600 mb-1">Tu código de premio:</p>
              <p className="text-3xl font-extrabold font-mono text-orange-brand tracking-widest mb-2">
                {prizeCode}
              </p>
              <div className="flex justify-center mb-2">
                <QRCodeSVG
                  value={`${baseUrl}/premio/${prizeCode}`}
                  size={140}
                  bgColor="transparent"
                  fgColor="#F47920"
                  level="M"
                />
              </div>
            </div>

            {/* Branches */}
            {branches && branches.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-3 mb-2">
                <p className="text-sm font-bold text-green-800 mb-1">
                  El premio se retira únicamente con el QR en:
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  {branches.filter(b => b.active).map((b) => (
                    <li key={b.id} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span><strong>{b.name}</strong> - {b.address}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-2 mb-2 animate-slide-up">
            <svg className="w-7 h-7 text-green-500 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <p className="text-green-800 font-bold text-base">{winMessage}</p>
          </div>
        )}

        {prizeDeadline && (
          <div className="mb-2 animate-slide-up bg-red-600 rounded-2xl p-3 flex items-center gap-3" style={{ animationDelay: "0.2s" }}>
            <svg className="w-8 h-8 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white font-extrabold text-lg leading-tight">
              Retirá tu premio antes del{" "}
              {new Date(prizeDeadline + "T12:00:00").toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        )}

        <button
          onClick={onPlayAgain}
          className="bg-orange-brand hover:bg-orange-dark text-white font-bold px-8 py-2.5 rounded-xl text-lg transition-all duration-200 cursor-pointer active:scale-[0.97] animate-scale-pop"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          ¡Jugar de nuevo!
        </button>

        <button
          onClick={() => { window.location.href = "/"; }}
          className="block mx-auto mt-2 text-sm text-gray-400 hover:text-orange-brand transition-colors cursor-pointer"
        >
          Volver al menú
        </button>

        <SocialLinks />
      </div>
    );
  }

  return (
    <div className="text-center w-full max-w-lg mx-auto animate-bounce-in">
      {/* Sad face icon */}
      <div className="w-14 h-14 mx-auto mb-1 rounded-full bg-red-50 flex items-center justify-center">
        <svg
          className="w-7 h-7 text-red-400"
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

      <h2 className="text-3xl font-extrabold text-gray-brand mb-0.5">
        {displayName ? `${displayName}, ¡Casi casi!` : "¡Casi casi!"}
      </h2>
      <p className="text-gray-400 mb-1.5 text-sm">
        No te preocupes, ¡la próxima seguro la clavás!
      </p>

      {correctAnswer && (
        <div className="mb-2 animate-slide-up">
          <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider font-semibold">
            La respuesta correcta era
          </p>
          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-2">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-800 font-bold text-base">{correctAnswer}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onPlayAgain}
        className="bg-orange-brand hover:bg-orange-dark text-white font-bold px-8 py-2.5 rounded-xl text-lg transition-all duration-200 cursor-pointer active:scale-[0.97] animate-scale-pop"
        style={{ animationDelay: "0.3s", opacity: 0 }}
      >
        ¡Intentar de nuevo!
      </button>

      <button
        onClick={() => { window.location.href = "/"; }}
        className="block mx-auto mt-2 text-sm text-gray-400 hover:text-orange-brand transition-colors cursor-pointer"
      >
        Volver al menú
      </button>

      <SocialLinks />
    </div>
  );
}
