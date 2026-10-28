import { useEffect, useState } from 'react';
import { readLocalValue, writeLocalValue } from '../services/localStorage';

export function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => readLocalValue(key, fallback));

  useEffect(() => {
    writeLocalValue(key, value);
  }, [key, value]);

  return [value, setValue];
}
