import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4 sm:px-6 overflow-hidden">
      <div className="text-center max-w-md sm:max-w-lg mx-auto">
        <div className="mb-4 sm:mb-10 animate-float">
          <Logo size="sm" className="mx-auto drop-shadow-lg" />
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-5 sm:p-10 md:p-12 mb-4 animate-bounce-in">
          <div className="mb-2">
            <span className="inline-block bg-orange-brand/10 text-orange-brand text-sm sm:text-base font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              DESAFÍO DENTAL
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-brand mb-3">
            ¡TRIVIA
            <span className="text-orange-brand"> DENTAL!</span>
          </h1>

          <p className="text-gray-500 mb-1.5 text-lg sm:text-2xl leading-relaxed">
            Respondé <span className="font-bold text-orange-brand">3 preguntas</span> sobre odontología
          </p>
          <p className="text-gray-400 mb-5 text-base sm:text-xl">
            Si acertás las 3... <span className="font-bold text-green-600">¡ganás un premio!</span>
          </p>

          <Link
            href="/jugar"
            className="group inline-flex items-center justify-center w-full bg-orange-brand hover:bg-orange-dark text-white font-extrabold text-2xl sm:text-3xl py-3 sm:py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-[0.97] gap-3"
          >
            <svg className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
            </svg>
            ¡JUGAR!
          </Link>

          <p className="mt-3 text-sm sm:text-base text-gray-300">
            ¿Te animás?
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-400">
        Dental Medrano &copy; {new Date().getFullYear()}
      </p>
    </main>
  );
}
