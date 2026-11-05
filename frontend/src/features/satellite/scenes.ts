import { useQuery } from "@tanstack/react-query";

/**
 * Recent, low-cloud NASA HLS (Harmonized Landsat Sentinel-2, 30 m) passes over a point, found with NASA's CMR
 * granule search and drawn from NASA GIBS tiles. Both services are public and allow browser requests.
 */
export type Scene = { layer: string; sensor: string; date: string; cloud: number };

const CMR = "https://cmr.earthdata.nasa.gov/search/granules.json";
const COLLECTIONS = [
  { shortName: "HLSS30", layer: "HLS_S30_Nadir_BRDF_Adjusted_Reflectance", sensor: "Sentinel-2" },
  { shortName: "HLSL30", layer: "HLS_L30_Nadir_BRDF_Adjusted_Reflectance", sensor: "Landsat" },
];
const MAX_CLOUD = 20;
/** Passes stacked newest on top; older ones fill the gaps at swath edges. */
const STACK = 3;

export const GIBS = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best";

export function hlsTileUrl(scene: Scene): string {
  return `${GIBS}/${scene.layer}/default/${scene.date}/GoogleMapsCompatible_Level12/{z}/{y}/{x}.png`;
}

/** Cloud-free monthly composite at 500 m, used under the HLS passes and when none is found. */
export const BLUE_MARBLE_URL = `${GIBS}/BlueMarble_NextGeneration/default/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg`;

async function findScenes(lat: number, lon: number): Promise<Scene[]> {
  const since = new Date(Date.now() - 365 * 86_400_000).toISOString().slice(0, 10);
  const results = await Promise.all(
    COLLECTIONS.map(async ({ shortName, layer, sensor }) => {
      const params = new URLSearchParams({
        short_name: shortName,
        point: `${lon},${lat}`,
        cloud_cover: `0,${MAX_CLOUD}`,
        temporal: `${since}T00:00:00Z,`,
        sort_key: "-start_date",
        page_size: "4",
      });
      const response = await fetch(`${CMR}?${params}`);
      if (!response.ok) throw new Error(`CMR ${response.status}`);
      const body = (await response.json()) as { feed: { entry: { time_start: string; cloud_cover?: string }[] } };
      return body.feed.entry.map((entry) => ({
        layer,
        sensor,
        date: entry.time_start.slice(0, 10),
        cloud: Math.round(Number(entry.cloud_cover ?? 0)),
      }));
    }),
  );
  const seen = new Set<string>();
  return results
    .flat()
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((scene) => {
      const key = `${scene.layer}/${scene.date}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, STACK);
}

export function useScenes(lat: number, lon: number) {
  return useQuery({
    queryKey: ["hls-scenes", lat.toFixed(2), lon.toFixed(2)],
    queryFn: () => findScenes(lat, lon),
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
}
