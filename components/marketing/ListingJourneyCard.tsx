/**
 * Hero animation that tells the platform story: you list your business, buyers
 * engage, and it sells. A live listing card whose activity feed reveals in
 * sequence and lands on an accepted offer.
 *
 * Pure CSS staggered reveal via motion-safe: utilities (keyframes in
 * globals.css) — a server component, no dependencies. Reduced-motion visitors
 * see the final, fully-revealed state.
 */

function Icon({ kind }: { kind: "check" | "eye" | "lock" }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (kind === "check") return <svg {...common}><path d="M20 6 9 17l-5-5" /></svg>;
  if (kind === "eye")
    return (
      <svg {...common}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

const ACTIVITY: { kind: "check" | "eye" | "lock"; text: string; delay: number }[] = [
  { kind: "check", text: "Listed on FairMark", delay: 0.3 },
  { kind: "eye", text: "8 buyers viewed this week", delay: 0.6 },
  { kind: "lock", text: "2 buyers signed an NDA", delay: 0.9 },
];

export default function ListingJourneyCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#DCE3F2] bg-white p-7 shadow-[0_24px_60px_-32px_rgba(14,19,48,0.35)]">
      {/* soft brand glow */}
      <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#4F6BFF]/10 blur-2xl" />

      {/* Listing header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[18px] font-bold text-[#0E1330]">Northside HVAC &amp; Plumbing</div>
          <div className="mt-0.5 text-sm text-[#525C7A]">Hamilton, ON · Trades · 22 yrs</div>
        </div>
        <span className="inline-flex flex-none items-center gap-1.5 rounded-full bg-[#E8EEFF] px-2.5 py-1 text-xs font-semibold text-[#3f57e6]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#4F6BFF]/50 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4F6BFF]" />
          </span>
          Live
        </span>
      </div>

      {/* Asking price */}
      <div className="mt-5 flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#525C7A]">
            Asking price
          </div>
          <div className="mt-1 text-[34px] font-extrabold leading-none tracking-[-0.025em] text-[#0E1330]">
            $780K
          </div>
        </div>
        <span className="rounded-full bg-[#F1F3F6] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#8A93A8]">
          Example
        </span>
      </div>

      <div className="my-5 border-t border-[#E3E8F3]" />

      {/* Activity feed */}
      <p className="text-xs font-semibold uppercase tracking-widest text-[#525C7A]">Activity</p>
      <ul className="mt-4 flex flex-col gap-3">
        {ACTIVITY.map((a) => (
          <li
            key={a.text}
            className="flex items-center gap-3 motion-safe:animate-[fade-up_0.5s_ease-out_both]"
            style={{ animationDelay: `${a.delay}s` }}
          >
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[#E8EEFF] text-[#4F6BFF]">
              <Icon kind={a.kind} />
            </span>
            <span className="text-[15px] text-[#2C3656]">{a.text}</span>
          </li>
        ))}
      </ul>

      {/* Offer accepted — the sale */}
      <div
        className="mt-5 flex items-center gap-2.5 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 motion-safe:animate-[fade-up_0.6s_ease-out_both]"
        style={{ animationDelay: "1.25s" }}
      >
        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#059669] text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <span className="text-[15px] font-bold text-[#047857]">
          Offer accepted — $760K · sale in progress
        </span>
      </div>
    </div>
  );
}
