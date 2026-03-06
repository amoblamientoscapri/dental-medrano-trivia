import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Logo placeholder */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-orange-brand rounded-full flex items-center justify-center shadow-lg">
            <svg
              viewBox="0 0 64 64"
              className="w-20 h-20 text-white"
              fill="currentColor"
            >
              <path d="M32 4C18.7 4 8 14.7 8 28c0 8.4 4.3 15.8 10.8 20.1L22 60l4-6h12l4 6 3.2-11.9C51.7 43.8 56 36.4 56 28 56 14.7 45.3 4 32 4zm-8 30c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm16 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Trivia Dental
        </h1>
        <p className="text-lg text-orange-brand font-semibold mb-1">
          Dental Medrano
        </p>
        <p className="text-sm text-gray-500 mb-8 tracking-widest uppercase">
          World Class Dental Solutions
        </p>

        <p className="text-gray-600 mb-8">
          Respondé 3 preguntas sobre odontología y ganá un premio!
        </p>

        <Link
          href="/jugar"
          className="inline-block bg-orange-brand hover:bg-orange-dark text-white font-bold text-xl px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
        >
          JUGAR
        </Link>
      </div>

      <footer className="absolute bottom-4 text-xs text-gray-400">
        Dental Medrano &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
