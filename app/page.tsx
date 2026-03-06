import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4 overflow-hidden">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8 animate-float">
          <Logo size="lg" className="mx-auto drop-shadow-lg" />
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8 mb-6 animate-bounce-in">
          <div className="mb-2">
            <span className="inline-block bg-orange-brand/10 text-orange-brand text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Desafio dental
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-brand mb-3">
            Trivia
            <span className="text-orange-brand"> Dental!</span>
          </h1>

          <p className="text-gray-500 mb-2 text-lg leading-relaxed">
            Responde <span className="font-bold text-orange-brand">3 preguntas</span> sobre odontologia
          </p>
          <p className="text-gray-400 mb-6 text-base">
            Si acertas las 3... <span className="font-bold text-green-600">ganas un premio!</span>
          </p>

          <Link
            href="/jugar"
            className="group inline-flex items-center justify-center w-full bg-orange-brand hover:bg-orange-dark text-white font-extrabold text-xl py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-[0.97] gap-2"
          >
            <svg className="w-6 h-6 transition-transform duration-200 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
            </svg>
            JUGAR!
          </Link>

          <p className="mt-4 text-xs text-gray-300">
            Te animas?
          </p>
        </div>
      </div>

      <footer className="absolute bottom-4 text-xs text-gray-400">
        Dental Medrano &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
