import { clearStorage, getStoredValue, setStoredValue } from "./storage";

export type TextCacheKind =
  | "quote"
  | "log"
  | "summary"
  | "item-reaction"
  | "type-description";

const TEXT_CACHE_PREFIX = "text.";

function sanitize(part: string | number) {
  return String(part).trim().toLowerCase().replace(/\s+/g, "-");
}

export function buildTextCacheKey(
  kind: TextCacheKind,
  parts: Array<string | number | undefined | null>
) {
  const filtered = parts.filter(
    (part) => part !== undefined && part !== null && String(part).length > 0
  ) as Array<string | number>;
  const suffix = filtered.length
    ? filtered.map((part) => sanitize(part)).join(".")
    : "default";
  return `${TEXT_CACHE_PREFIX}${kind}.${suffix}`;
}

export function getCachedText(key: string) {
  return getStoredValue<string>(key);
}

export function setCachedText(key: string, text: string, ttlMs?: number) {
  setStoredValue(key, text, ttlMs);
}

export function clearTextCache() {
  clearStorage(TEXT_CACHE_PREFIX);
}

export function hashForTextCache(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
