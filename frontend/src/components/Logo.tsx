/** Compass rose whose needle is a leaf: the crop points the way. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <rect width="32" height="32" rx="7" fill={light ? "#ffffff" : "var(--color-brand)"} />
        <circle cx="16" cy="16" r="10.5" fill="none" stroke={light ? "#2f6438" : "#ffffff"} strokeOpacity="0.55" strokeWidth="1.2" />
        <path d="M16 4.5v3M16 24.5v3M4.5 16h3M24.5 16h3" stroke={light ? "#2f6438" : "#ffffff"} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M21.5 10.5 C21 16 18 19.5 12 21.2 C11.8 16 15 11.6 21.5 10.5Z" fill="#d9b768" />
        <path d="M21.5 10.5 L12 21.2" stroke={light ? "#2f6438" : "#1a3620"} strokeWidth="1.1" strokeLinecap="round" />
      </svg>
      <span className={light ? "text-lg font-semibold tracking-tight text-white" : "text-lg font-semibold tracking-tight text-stone-900"}>
        CropCompass
      </span>
    </span>
  );
}
