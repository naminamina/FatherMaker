// Core type definitions for Father Maker

export type FatherTypeId = "supportive" | "laidback" | "awkward" | "playful" | "organized";
export type FatherState = "working" | "resting" | "commuting" | "relaxing" | "thinking" | "sleeping";
export type AppStep = "intro" | "explanation" | "quiz" | "result" | "main" | "log" | "items" | "summary";

export interface FatherProfile {
  id: FatherTypeId;
  displayName: string;
  tags: string[];
  description: string;
  tendencies: Partial<Record<FatherState, number>>;
}

export interface QuizAnswer {
  questionIndex: number;
  answerIndex?: number;
  text?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  state: FatherState;
  text: string;
}

export interface FatherStats {
  energy: number; // 0-100
  fatigue: number; // 0-100
  mood: number; // 0-100
}

export interface AppState {
  currentStep: AppStep;
  quizAnswers: QuizAnswer[];
  fatherProfile: FatherProfile | null;
  currentFatherState: FatherState;
  stats: FatherStats;
  logs: LogEntry[];
  usedItems: string[];
}
