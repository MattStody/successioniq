/**
 * Warm placeholder block standing in for to-be-sourced authentic photography.
 * The `alt` text is the sourcing brief and is exposed to assistive tech.
 */
export default function ImagePlaceholder({
  alt,
  className = "",
}: {
  alt: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#f3e9d6] to-[#e3d2b4] ${className}`}
    >
      <div className="relative px-6 py-8 text-center">
        <svg
          className="mx-auto mb-3 h-8 w-8 text-navy/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z"
          />
        </svg>
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-navy/40">
          Image to source
        </div>
        <p className="mx-auto max-w-xs text-sm leading-snug text-navy/60">{alt}</p>
      </div>
    </div>
  );
}
