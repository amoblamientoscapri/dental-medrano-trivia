import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  return (
    <main className="h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-6 overflow-hidden">
      <div className="text-center max-w-lg mx-auto">
        <div className="mb-4 animate-float">
          <Logo size="sm" className="mx-auto drop-shadow-lg" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-brand mb-1">
          ¡TRIVIA
          <span className="text-orange-brand"> DENTAL!</span>
        </h1>
        <p className="text-gray-400 mb-6 text-base">
          Respondé 3 preguntas y ganá un premio
        </p>

        <div className="flex gap-4 w-full">
          <Link
            href="/feria"
            className="flex-1 bg-orange-brand hover:bg-orange-dark text-white font-extrabold text-xl py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-[0.97] text-center"
          >
            <svg className="w-6 h-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Feria
            <span className="block text-xs font-normal opacity-75 mt-0.5">con registro</span>
          </Link>

          <Link
            href="/jugar"
            className="flex-1 bg-white hover:bg-gray-50 text-gray-brand font-extrabold text-xl py-4 rounded-2xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-orange-brand transition-all duration-200 cursor-pointer active:scale-[0.97] text-center"
          >
            <svg className="w-6 h-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
            </svg>
            Jugar
            <span className="block text-xs font-normal opacity-75 mt-0.5">sin registro</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
