import type { QuizAnswer, FatherTypeId } from "../types/father";

/**
 * Convert quiz answers to a Father type ID
 * Based on counting preference patterns
 */
export function quizToFatherType(answers: QuizAnswer[]): FatherTypeId {
  const scores: Record<FatherTypeId, number> = {
    supportive: 0,
    laidback: 0,
    awkward: 0,
    playful: 0,
    organized: 0,
  };

  // Q1: Atmosphere
  if (answers[0]?.answerIndex === 0) scores.supportive += 2; // quiet and calm
  if (answers[0]?.answerIndex === 1) scores.laidback += 2; // gentle and relaxed
  if (answers[0]?.answerIndex === 2) scores.awkward += 2; // awkward but earnest
  if (answers[0]?.answerIndex === 3) scores.playful += 2; // playful
  if (answers[0]?.answerIndex === 4) scores.organized += 2; // orderly

  // Q2: Home activities
  if (answers[1]?.answerIndex === 0) scores.supportive += 2; // supporting family
  if (answers[1]?.answerIndex === 1) scores.laidback += 2; // own pace rest
  if (answers[1]?.answerIndex === 2) scores.awkward += 2; // Same routine daily
  if (answers[1]?.answerIndex === 3) scores.playful += 2; // hobbies
  if (answers[1]?.answerIndex === 4) scores.organized += 2; // planned actions

  // Q3: When tired
  if (answers[2]?.answerIndex === 0) scores.supportive += 2; // doesn't show it
  if (answers[2]?.answerIndex === 1) scores.laidback += 2; // takes time to rest
  if (answers[2]?.answerIndex === 2) scores.awkward += 2; // tries to keep going
  if (answers[2]?.answerIndex === 3) scores.playful += 2; // seeks refreshment
  if (answers[2]?.answerIndex === 4) scores.organized += 2; // calmly manages

  // Q4: Youth interests
  if (answers[3]?.answerIndex === 0) scores.supportive += 2; // sense of duty
  if (answers[3]?.answerIndex === 1) scores.laidback += 2; // own pace enjoyment
  if (answers[3]?.answerIndex === 2) scores.awkward += 2; // daily continuity
  if (answers[3]?.answerIndex === 3) scores.playful += 2; // pursuing hobbies
  if (answers[3]?.answerIndex === 4) scores.organized += 2; // planning and execution

  // Q5: Family role
  if (answers[4]?.answerIndex === 0) scores.supportive += 2; // role of support
  if (answers[4]?.answerIndex === 1) scores.laidback += 2; // matching pace
  if (answers[4]?.answerIndex === 2) scores.awkward += 2; // quietly accumulates
  if (answers[4]?.answerIndex === 3) scores.playful += 2; // brings joy
  if (answers[4]?.answerIndex === 4) scores.organized += 2; // guides family

  // Q6: Real strengths
  if (answers[5]?.answerIndex === 0) scores.supportive += 2; // fulfilling duty
  if (answers[5]?.answerIndex === 1) scores.laidback += 2; // mental composure
  if (answers[5]?.answerIndex === 2) scores.awkward += 2; // continuing consistently
  if (answers[5]?.answerIndex === 3) scores.playful += 2; // curiosity
  if (answers[5]?.answerIndex === 4) scores.organized += 2; // overall planning

  // Find the type with the highest score
  const maxScore = Math.max(...Object.values(scores));
  const types = Object.keys(scores) as FatherTypeId[];
  const winningType = types.find((type) => scores[type] === maxScore);

  // If no clear winner, use the catchphrase (Q7) as a tiebreaker
  if (!winningType) return "supportive";

  // Consider the text answer (Q7) as a bonus
  const textAnswer = answers[6]?.text?.toLowerCase() || "";
  if (textAnswer.includes("休")) scores.laidback += 1;
  if (textAnswer.includes("継続") || textAnswer.includes("毎日")) scores.awkward += 1;
  if (textAnswer.includes("気") || textAnswer.includes("遊び")) scores.playful += 1;
  if (textAnswer.includes("計画") || textAnswer.includes("段取")) scores.organized += 1;

  // Determine final type
  const finalMaxScore = Math.max(...Object.values(scores));
  for (const type of types) {
    if (scores[type] === finalMaxScore) return type;
  }

  return winningType || "supportive";
}
