import { fallbackTexts } from "../data/fallbackTexts";
import type { FatherState, FatherTypeId } from "../types/father";
import {
  buildTextCacheKey,
  getCachedText,
  hashForTextCache,
  setCachedText,
} from "./textCache";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini";

const TEXT_TTLS = {
  quote: 5 * 60 * 1000,
  log: 3 * 60 * 1000,
  summary: 30 * 60 * 1000,
  itemReaction: 15 * 60 * 1000,
  typeDescription: 24 * 60 * 60 * 1000,
};

const fatherDisplayNames: Record<FatherTypeId, string> = {
  supportive: "無口な見守り父",
  laidback: "マイペース休憩父",
  awkward: "不器用継続父",
  playful: "少年心の残る趣味父",
  organized: "静かな段取り父",
};

interface TextGenerationRequest {
  prompt: string;
  maxTokens?: number;
}

async function callOpenAI(request: TextGenerationRequest): Promise<string> {
  if (!OPENAI_API_KEY) {
    return "";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a thoughtful assistant that creates text for a Japanese app about experiencing the invisible daily life of fathers. Keep responses short, gentle, life-like, and leave space for imagination. Respond in Japanese.",
          },
          {
            role: "user",
            content: request.prompt,
          },
        ],
        max_tokens: request.maxTokens || 100,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      console.error(
        "OpenAI API error:",
        response.status,
        await response.text()
      );
      return "";
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Failed to call OpenAI API:", error);
    return "";
  }
}

export async function generateFatherQuote(
  state: FatherState,
  typeId?: FatherTypeId
): Promise<string> {
  const typeLabel = typeId ? fatherDisplayNames[typeId] : "父";
  const cacheKey = buildTextCacheKey("quote", [typeId || "any", state]);
  const cached = getCachedText(cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = `Generate a short, gentle, slightly awkward quote (max 15 characters) for a ${typeLabel} who is currently "${state}". Respond with ONLY the quote, nothing else.`;

  let quote = "";
  if (OPENAI_API_KEY) {
    quote = await callOpenAI({ prompt, maxTokens: 50 });
  }

  if (!quote) {
    const quotes = fallbackTexts.quotes[state] || fallbackTexts.quotes.thinking;
    quote = quotes[Math.floor(Math.random() * quotes.length)];
  }

  setCachedText(cacheKey, quote, TEXT_TTLS.quote);
  return quote;
}

export async function generateLogEntry(
  state: FatherState,
  typeId?: FatherTypeId
): Promise<string> {
  const typeLabel = typeId ? fatherDisplayNames[typeId] : "父";
  const cacheKey = buildTextCacheKey("log", [typeId || "any", state]);
  const cached = getCachedText(cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = `Generate a brief, poetic log entry (max 20 characters) describing a ${typeLabel} while he is "${state}". Respond with ONLY the entry, nothing else.`;

  let logText = "";
  if (OPENAI_API_KEY) {
    logText = await callOpenAI({ prompt, maxTokens: 50 });
  }

  if (!logText) {
    const logs = fallbackTexts.logs[state] || fallbackTexts.logs.thinking;
    logText = logs[Math.floor(Math.random() * logs.length)];
  }

  setCachedText(cacheKey, logText, TEXT_TTLS.log);
  return logText;
}

export async function generateTypeDescription(
  typeId: FatherTypeId
): Promise<string> {
  const cacheKey = buildTextCacheKey("type-description", [typeId]);
  const cached = getCachedText(cacheKey);
  if (cached) {
    return cached;
  }

  const displayName = fatherDisplayNames[typeId] || "父";
  const prompt = `Generate a 50-character description of a father type called "${displayName}". Keep it gentle and life-like.`;

  let description = "";
  if (OPENAI_API_KEY) {
    description = await callOpenAI({ prompt, maxTokens: 100 });
  }

  if (!description) {
    description = fallbackTexts.typeDescriptions[typeId] || "あなたの父についてです。";
  }

  setCachedText(cacheKey, description, TEXT_TTLS.typeDescription);
  return description;
}

export async function generateItemReaction(
  itemName: string,
  typeId?: FatherTypeId
): Promise<string> {
  const typeLabel = typeId ? fatherDisplayNames[typeId] : "父";
  const cacheKey = buildTextCacheKey("item-reaction", [typeId || "any", itemName]);
  const cached = getCachedText(cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = `A ${typeLabel} receives "${itemName}". Generate a short, gentle reaction (max 20 characters). Respond with ONLY the reaction.`;

  let reaction = "";
  if (OPENAI_API_KEY) {
    reaction = await callOpenAI({ prompt, maxTokens: 50 });
  }

  if (!reaction) {
    const reactions =
      fallbackTexts.itemReactions[
        itemName as keyof typeof fallbackTexts.itemReactions
      ] || fallbackTexts.itemReactions["おつかれさま"];
    reaction = reactions[Math.floor(Math.random() * reactions.length)];
  }

  setCachedText(cacheKey, reaction, TEXT_TTLS.itemReaction);
  return reaction;
}

export async function generateDailySummary(
  logs: Array<{ state: FatherState; text: string }>,
  typeId?: FatherTypeId
): Promise<string> {
  const typeLabel = typeId ? fatherDisplayNames[typeId] : "父";
  const logTexts = logs.map((l) => l.text).join("、");
  const basePrompt = `Based on these daily activities of a ${typeLabel}: "${logTexts}", generate a 50-character poetic summary.`;
  const logSignature = logs
    .map((log) => `${log.state}:${log.text}`)
    .join("|");
  const cacheId = hashForTextCache(`${typeId || "any"}-${logSignature}`);
  const cacheKey = buildTextCacheKey("summary", [cacheId]);
  const cached = getCachedText(cacheKey);
  if (cached) {
    return cached;
  }

  let summary = "";

  if (OPENAI_API_KEY) {
    summary = await callOpenAI({ prompt: basePrompt, maxTokens: 100 });
  }

  if (!summary) {
    summary = `今日も、いつもと変わらない1日でした。`;
  }

  const closure =
    fallbackTexts.summaryClosure[
      Math.floor(Math.random() * fallbackTexts.summaryClosure.length)
    ];

  const finalSummary = `${summary}\n${closure}`;
  setCachedText(cacheKey, finalSummary, TEXT_TTLS.summary);
  return finalSummary;
}
