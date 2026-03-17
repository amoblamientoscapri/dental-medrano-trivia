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

export interface CampaignConfig {
  name: string;
  slug: string;
  prizeDeadline: string;
  active: boolean;
}

export type GamePhase = "idle" | "playing" | "won" | "lost";

export interface GameState {
  phase: GamePhase;
  questions: Question[];
  currentIndex: number;
  selectedOption: number | null;
  showFeedback: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  slug: string;
  flowType: "jugar" | "feria";
  expiresAt: string;
  active: boolean;
  createdAt: string;
}

export interface Registration {
  id: string;
  nombre: string;
  telefono: string;
  correo: string;
  edad: number;
  esEstudiante: boolean;
  especialidad?: string;
  localidad?: string;
  provincia?: string;
  timestamp: string;
  gameResult?: "won" | "lost";
  campaignId?: string;
  campaign?: Campaign | null;
  prize?: Prize | null;
}

export interface Prize {
  id: string;
  code: string;
  registrationId: string;
  status: "pending" | "redeemed";
  redeemedAt?: string | null;
  branchId?: string | null;
  branch?: Branch | null;
  emailSent: boolean;
  emailSentAt?: string | null;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  active: boolean;
}
