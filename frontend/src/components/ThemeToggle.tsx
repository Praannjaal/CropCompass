import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { setThemeMode, useThemeMode, type ThemeMode } from "../lib/theme";
import { cx } from "./ui";

const OPTIONS: { mode: ThemeMode; Icon: typeof Sun }[] = [
  { mode: "light", Icon: Sun },
  { mode: "dark", Icon: Moon },
  { mode: "system", Icon: Monitor },
];

/** Light / dark / follow-the-device switch. */
export function ThemeToggle({ className }: { className?: string }) {
  const { t } = useTranslation();
  const current = useThemeMode();
  return (
    <div role="group" aria-label={t("theme.label")} className={cx("inline-flex rounded-lg border border-stone-200 bg-surface p-0.5", className)}>
      {OPTIONS.map(({ mode, Icon }) => (
        <button
          key={mode}
          type="button"
          aria-pressed={current === mode}
          title={t(`theme.${mode}`)}
          onClick={() => setThemeMode(mode)}
          className={cx(
            "flex size-7 items-center justify-center rounded-md transition-colors",
            current === mode ? "bg-stone-100 text-stone-900" : "text-stone-500 hover:text-stone-800",
          )}
        >
          <Icon className="size-3.5" aria-hidden="true" />
          <span className="sr-only">{t(`theme.${mode}`)}</span>
        </button>
      ))}
    </div>
  );
}
