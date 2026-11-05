import type { ComponentProps } from "react";
import { lazy, Suspense } from "react";
import { cx } from "../../components/ui";

const SatelliteView = lazy(() => import("./SatelliteView").then((module) => ({ default: module.SatelliteView })));

/** SatelliteView, loaded on demand (it pulls in Leaflet); a dark placeholder of the same size shows meanwhile. */
export function Satellite(props: ComponentProps<typeof SatelliteView>) {
  return (
    <Suspense fallback={<div className={cx("relative overflow-hidden bg-[#1c211c]", props.className)}>{props.children}</div>}>
      <SatelliteView {...props} />
    </Suspense>
  );
}
