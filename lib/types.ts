export interface Question {
  id: string;
  text: string;
  options: [string, string, string];
  correctIndex: number; // 0, 1, or 2
}

export interface GameConfig {
  questionsPerRound: number;
  winMessage: string;
}

export type GamePhase = "idle" | "playing" | "won" | "lost";

export interface GameState {
  phase: GamePhase;
  questions: Question[];
  currentIndex: number;
  selectedOption: number | null;
  showFeedback: boolean;
}

export interface Registration {
  id: string;
  nombre: string;
  telefono: string;
  correo: string;
  edad: number;
  esEstudiante: boolean;
  especialidad?: string;
  timestamp: string;
  gameResult?: "won" | "lost";
}
