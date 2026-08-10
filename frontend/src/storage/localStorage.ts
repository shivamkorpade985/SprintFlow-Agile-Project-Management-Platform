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