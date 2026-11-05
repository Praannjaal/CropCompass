import { PlayCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "./Dialog";
import { cx } from "./ui";

/** "Watch the tour" link that opens the narrated product video in a dialog. The video loads only when opened. */
export function TourButton({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cx("inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800", className)}
      >
        <PlayCircle className="size-4" aria-hidden="true" />
        {t("tour.watch")}
      </button>
      {open && (
        <Dialog open wide title={t("tour.title")} closeLabel={t("tour.close")} onClose={() => setOpen(false)}>
          <video
            className="aspect-video w-full rounded-lg bg-black"
            src="/tour.mp4"
            poster="/tour-poster.jpg"
            controls
            autoPlay
            playsInline
            preload="metadata"
          />
          <p className="mt-3 text-xs text-stone-500">{t("tour.note")}</p>
        </Dialog>
      )}
    </>
  );
}
