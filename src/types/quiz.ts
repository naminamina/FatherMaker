export interface QuizQuestion {
  id: string;
  text: string;
  type: "choice" | "text";
  options?: string[];
}
