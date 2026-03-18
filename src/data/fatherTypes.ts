import type { FatherProfile } from "../types/father";

export const fatherProfiles: Record<string, FatherProfile> = {
  supportive: {
    id: "supportive",
    displayName: "無口な見守り父",
    tags: ["静か", "まじめ", "支える"],
    description:
      "言葉は少ないけれど、毎日同じように家族を支えているタイプ。疲れていても、それをあまり見せません。",
    tendencies: {
      working: 0.4,
      resting: 0.15,
      commuting: 0.15,
      relaxing: 0.1,
      thinking: 0.15,
      sleeping: 0.05,
    },
  },
  laidback: {
    id: "laidback",
    displayName: "マイペース休憩父",
    tags: ["穏やか", "のんびり", "休み上手"],
    description:
      "家では自分のペースを大切にしているタイプ。疲れたときほど、ゆっくり休むことができます。",
    tendencies: {
      working: 0.15,
      resting: 0.3,
      commuting: 0.1,
      relaxing: 0.3,
      thinking: 0.1,
      sleeping: 0.05,
    },
  },
  awkward: {
    id: "awkward",
    displayName: "不器用継続父",
    tags: ["感情表現は少ない", "毎日続ける", "実直"],
    description:
      "感情表現は不器用だけれど、毎日同じことを続けるタイプ。その継続が家を支えています。",
    tendencies: {
      working: 0.35,
      resting: 0.1,
      commuting: 0.15,
      relaxing: 0.1,
      thinking: 0.25,
      sleeping: 0.05,
    },
  },
  playful: {
    id: "playful",
    displayName: "少年心の残る趣味父",
    tags: ["遊び心がある", "趣味思い", "好奇心旺盛"],
    description:
      "大人になっても少し遊び心が残っているタイプ。趣味の時間を大事にしています。",
    tendencies: {
      working: 0.2,
      resting: 0.15,
      commuting: 0.2,
      relaxing: 0.35,
      thinking: 0.1,
      sleeping: 0.0,
    },
  },
  organized: {
    id: "organized",
    displayName: "静かな段取り父",
    tags: ["几帳面", "効率的", "落ち着いている"],
    description:
      "毎日を段取りよく進めるタイプ。計画的な行動が習慣になっています。",
    tendencies: {
      working: 0.35,
      resting: 0.1,
      commuting: 0.3,
      relaxing: 0.15,
      thinking: 0.1,
      sleeping: 0.0,
    },
  },
};
