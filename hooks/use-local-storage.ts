"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const LOCAL_EVENT = "local-storage-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCAL_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCAL_EVENT, callback);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Persist a JSON-serialisable value in localStorage.
 *
 * Built on useSyncExternalStore so the server render and the first client
 * render agree (both use `initialValue`), and every component that uses the
 * same key stays in sync, including across browser tabs.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );

  const value = useMemo<T>(() => {
    if (raw === null) return initialValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
    // initialValue is intentionally excluded: callers often pass literals.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  const setValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      const current = (() => {
        const stored = readRaw(key);
        if (stored === null) return initialValue;
        try {
          return JSON.parse(stored) as T;
        } catch {
          return initialValue;
        }
      })();
      const resolved =
        typeof next === "function"
          ? (next as (previous: T) => T)(current)
          : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Storage can be unavailable (private mode, quota). Fail quietly.
      }
      window.dispatchEvent(new Event(LOCAL_EVENT));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [value, setValue] as const;
}
