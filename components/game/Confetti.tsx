"use client";

import { useEffect, useState } from "react";

const COLORS = [
  "#F47920", "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1",
  "#96CEB4", "#FFEAA7", "#DDA0DD", "#FF8C00", "#00CED1",
];

export function Confetti() {
  const [pieces, setPieces] = useState<
    { id: number; left: number; color: string; delay: number; size: number; shape: string }[]
  >([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 2.5,
      size: Math.random() * 10 + 5,
      shape: Math.random() > 0.6 ? "50%" : Math.random() > 0.3 ? "2px" : "0",
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size * (Math.random() > 0.5 ? 1 : 0.6)}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${2.5 + Math.random() * 2}s`,
            borderRadius: p.shape,
          }}
        />
      ))}
    </div>
  );
}
