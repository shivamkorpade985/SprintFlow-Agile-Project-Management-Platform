/**
 * Low-Level LocalStorage Utility Helpers
 *
 * Provides typed, error-safe wrappers around native `window.localStorage`.
 *
 * Why this utility exists:
 * - Handles JSON serialization (`JSON.stringify`) and deserialization (`JSON.parse`) transparently.
 * - Enforces generic type parameters `<T>` for strict TypeScript type safety on read queries.
 * - Prevents UI components and providers from invoking raw `window.localStorage` calls directly.
 */
const storage = window.localStorage;

export function getItem<T>(key: string): T | null {
  const value = storage.getItem(key);

  if (value === null) {
    return null;
  }

  return JSON.parse(value) as T;
}

export function setItem<T>(key: string, value: T): void {
  storage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  storage.removeItem(key);
}