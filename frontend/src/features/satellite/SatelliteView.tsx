import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Satellite } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { cx } from "../../components/ui";
import { fullDate } from "../../lib/format";
import type { LatLon } from "../../lib/geo";
import { BLUE_MARBLE_URL, hlsTileUrl, useScenes } from "./scenes";

type Props = {
  lat: number;
  lon: number;
  zoom?: number;
  /** Field corners as [lat, lon]; drawn as an outline. */
  corners?: LatLon[] | null;
  pin?: boolean;
  /** "loop": continuous scan (data being prepared); "once": a single sweep on load. */
  scan?: "none" | "once" | "loop";
  grid?: boolean;
  caption?: boolean;
  label: string;
  className?: string;
  children?: ReactNode;
};

/**
 * A static (non-interactive) satellite view of a location: the most recent clear NASA HLS passes stacked over a
 * Blue Marble base, with the field's pin or outline. Children render on top (titles, gradients).
 */
export function SatelliteView({
  lat,
  lon,
  zoom = 13,
  corners,
  pin = true,
  scan = "none",
  grid = false,
  caption = true,
  label,
  className,
  children,
}: Props) {
  const { t } = useTranslation();
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const imagery = useRef<L.LayerGroup | null>(null);
  const marks = useRef<L.LayerGroup | null>(null);
  const scenes = useScenes(lat, lon);

  useEffect(() => {
    if (!box.current) return;
    const instance = L.map(box.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
      zoomSnap: 0.25,
    });
    L.tileLayer(BLUE_MARBLE_URL, { maxNativeZoom: 8, maxZoom: 18 }).addTo(instance);
    imagery.current = L.layerGroup().addTo(instance);
    marks.current = L.layerGroup().addTo(instance);
    map.current = instance;
    const observer = new ResizeObserver(() => instance.invalidateSize());
    observer.observe(box.current);
    return () => {
      observer.disconnect();
      instance.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    map.current?.setView([lat, lon], zoom, { animate: false });
  }, [lat, lon, zoom]);

  useEffect(() => {
    const group = imagery.current;
    if (!group) return;
    group.clearLayers();
    // Oldest first, so the newest pass is drawn on top and older passes fill its gaps.
    [...(scenes.data ?? [])].reverse().forEach((scene) => {
      L.tileLayer(hlsTileUrl(scene), { maxNativeZoom: 12, maxZoom: 18 }).addTo(group);
    });
  }, [scenes.data]);

  useEffect(() => {
    const group = marks.current;
    if (!group) return;
    group.clearLayers();
    if (corners && corners.length >= 3) {
      L.polygon(corners, { color: "#ffffff", weight: 2, dashArray: "5 4", fillColor: "#ffffff", fillOpacity: 0.08 }).addTo(group);
    }
    if (pin) {
      L.marker([lat, lon], {
        interactive: false,
        keyboard: false,
        icon: L.divIcon({
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          html: '<span class="sat-pin block size-3.5 rounded-full border-2 border-white bg-[#f2c14e] shadow"></span>',
        }),
      }).addTo(group);
    }
  }, [corners, pin, lat, lon]);

  const latest = scenes.data?.[0];
  return (
    <div role="img" aria-label={label} className={cx("sat-view relative isolate overflow-hidden bg-[#1c211c]", className)}>
      <div ref={box} className="absolute inset-0 -z-10" />
      {grid && <div aria-hidden="true" className="sat-grid pointer-events-none absolute inset-0" />}
      {scan !== "none" && (
        <div aria-hidden="true" className={cx("sat-scan pointer-events-none absolute inset-0 overflow-hidden", scan === "once" && "sat-scan-once")} />
      )}
      {children}
      {caption && (
        <p className="absolute right-2 bottom-2 z-10 inline-flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
          <Satellite className="size-3 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {scenes.isPending
              ? t("satellite.searching")
              : latest
                ? `${t("satellite.caption", { sensor: latest.sensor, date: fullDate(latest.date), cloud: latest.cloud })} · ${t("satellite.source")}`
                : t("satellite.fallback")}
          </span>
        </p>
      )}
    </div>
  );
}
