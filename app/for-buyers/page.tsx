import CTAButton from "@/components/CTAButton";
import ImagePlaceholder from "@/components/ImagePlaceholder";

export const metadata = {
  title: "For Buyers — Find Cash-Flowing Businesses for Sale | Mercato",
  description:
    "Browse vetted Canadian and American businesses with real financial data. Every listing starts with an AI valuation, so the asking price is grounded in reality.",
};

const POINTS = [
  "Every listing on Mercato starts with an AI valuation — so you know the asking price is grounded in real data, not wishful thinking.",
  "Filter by industry, location, revenue, and EBITDA. No noise. No stale listings.",
  "The largest pool of motivated sellers in history is entering the market right now. Get ahead of it.",
];

const FEATURES = [
  { title: "AI-validated listings", soon: false },
  { title: "Direct seller access", soon: false },
  { title: "Industry and financial filters", soon: false },
  { title: "Deal alert notifications", soon: true },
  { title: "Buyer profile matching", soon: true },
];

export default function ForBuyersPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-16 md:pt-24 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-5xl">
            Find cash-flowing businesses before anyone else does.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy/70 sm:text-xl">
            Browse vetted Canadian and American businesses with real financial data — not
            broker fluff.
          </p>
          <div className="mt-8">
            <CTAButton href="/listings">Browse Current Listings →</CTAButton>
          </div>
          <p className="mt-4 text-sm text-navy/50">
            For first-time buyers, ETA searchers, small PE, and serial acquirers.
          </p>
        </div>
        <ImagePlaceholder
          alt="Younger first-time business buyer touring a manufacturing shop floor with the retiring owner, hard hats, authentic and candid"
          className="aspect-[4/3] w-full shadow-lg"
        />
      </section>

      {/* Why Mercato */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-3xl font-bold text-navy md:text-4xl">
            Real businesses. Real numbers.
          </h2>
          <div className="mt-8 space-y-6">
            {POINTS.map((p) => (
              <div key={p} className="flex items-start gap-4">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                <p className="text-lg leading-relaxed text-navy/80">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-navy md:text-4xl">
            Everything you need to move quickly.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex items-center justify-between rounded-2xl border border-cream-deep bg-white p-6 shadow-sm"
            >
              <span className="font-semibold text-navy">{f.title}</span>
              {f.soon && (
                <span className="rounded-full bg-cream-deep px-2.5 py-1 text-xs font-medium text-navy/60">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-navy">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold leading-tight text-cream md:text-4xl">
            The wave is here. Get in early.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cream/70">
            Browse motivated sellers with valuations you can trust.
          </p>
          <div className="mt-8">
            <CTAButton href="/listings" variant="onDark">
              Browse Current Listings →
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
