const STORAGE_PREFIX = "father-maker.";

interface StoredPayload<T> {
  value: T;
  expiresAt?: number;
}

const hasWindow = typeof window !== "undefined";

function getStorage(): Storage | null {
  if (!hasWindow) {
    return null;
  }
  try {
    return window.localStorage;
  } catch (error) {
    console.warn("localStorage unavailable", error);
    return null;
  }
}

function buildKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

export function setStoredValue<T>(key: string, value: T, ttlMs?: number) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const payload: StoredPayload<T> = {
    value,
    expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
  };

  try {
    storage.setItem(buildKey(key), JSON.stringify(payload));
  } catch (error) {
    console.warn("Failed to save to localStorage", error);
  }
}

export function getStoredValue<T>(key: string): T | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const raw = storage.getItem(buildKey(key));
  if (!raw) {
    return null;
  }

  try {
    const payload = JSON.parse(raw) as StoredPayload<T>;
    if (payload.expiresAt && payload.expiresAt < Date.now()) {
      storage.removeItem(buildKey(key));
      return null;
    }
    return payload.value;
  } catch (error) {
    console.warn("Failed to parse stored value", error);
    storage.removeItem(buildKey(key));
    return null;
  }
}

export function removeStoredValue(key: string) {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  storage.removeItem(buildKey(key));
}

export function clearStorage(prefix = "") {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const targetPrefix = `${STORAGE_PREFIX}${prefix}`;
  const keysToRemove: string[] = [];

  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && key.startsWith(targetPrefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => storage.removeItem(key));
}

export { STORAGE_PREFIX };
