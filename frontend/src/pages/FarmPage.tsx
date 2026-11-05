import {
  ArrowLeft,
  CloudSun,
  Droplets,
  Grid3x3,
  Layers,
  MapPin,
  NotebookPen,
  RefreshCw,
  Route,
  Ruler,
  Satellite,
  Sprout,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { lazy, Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useDeleteFarm, useFarm, useRefreshFarm, useSources } from "../api/hooks";
import type { SourceStatus } from "../api/types";
import { fullDate } from "../lib/format";
import { Alert, Button, Card, cx, PageSpinner, Spinner } from "../components/ui";
import { SoilPanel } from "../features/soil/SoilPanel";
import { WeatherConfidence } from "../features/plan/WeatherConfidence";
import { StatusBadge } from "./FarmsPage";
import { AskSprout } from "../features/sprout/Sprout";
import { Satellite as SatelliteImage } from "../features/satellite/Satellite";

const ClimatePanel = lazy(() =>
  import("../features/climate/ClimatePanel").then((module) => ({ default: module.ClimatePanel })),
);
const HistoryPanel = lazy(() =>
  import("../features/history/HistoryPanel").then((module) => ({ default: module.HistoryPanel })),
);
const CropFitPanel = lazy(() =>
  import("../features/crops/CropFitPanel").then((module) => ({ default: module.CropFitPanel })),
);
const PlanPanel = lazy(() => import("../features/plan/PlanPanel").then((module) => ({ default: module.PlanPanel })));
const NextCropSummary = lazy(() =>
  import("../features/plan/NextCropSummary").then((module) => ({ default: module.NextCropSummary })),
);
const SavedPlans = lazy(() => import("../features/plan/SavedPlans").then((module) => ({ default: module.SavedPlans })));
const FieldMap = lazy(() => import("../features/map/FieldMap").then((module) => ({ default: module.FieldMap })));

type Tab = "climate" | "history" | "crops" | "plan" | "soil";
const TABS: Tab[] = ["climate", "history", "crops", "plan", "soil"];
const PACK_TABS: Tab[] = ["crops", "plan"];
const TAB_ICONS: Record<Tab, LucideIcon> = { climate: CloudSun, history: NotebookPen, crops: Sprout, plan: Route, soil: Layers };

const SOURCES = [
  { key: "weather", Icon: CloudSun, tint: "bg-stone-100 text-stone-600" },
  { key: "soil", Icon: Layers, tint: "bg-stone-100 text-stone-600" },
  { key: "satellite", Icon: Satellite, tint: "bg-stone-100 text-stone-600" },
] as const;

function statusColor(status: SourceStatus): { dot: string; bar: string } {
  if (["verified", "ready", "farmer", "default"].includes(status)) return { dot: "bg-emerald-500", bar: "bg-emerald-500" };
  if (["needs_attention", "error", "unverified"].includes(status)) return { dot: "bg-red-500", bar: "bg-red-400" };
  return { dot: "bg-amber-400 animate-pulse", bar: "bg-amber-400" };
}

function Progress({ done, total, color }: { done: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  return (
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100" role="presentation">
      <div className={cx("h-full rounded-full transition-[width] duration-700", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Building() {
  const { t } = useTranslation();
  const icons = [CloudSun, Layers, Sprout];
  return (
    <Card className="flex flex-col gap-5 sm:flex-row sm:items-start">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
        <Satellite className="size-5" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">{t("farm.buildingTitle")}</h2>
        <p className="mt-1 max-w-xl text-sm text-stone-600">{t("farm.buildingText")}</p>
        <ol className="mt-4 space-y-2 text-sm text-stone-700">
          {(["step1", "step2", "step3"] as const).map((step, index) => {
            const Icon = icons[index];
            return (
              <li key={step} className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-md bg-stone-100 text-stone-600">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {t(`farm.${step}`)}
                {index === 0 && <Spinner className="size-4 text-emerald-600" />}
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}

export function FarmPage() {
  const { t } = useTranslation();
  const { farmId = "" } = useParams();
  const navigate = useNavigate();
  const farm = useFarm(farmId);
  const refresh = useRefreshFarm(farmId);
  const remove = useDeleteFarm();
  const [params, setParams] = useSearchParams();
  const setTab = (value: Tab) => setParams((current) => { current.set("tab", value); return current; });
  const sources = useSources(farmId);
  const verified = sources.data?.weather.status === "verified";
  const adviceAvailable = sources.data?.advice.available === true;
  const limited = sources.data?.advice.weather_context?.confidence === "low";
  const tab = TABS.includes(params.get("tab") as Tab) ? params.get("tab") as Tab : limited ? "plan" : "climate";

  const boundary = farm.data?.boundary;
  const corners = useMemo(
    () => boundary?.coordinates[0].slice(0, -1).map(([lon, lat]) => [lat, lon] as [number, number]) ?? null,
    [boundary],
  );

  if (farm.isPending) return <PageSpinner />;
  if (farm.isError) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Alert tone="error">{farm.error.message}</Alert>
        <Link to="/" className="text-sm font-medium text-emerald-700">
          ← {t("common.back")}
        </Link>
      </div>
    );
  }

  const data = farm.data;
  const building = data.data_status === "pending" && !adviceAvailable;
  const confirmDelete = () => {
    if (window.confirm(t("farm.confirmDelete"))) {
      remove.mutate(data.id, { onSuccess: () => navigate("/", { replace: true }) });
    }
  };

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("common.back")}
      </Link>
      <SatelliteImage
        lat={data.lat}
        lon={data.lon}
        zoom={13.5}
        corners={corners}
        scan={building ? "loop" : "once"}
        grid={building}
        label={t("satellite.label", { name: data.name })}
        className="mt-3 h-60 rounded-xl border border-stone-200 sm:h-72"
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10" aria-hidden="true" />
        {building && (
          <p className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 rounded-md bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <span className="size-2 animate-pulse rounded-full bg-amber-400" aria-hidden="true" />
            {t("satellite.acquiring")}
          </p>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5 pb-10 text-white sm:p-6 sm:pb-11">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="break-words text-3xl font-semibold tracking-tight">{data.name}</h1>
            <StatusBadge status={limited ? "limited" : verified ? data.data_status : sources.data?.weather.status === "needs_attention" || sources.data?.weather.status === "unverified" ? "error" : "pending"} />
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-white/80">
            <li className="inline-flex items-center gap-1.5 tabular">
              <MapPin className="size-3.5" aria-hidden="true" />
              {data.lat.toFixed(3)}°, {data.lon.toFixed(3)}°
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Grid3x3 className="size-3.5" aria-hidden="true" />
              {t("farm.cell", { cell: data.cell_id })}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Droplets className="size-3.5" aria-hidden="true" />
              {t(`farms.irrigation.${data.irrigation}`)}
            </li>
            {data.area_ha != null && (
              <li className="inline-flex items-center gap-1.5 tabular">
                <Ruler className="size-3.5" aria-hidden="true" />
                {t("farms.hectares", { value: data.area_ha })}
              </li>
            )}
          </ul>
        </div>
      </SatelliteImage>
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <AskSprout farmId={data.id} text={t("sprout.farmQuestion")} intent="farm" />
        <Button variant="secondary" size="sm" busy={refresh.isPending} onClick={() => refresh.mutate()}>
          {!refresh.isPending && <RefreshCw className="size-4" aria-hidden="true" />}
          {t("farm.refresh")}
        </Button>
        <Button variant="danger" size="sm" busy={remove.isPending} onClick={confirmDelete}>
          {!remove.isPending && <Trash2 className="size-4" aria-hidden="true" />}
          {t("farm.delete")}
        </Button>
      </div>

      {refresh.error && (
        <div className="mt-4">
          <Alert tone="error">{refresh.error.message}</Alert>
        </div>
      )}

      <div className="mt-6">
        {sources.data && (
          <section className="mb-5" aria-live="polite">
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-stone-500 uppercase">{t("farm.dataTitle")}</h2>
            <dl className="grid min-w-0 gap-3 text-sm sm:grid-cols-3">
              {SOURCES.map(({ key: source, Icon, tint }) => {
                const value = sources.data[source];
                const color = statusColor(value.status);
                return (
                  <div key={source} className="min-w-0 break-words rounded-xl border border-stone-200 bg-surface p-4">
                    <div className="flex items-start gap-3">
                      <span className={cx("flex size-9 shrink-0 items-center justify-center rounded-lg", tint)}>
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <dt className="font-semibold">{t(`quality.${source}`)}</dt>
                        <dd className="text-xs text-stone-500">{t(`quality.${source}Source`)}</dd>
                      </div>
                    </div>
                    <dd className="mt-3 flex items-center gap-2 font-semibold">
                      <span className={cx("size-2.5 rounded-full", color.dot)} aria-hidden="true" />
                      {t(`quality.${value.status}`)}
                    </dd>
                    {source === "weather" && (
                      <dd>
                        <Progress done={sources.data.weather.years_done} total={sources.data.weather.years_total} color={color.bar} />
                        <span className="mt-1 block text-xs text-stone-600">
                          {t("quality.progress", { done: sources.data.weather.years_done, total: sources.data.weather.years_total })}
                        </span>
                      </dd>
                    )}
                    {source === "satellite" && (
                      <dd>
                        <Progress done={sources.data.satellite.done} total={sources.data.satellite.total} color={color.bar} />
                        <span className="mt-1 block text-xs text-stone-600">
                          {t("quality.composites", { done: sources.data.satellite.done, total: sources.data.satellite.total })}
                        </span>
                      </dd>
                    )}
                    {"through" in value && value.through && (
                      <dd className="mt-1 text-xs text-stone-500">{t("quality.through", { date: fullDate(value.through) })}</dd>
                    )}
                    {value.updated_at && (
                      <dd className="text-xs text-stone-500">{t("quality.checked", { date: fullDate(value.updated_at.slice(0, 10)) })}</dd>
                    )}
                  </div>
                );
              })}
            </dl>
          </section>
        )}
        {sources.error && <Alert tone="error">{sources.error.message}</Alert>}
        <WeatherConfidence context={sources.data?.advice.weather_context} />
        {sources.data?.weather.error && <p className="mb-4 break-words text-sm text-amber-800">{sources.data.weather.error}</p>}
        {data.data_status === "pending" && !adviceAvailable && <Building />}
        {data.data_status === "error" && !adviceAvailable && (
          <Alert tone="error">
            <p className="font-medium">{t("farm.errorTitle")}</p>
            <p className="mt-1">{data.data_error}</p>
          </Alert>
        )}
        {(
          <>
            {data.data_error && !adviceAvailable && (
              <div className="mb-4">
                <Alert tone="warning">{data.data_error}</Alert>
              </div>
            )}
            <div
              role="tablist"
              aria-label={data.name}
              className="z-20 mt-6 flex max-w-full gap-1 overflow-x-auto border-b border-stone-200 bg-stone-50/90 backdrop-blur lg:sticky lg:top-14"
            >
              {TABS.filter((key) => !PACK_TABS.includes(key) || data.region === "IN").map((key) => {
                const Icon = TAB_ICONS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={tab === key}
                    onClick={() => setTab(key)}
                    className={cx(
                      "-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                      tab === key
                        ? "border-emerald-600 text-stone-900"
                        : "border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-800",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {t(`farm.tabs.${key}`)}
                  </button>
                );
              })}
            </div>
            <div key={tab} className="animate-fade mt-6" role="tabpanel">
              <Suspense fallback={<PageSpinner />}>
                {!verified && ["climate", "crops"].includes(tab) && <Alert tone="warning">{t("quality.paused")}</Alert>}
                {!adviceAvailable && tab === "plan" && <><Alert tone="warning">{t("quality.advicePending")}</Alert><div className="mt-4"><SavedPlans farm={data} /></div></>}
                {verified && tab === "climate" && (
                  <div className="space-y-10">
                    {data.region === "IN" && <NextCropSummary farm={data} onOpenPlan={() => setTab("plan")} />}
                    <ClimatePanel farmId={data.id} onOpenHistory={() => setTab("history")} />
                  </div>
                )}
                {tab === "history" && <HistoryPanel farm={data} />}
                {verified && tab === "crops" && <CropFitPanel farm={data} onOpenHistory={() => setTab("history")} />}
                {adviceAvailable && tab === "plan" && <PlanPanel farm={data} onOpenHistory={() => setTab("history")} />}
                {tab === "soil" && <>
                  {data.boundary && <div className="mb-6"><FieldMap readOnly mode="boundary" pin={{ lat: data.lat, lon: data.lon }} corners={data.boundary.coordinates[0].slice(0, -1).map(([lon, lat]) => [lat, lon])} flyTo={null} onPin={() => {}} onCorners={() => {}} onSearch={() => {}} /></div>}
                  <SoilPanel farmId={data.id} />
                </>}
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
