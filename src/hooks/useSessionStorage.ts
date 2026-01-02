import { useEffect, useRef, useCallback } from 'preact/hooks';
import { saveToLocalStorage } from '../utils/storage';
import { DEFAULT_DEBOUNCE_MS } from '../constants';

const AUTOSAVE_KEY = 'prompt_builder_autosave';

export const useSessionStorage = <T,>(data: T, debounceMs: number = DEFAULT_DEBOUNCE_MS) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveToLocalStorage(AUTOSAVE_KEY, data);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debounceMs]);
};

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = DEFAULT_DEBOUNCE_MS
): T => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
};
