export function readLocalValue(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch (error) {
    console.warn(`Could not read local data for "${key}". Using demo defaults.`, error);
    return fallback;
  }
}

export function writeLocalValue(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Could not save local data for "${key}".`, error);
  }
}
