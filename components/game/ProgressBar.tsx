"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 sm:gap-4">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-base sm:text-lg font-bold transition-all duration-300 ${
              i < current
                ? "bg-green-500 text-white scale-100"
                : i === current
                  ? "bg-orange-brand text-white scale-110 dot-active"
                  : "bg-gray-200 text-gray-400"
            }`}
          >
            {i < current ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < total - 1 && (
            <div
              className={`w-10 sm:w-12 h-1.5 rounded transition-all duration-300 ${
                i < current ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
