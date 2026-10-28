export function classFor(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function formatDate(value, locale, options = { month: 'short', day: 'numeric' }) {
  if (!value) return '—';
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function readValidArray(value, fallback, key) {
  if (Array.isArray(value)) return value;
  if (value !== fallback) console.warn(`Invalid local data for "${key}". Restoring demo data.`);
  return fallback;
}
