import Link from "next/link";
import ValuationCTA from "@/components/marketing/ValuationCTA";

export const metadata = {
  title: "For Buyers — Find Cash-Flowing Businesses for Sale | FairMark",
  description:
    "Browse vetted Canadian and American businesses with real financial data. Every listing starts with an AI valuation, so the asking price is grounded in reality.",
};

const POINTS = [
  {
    title: "Grounded asking prices",
    body:
      "Every listing on FairMark starts with an AI valuation — so you know the asking price is based on real data, not wishful thinking.",
  },
  {
    title: "Signal, not noise",
    body:
      "Filter by industry, location, revenue, and EBITDA. Real financials up front. No stale listings, no broker fluff.",
  },
  {
    title: "Get ahead of the wave",
    body:
      "The largest pool of motivated sellers in history is entering the market right now. Being early is an advantage you can't buy later.",
  },
];

const FEATURES = [
  { title: "AI-validated listings", soon: false },
  { title: "Direct seller access", soon: false },
  { title: "Industry & financial filters", soon: false },
  { title: "Deal alert notifications", soon: true },
  { title: "Buyer profile matching", soon: true },
];

const wrap = "mx-auto max-w-[1240px] px-5 sm:px-8";

export default function ForBuyersPage() {
  return (
    <div className="bg-white text-[#0E1330]">
      {/* Hero */}
      <section className="bg-[#F4F6FC]">
        <div className={`${wrap} grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24`}>
          <div className="flex flex-col gap-6">
            <span className="text-sm font-bold uppercase tracking-widest text-[#4F6BFF]">
              For buyers
            </span>
            <h1 className="text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[58px]">
              Find cash-flowing businesses before anyone else does.
            </h1>
            <p className="max-w-[30em] text-xl leading-normal text-[#3B4566]">
              Browse vetted Canadian and American businesses with real financial
              data — not broker fluff.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/listings"
                className="inline-flex min-h-13 items-center rounded-xl bg-[#4F6BFF] px-7 py-3.5 text-[17px] font-bold text-white transition-colors hover:bg-[#3f57e6]"
              >
                Browse current listings →
              </Link>
              <Link
                href="/guides/ebitda-sde-multiples-explained"
                className="inline-flex min-h-13 items-center rounded-xl border-2 border-[#0E1330] px-6 py-3 text-[17px] font-bold text-[#0E1330] transition-colors hover:bg-[#0E1330] hover:text-white"
              >
                How valuation works
              </Link>
            </div>
            <p className="text-sm text-[#525C7A]">
              For first-time buyers, ETA searchers, small PE, and serial acquirers.
            </p>
          </div>

          {/* Hero animation — listings revealing (matches appearing) */}
          <div className="rounded-3xl border border-[#DCE3F2] bg-white p-7 shadow-[0_24px_60px_-32px_rgba(14,19,48,0.35)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#525C7A]">
                Businesses for sale
              </p>
              <span className="rounded-full bg-[#F1F3F6] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#8A93A8]">
                Example
              </span>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              {[
                { name: "HVAC & Plumbing Co.", meta: "Ontario · 22 yrs", value: "$780K", tag: "Trades" },
                { name: "Family Dental Clinic", meta: "British Columbia", value: "$1.4M", tag: "Healthcare" },
                { name: "B2B SaaS Platform", meta: "Remote · recurring", value: "$2.1M", tag: "Technology" },
              ].map((l, i) => (
                <div
                  key={l.name}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[#E3E8F3] bg-[#F8FAFF] p-4 motion-safe:animate-[fade-up_0.6s_ease-out_both]"
                  style={{ animationDelay: `${0.15 + i * 0.18}s` }}
                >
                  <div>
                    <div className="text-[15px] font-bold text-[#0E1330]">{l.name}</div>
                    <div className="mt-0.5 text-xs text-[#525C7A]">{l.meta}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[15px] font-extrabold text-[#0E1330]">{l.value}</div>
                    <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#3f57e6]">
                      {l.tag}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/listings"
              className="mt-6 inline-flex items-center text-[16px] font-bold text-[#3f57e6] hover:underline"
            >
              Browse all listings →
            </Link>
          </div>
        </div>
      </section>

      {/* Why FairMark */}
      <section className={`${wrap} py-20 lg:py-24`}>
        <h2 className="max-w-[14em] text-[32px] font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-[42px]">
          Real businesses. Real numbers.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="flex flex-col gap-3 rounded-2xl border border-[#DCE3F2] bg-[#F4F6FC] p-7"
            >
              <h3 className="text-[20px] font-bold tracking-[-0.01em] text-[#0E1330]">
                {p.title}
              </h3>
              <p className="text-[17px] leading-relaxed text-[#2C3656]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#F4F6FC]">
        <div className={`${wrap} py-20 lg:py-24`}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-[42px]">
              Everything you need to move quickly.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex items-center justify-between rounded-2xl border border-[#DCE3F2] bg-white p-6"
              >
                <span className="font-semibold text-[#0E1330]">{f.title}</span>
                {f.soon && (
                  <span className="rounded-full bg-[#E8EEFF] px-2.5 py-1 text-xs font-semibold text-[#3f57e6]">
                    Coming soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ValuationCTA
        headline="The wave is here. Get in early."
        subtext="Browse motivated sellers with valuations you can trust."
        cta="Browse current listings"
        href="/listings"
      />
    </div>
  );
}
