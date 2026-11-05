import { ArrowRight, CalendarDays, Coins, Droplets } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCatalog, useNextCrop } from "../../api/hooks";
import type { Farm } from "../../api/types";
import { Button, Card, cx, Spinner } from "../../components/ui";
import { fullDate, money, percent } from "../../lib/format";
import { cropName } from "../crops/text";
import { DEFAULT_PRIORITIES } from "./parts";

/** The farm's home card: the three best next crops for the saved priorities (the Plan tab's first query). */
export function NextCropSummary({ farm, onOpenPlan }: { farm: Farm; onOpenPlan: () => void }) {
  const { t } = useTranslation();
  const catalog = useCatalog().data;
  const advice = useNextCrop(farm.id, undefined, farm.irrigation, farm.priorities ?? DEFAULT_PRIORITIES);

  if (advice.isPending) {
    return (
      <Card className="flex items-center gap-3 text-sm text-stone-500">
        <Spinner className="size-4" />
        {t("farm.summaryLoading")}
      </Card>
    );
  }
  if (advice.isError) return null;

  const data = advice.data;
  const top = data.options.slice(0, 3);
  const soil = data.soil_now;
  const compare =
    soil.percentile < 0.5
      ? t("plan.drierThan", { pct: percent(1 - soil.percentile) })
      : t("plan.wetterThan", { pct: percent(soil.percentile) });
  const hard = (top[0]?.yield.failure.p ?? 0) >= 0.5;
  return (
    <Card flush>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold">
            {t("farm.summaryTitle", { season: t(`history.seasonName.${data.season}`), year: data.season_year })}
          </h2>
          <p className="mt-0.5 text-sm text-stone-500">{t("farm.summarySub")}</p>
        </div>
        <Button size="sm" variant="secondary" onClick={onOpenPlan}>
          {t("farm.summaryOpen")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <div className="p-5">
        {top.length === 0 ? (
          <p className="text-sm text-amber-800">{t("plan.noOptions")}</p>
        ) : (
          <ol className="grid gap-3 sm:grid-cols-3">
            {top.map((option, index) => {
              const success = option.yield.failure.p == null ? null : 1 - option.yield.failure.p;
              const bar = success == null ? "bg-stone-300" : success >= 0.8 ? "bg-emerald-500" : success >= 0.5 ? "bg-amber-400" : "bg-red-400";
              return (
                <li
                  key={option.id}
                  className={cx("rounded-lg border p-4", index === 0 ? "border-emerald-300 bg-emerald-50/50" : "border-stone-200")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-stone-500 tabular" aria-label={t("farm.rank", { rank: option.rank })}>
                      #{option.rank}
                    </span>
                    {(option.income.mean ?? 0) < 0 && <span className="text-xs font-semibold text-red-700">{t("quality.loss")}</span>}
                  </div>
                  <p className="mt-1 text-base font-semibold text-stone-900">{cropName(catalog, option.id)}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-700">
                    <Coins className="size-3.5 text-stone-400" aria-hidden="true" />
                    <span className="tabular">{t("farm.summaryProfit", { value: money(option.income.mean, data.economics.currency) })}</span>
                  </p>
                  <div className="mt-3">
                    <div className="flex items-baseline justify-between gap-2 text-xs text-stone-500">
                      <span>{t("farm.successOdds")}</span>
                      <span className="font-semibold text-stone-900 tabular">{success == null ? "—" : percent(success)}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-100">
                      <div className={cx("h-full rounded-full", bar)} style={{ width: `${Math.round((success ?? 0) * 100)}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-stone-500">
                      {t("farm.summaryFails", { odds: t("quality.failureExact", { ...option.yield.failure, percent: percent(option.yield.failure.p) }) })}
                    </p>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-600">
                    <CalendarDays className="size-3.5 text-stone-400" aria-hidden="true" />
                    {t("farm.summarySow", { date: fullDate(option.sowing.best) })}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
        <p className="mt-4 flex items-start gap-2 text-xs text-stone-600">
          <Droplets className="mt-px size-3.5 shrink-0 text-sky-600" aria-hidden="true" />
          <span>
            {hard && <span className="font-semibold text-amber-800">{t("farm.summaryHard")} </span>}
            {t("farm.summarySoil", { pct: percent(soil.fraction), compare })}
          </span>
        </p>
      </div>
    </Card>
  );
}
