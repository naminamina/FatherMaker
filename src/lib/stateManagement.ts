import type { FatherState, FatherProfile } from "../types/father";

interface TimeBlock {
  startHour: number;
  endHour: number;
  states: FatherState[];
}

const TIME_BLOCKS: TimeBlock[] = [
  { startHour: 5, endHour: 8, states: ["resting", "thinking", "commuting"] },
  { startHour: 8, endHour: 12, states: ["working", "thinking", "commuting"] },
  { startHour: 12, endHour: 14, states: ["resting", "working", "thinking"] },
  { startHour: 14, endHour: 18, states: ["working", "commuting", "thinking"] },
  { startHour: 18, endHour: 21, states: ["commuting", "relaxing", "thinking"] },
  { startHour: 21, endHour: 24, states: ["relaxing", "thinking", "resting"] },
  { startHour: 0, endHour: 5, states: ["sleeping", "resting", "thinking"] },
];

const DEFAULT_STATES: FatherState[] = ["resting", "thinking"];

const isHourInBlock = (hour: number, block: TimeBlock) => {
  if (block.startHour <= block.endHour) {
    return hour >= block.startHour && hour < block.endHour;
  }
  return hour >= block.startHour || hour < block.endHour;
};

const selectStateFromBlock = (
  options: FatherState[],
  profile: FatherProfile,
  currentState: FatherState
) => {
  let selected = options[0] ?? currentState;
  let highestScore = -Infinity;

  options.forEach((state, index) => {
    const tendency = profile.tendencies[state] ?? 0.15;
    const orderBonus = (options.length - index) * 0.05;
    const continuityBonus = currentState === state ? 0.2 : 0;
    const randomness = Math.random() * 0.05;
    const score = tendency + orderBonus + continuityBonus + randomness;

    if (score > highestScore) {
      highestScore = score;
      selected = state;
    }
  });

  return selected;
};

export function getTimeBasedState(
  now: Date,
  profile: FatherProfile,
  currentState: FatherState
) {
  const hour = now.getHours();
  const block = TIME_BLOCKS.find((slot) => isHourInBlock(hour, slot));
  const slotStates = block?.states ?? DEFAULT_STATES;
  const desiredState = selectStateFromBlock(slotStates, profile, currentState);

  return { desiredState, slotStates };
}

/**
 * Update stats based on the father's current state
 */
export function updateStats(
  currentState: FatherState,
  stats: { energy: number; fatigue: number; mood: number }
) {
  const newStats = { ...stats };

  // Base changes per state
  switch (currentState) {
    case "working":
      newStats.energy -= 3;
      newStats.fatigue += 2;
      break;
    case "resting":
      newStats.energy += 5;
      newStats.fatigue -= 4;
      break;
    case "commuting":
      newStats.energy -= 1;
      newStats.fatigue += 1;
      break;
    case "relaxing":
      newStats.energy += 3;
      newStats.fatigue -= 2;
      newStats.mood += 1;
      break;
    case "thinking":
      newStats.fatigue += 1;
      break;
    case "sleeping":
      newStats.energy += 10;
      newStats.fatigue -= 8;
      newStats.mood += 2;
      break;
  }

  // Clamp values
  newStats.energy = Math.min(100, Math.max(0, newStats.energy));
  newStats.fatigue = Math.min(100, Math.max(0, newStats.fatigue));
  newStats.mood = Math.min(100, Math.max(0, newStats.mood));

  return newStats;
}
