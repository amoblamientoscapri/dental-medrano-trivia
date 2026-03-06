import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-10">
          <Logo size="lg" className="mx-auto" />
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-8 mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-brand mb-3">
            Trivia Dental
          </h1>
          <p className="text-gray-500 mb-6 text-base leading-relaxed">
            Responde 3 preguntas sobre odontologia y gana un premio!
          </p>

          <Link
            href="/jugar"
            className="inline-block w-full bg-orange-brand hover:bg-orange-dark text-white font-bold text-xl py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            JUGAR
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-4 text-xs text-gray-400">
        Dental Medrano &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
