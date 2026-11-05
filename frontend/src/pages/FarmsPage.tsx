import { ArrowRight, Droplets, MapPin, Plus, Ruler, Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import type { Farm } from "../api/types";
import { useFarms, useMe } from "../api/hooks";
import { HowItWorks } from "../components/HowItWorks";
import { Alert, Badge, PageSpinner } from "../components/ui";
import { Satellite } from "../features/satellite/Satellite";

const STATUS_TONE = { pending: "amber", ready: "green", error: "red", limited: "amber" } as const;
/** Shown in the hero before the first farm exists: the Telangana pilot area. */
const PILOT = { lat: 17.0, lon: 78.125 };

export function StatusBadge({ status }: { status: Farm["data_status"] }) {
  const { t } = useTranslation();
  return <Badge tone={STATUS_TONE[status]}>{status === "limited" ? t("plan.confidence.low") : t(`farms.status.${status}`)}</Badge>;
}

const ADD_LINK =
  "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-brand-strong";

function greetingKey(): "farms.greetingMorning" | "farms.greetingAfternoon" | "farms.greetingEvening" {
  const hour = new Date().getHours();
  return hour < 12 ? "farms.greetingMorning" : hour < 17 ? "farms.greetingAfternoon" : "farms.greetingEvening";
}

function FarmCard({ farm }: { farm: Farm }) {
  const { t } = useTranslation();
  return (
    <Link to={`/farms/${farm.id}`} className="group block focus-visible:outline-none">
      <article className="h-full overflow-hidden rounded-xl border border-stone-200 bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-colors group-hover:border-stone-400 group-focus-visible:ring-2 group-focus-visible:ring-emerald-600">
        <Satellite lat={farm.lat} lon={farm.lon} zoom={13} caption={false} label={t("satellite.label", { name: farm.name })} className="h-32">
          <div className="absolute top-2.5 left-2.5 z-10">
            <StatusBadge status={farm.data_status} />
          </div>
        </Satellite>
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="truncate text-base font-semibold text-stone-900">{farm.name}</h2>
            <ArrowRight className="size-4 shrink-0 text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:text-stone-700" aria-hidden="true" />
          </div>
          <ul className="mt-2 space-y-1 text-sm text-stone-600">
            <li className="flex items-center gap-2">
              <MapPin className="size-3.5 text-stone-400" aria-hidden="true" />
              <span className="tabular">
                {farm.lat.toFixed(3)}°, {farm.lon.toFixed(3)}°
              </span>
            </li>
            {farm.area_ha != null && (
              <li className="flex items-center gap-2">
                <Ruler className="size-3.5 text-stone-400" aria-hidden="true" />
                <span className="tabular">{t("farms.hectares", { value: farm.area_ha })}</span>
              </li>
            )}
            <li className="flex items-center gap-2">
              <Droplets className="size-3.5 text-stone-400" aria-hidden="true" />
              {t(`farms.irrigation.${farm.irrigation}`)}
            </li>
          </ul>
          <div className="mt-3">
            <Badge tone={farm.region ? "green" : "sky"}>{t(farm.region ? "farms.regionIN" : "farms.regionNone")}</Badge>
          </div>
        </div>
      </article>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-surface px-4 py-3">
      <dt className="text-xs font-medium text-stone-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-stone-900">{value}</dd>
    </div>
  );
}

export function FarmsPage() {
  const { t, i18n } = useTranslation();
  const farms = useFarms();
  const me = useMe();
  const firstName = me.data?.name?.split(" ")[0];
  const focus = farms.data?.[0] ?? PILOT;
  const today = new Date().toLocaleDateString(i18n.language, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const list = farms.data ?? [];

  return (
    <div className="space-y-8">
      <Satellite
        lat={focus.lat}
        lon={focus.lon}
        zoom={12.5}
        scan="once"
        label={t("satellite.label", { name: "name" in focus ? focus.name : "Telangana" })}
        className="min-h-[280px] rounded-xl border border-stone-200"
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-black/5" aria-hidden="true" />
        <div className="animate-fade relative max-w-xl p-6 text-white sm:p-8">
          <p className="text-xs font-medium tracking-wide text-white/70 uppercase">{today}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {firstName ? t(greetingKey(), { name: firstName }) : t("farms.title")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/80">{t("farms.heroText")}</p>
          <Link
            to="/farms/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-[#1a1d1a] transition-colors hover:bg-white/90"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t("farms.add")}
          </Link>
        </div>
      </Satellite>

      {list.length > 0 && (
        <dl className="grid grid-cols-3 gap-3">
          <Stat label={t("farms.monitored")} value={list.length} />
          <Stat label={t("farms.readyCount")} value={list.filter((farm) => farm.data_status === "ready").length} />
          <Stat label={t("farms.preparingCount")} value={list.filter((farm) => farm.data_status === "pending").length} />
        </dl>
      )}

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{t("farms.title")}</h2>
          <p className="mt-1 text-sm text-stone-500">{t("farms.subtitle")}</p>
        </div>

        {farms.isPending && <PageSpinner />}
        {farms.isError && <Alert tone="error">{farms.error.message}</Alert>}
        {farms.data?.length === 0 && (
          <div className="mx-auto max-w-lg rounded-xl border border-dashed border-stone-300 bg-surface px-6 py-10 text-center">
            <span className="mx-auto flex size-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Sprout className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-lg font-semibold">{t("farms.emptyTitle")}</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-stone-600">{t("farms.emptyText")}</p>
            <Link to="/farms/new" className={`mt-6 ${ADD_LINK}`}>
              <Plus className="size-4" aria-hidden="true" />
              {t("farms.emptyCta")}
            </Link>
          </div>
        )}
        {list.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((farm) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
            <Link
              to="/farms/new"
              className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 text-sm font-medium text-stone-500 transition-colors hover:border-stone-400 hover:text-stone-800"
            >
              <Plus className="size-5" aria-hidden="true" />
              {t("farms.add")}
            </Link>
          </div>
        )}
      </div>

      <HowItWorks />
    </div>
  );
}
