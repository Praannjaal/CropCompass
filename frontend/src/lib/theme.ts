import { useSyncExternalStore } from "react";

/** The viewer's choice; "system" follows the device setting. index.html applies it before first paint. */
export type ThemeMode = "light" | "dark" | "system";
export type Theme = "light" | "dark";

const STORAGE_KEY = "af_theme";
const media = window.matchMedia("(prefers-color-scheme: dark)");
const listeners = new Set<() => void>();

function savedMode(): ThemeMode {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

let mode: ThemeMode = savedMode();

function resolve(value: ThemeMode): Theme {
  return value === "system" ? (media.matches ? "dark" : "light") : value;
}

function apply() {
  document.documentElement.dataset.theme = resolve(mode);
  listeners.forEach((listener) => listener());
}

media.addEventListener("change", () => {
  if (mode === "system") apply();
});

export function setThemeMode(next: ThemeMode): void {
  mode = next;
  try {
    if (next === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage can be unavailable (private mode); the choice then lasts for this page only.
  }
  apply();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(subscribe, () => mode);
}

/** The theme actually shown (system resolved to light or dark). */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, () => resolve(mode));
}
