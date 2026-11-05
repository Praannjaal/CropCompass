import { Layers, MapPin, Satellite, Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TourButton } from "./TourButton";
import { cx } from "./ui";

const STEPS = [
  { key: "step1", Icon: MapPin },
  { key: "step2", Icon: Satellite },
  { key: "step3", Icon: Layers },
  { key: "step4", Icon: Sprout },
] as const;

/** Four-step explainer: pin → NASA data → soil → next crop. */
export function HowItWorks({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <section className={cx("rounded-xl border border-stone-200 bg-surface p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">{t("how.title")}</h2>
          <p className="mt-1 text-sm text-stone-500">{t("how.subtitle")}</p>
        </div>
        <TourButton />
      </div>
      <ol className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-stone-200">
        {STEPS.map(({ key, Icon }, index) => (
          <li key={key} className="flex gap-3 lg:flex-col lg:px-5 lg:first:pl-0 lg:last:pr-0">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              <Icon className="size-4.5" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-stone-400 tabular">0{index + 1}</p>
              <h3 className="text-sm font-semibold text-stone-900">{t(`how.${key}Title`)}</h3>
              <p className="mt-1 text-sm leading-snug text-stone-600">{t(`how.${key}Text`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
