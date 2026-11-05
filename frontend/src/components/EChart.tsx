import { BarChart, LineChart, ScatterChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import type { EChartsCoreOption } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "../lib/theme";

echarts.use([
  BarChart,
  LineChart,
  ScatterChart,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
  CanvasRenderer,
]);

export const AXIS_STYLE = { axisLine: { lineStyle: { color: "#a19a89" } }, axisLabel: { color: "#5c574c" } };
export const SPLIT_LINE = { splitLine: { lineStyle: { color: "#e1ddd2" } } };

/** Chart colours are written for the light theme; in dark mode each is swapped for its dark counterpart. */
const DARK_COLORS: Record<string, string> = {
  "#48443b": "#c2c8c1",
  "#5c574c": "#a6ada5",
  "#736d60": "#8b938a",
  "#a19a89": "#59615a",
  "#e1ddd2": "#2a302a",
  "#2f6438": "#7cb285",
  "#3f7a48": "#5f9a69",
  "#456f8c": "#6a8ca3",
  "#5f8aa6": "#8aa8bc",
  "#b0832e": "#b8944e",
  "#c99d45": "#cfad68",
};

function toDark(value: unknown): unknown {
  if (typeof value === "string") return DARK_COLORS[value.toLowerCase()] ?? value;
  if (Array.isArray(value)) return value.map(toDark);
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, toDark(inner)]));
  }
  return value;
}

function themed(option: EChartsCoreOption, dark: boolean): EChartsCoreOption {
  if (!dark) return option;
  const mapped = toDark(option) as Record<string, unknown>;
  const tooltip = mapped.tooltip && !Array.isArray(mapped.tooltip) ? (mapped.tooltip as Record<string, unknown>) : undefined;
  return {
    ...mapped,
    textStyle: { color: "#c2c8c1", ...(mapped.textStyle as object) },
    ...(tooltip && {
      tooltip: {
        backgroundColor: "#1b201b",
        borderColor: "#2a302a",
        ...tooltip,
        textStyle: { color: "#ebeeea", ...(tooltip.textStyle as object) },
      },
    }),
  };
}

type Props = { option: EChartsCoreOption; label: string; height?: number };

export function EChart({ option, label, height = 300 }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const chart = useRef<ReturnType<typeof echarts.init> | null>(null);

  useEffect(() => {
    if (!container.current) return;
    const instance = echarts.init(container.current, undefined, { renderer: "canvas" });
    chart.current = instance;
    const observer = new ResizeObserver(() => instance.resize());
    observer.observe(container.current);
    return () => {
      observer.disconnect();
      instance.dispose();
      chart.current = null;
    };
  }, []);

  const dark = useTheme() === "dark";
  const shown = useMemo(() => themed(option, dark), [option, dark]);

  useEffect(() => {
    chart.current?.setOption(shown, true);
  }, [shown]);

  return <div ref={container} role="img" aria-label={label} style={{ height }} className="w-full" />;
}
