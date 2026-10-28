import { useEffect, useState } from 'react';

export function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved === null ? fallback : JSON.parse(saved);
    } catch (error) {
      console.warn(`Could not read local data for "${key}". Using demo defaults.`, error);
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Could not save local data for "${key}".`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
