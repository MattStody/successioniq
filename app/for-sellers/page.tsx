import CTAButton from "@/components/CTAButton";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import FinalCTA from "@/components/FinalCTA";

export const metadata = {
  title: "For Sellers — Find Out What Your Business Is Worth | SuccessionIQ",
  description:
    "Your business is probably worth more than you think. Start with a free AI valuation, then turn it into a listing in one click when you're ready.",
};

const ACTS = [
  {
    label: "Act 1 — The Realization",
    body:
      "You've been thinking about it. Maybe retirement is 3 years away. Maybe it's sooner than you planned. The question you keep coming back to is: what would I actually get for this thing?",
  },
  {
    label: "Act 2 — The Problem",
    body:
      "Most owners call a broker and get a pitch, not an answer. Or they pay thousands for a formal appraisal they didn't really need yet. Or they do nothing — and the years slip by.",
  },
  {
    label: "Act 3 — The SuccessionIQ Way",
    body:
      "Start with the free valuation. Understand your range, your value drivers, your risks. Then, if you're ready, turn it into a listing in one click. We'll write the description for you.",
  },
  {
    label: "Act 4 — What Happens Next",
    body:
      "Qualified buyers browse your listing. When there's interest, we connect you — no pressure, no obligation. You stay in control of the conversation.",
  },
];

const GOOD_LISTING = [
  "Clear, honest financials — revenue, profit, and the story behind the numbers.",
  "What's included in the sale: equipment, contracts, staff, and customer relationships.",
  "A real reason for selling — retirement and next chapters build trust, not red flags.",
  "Evidence the business can run without you: documented systems and a capable team.",
  "A fair asking price grounded in your valuation — not wishful thinking.",
];

export default function ForSellersPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-16 md:pt-24 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-5xl">
            Your business is probably worth more than you think.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy/70 sm:text-xl">
            Find out what it&apos;s worth. Then decide what&apos;s next.
          </p>
          <div className="mt-8">
            <CTAButton>Start With Your Free Valuation →</CTAButton>
          </div>
        </div>
        <ImagePlaceholder
          alt="Proud 60s woman owner of a family dental clinic standing at her front desk with her small team, warm and approachable, no suit"
          className="aspect-[4/3] w-full shadow-lg"
        />
      </section>

      {/* Four acts */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold text-navy md:text-4xl">
            You&apos;re not the first owner to feel this way.
          </h2>
          <div className="mt-12 space-y-5">
            {ACTS.map((act) => (
              <div
                key={act.label}
                className="rounded-2xl border border-cream-deep bg-cream p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-accent-dark">
                  {act.label}
                </p>
                <p className="mt-3 text-lg leading-relaxed text-navy/80">{act.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What makes a good listing */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-3xl font-bold text-navy md:text-4xl">
          What makes a good listing.
        </h2>
        <p className="mt-4 text-lg text-navy/70">
          Buyers are looking for confidence. Here&apos;s what gives it to them:
        </p>
        <ul className="mt-8 space-y-4">
          {GOOD_LISTING.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent-dark">
                ✓
              </span>
              <span className="leading-relaxed text-navy/80">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <FinalCTA
        headline="Start with your number. The rest follows."
        subtext="Free. Instant. No broker required."
      />
    </div>
  );
}
