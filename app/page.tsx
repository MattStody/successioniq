import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import FinalCTA from "@/components/FinalCTA";

export const metadata = {
  title: "What's Your Business Worth? — Free AI Valuation | SuccessionIQ",
  description:
    "Free AI-powered business valuation in 3 minutes. No broker. No fees. No obligation. Built for retiring business owners across Canada and the United States.",
};

const HOW_IT_WORKS = [
  {
    n: "1",
    title: "Tell us about your business",
    body:
      "Answer 10 straightforward questions about your revenue, profit, industry, and operations. No financials needed. No accountant required.",
  },
  {
    n: "2",
    title: "Get your instant valuation",
    body:
      "Our AI analyzes your inputs against real transaction data from comparable businesses sold in your industry. You get a valuation range, your key value drivers, and your biggest risks — the kind of analysis that would normally cost thousands.",
  },
  {
    n: "3",
    title: "Decide your next step",
    body:
      "Whether you're ready to list, want to talk to an advisor, or just want to understand your options — you'll leave informed. Not guessing.",
  },
];

const OUTCOMES = [
  {
    title: "Valuation Range",
    body:
      "A defensible, data-informed range based on real comparable transactions — not a guess.",
  },
  {
    title: "Key Value Drivers",
    body:
      "Understand what makes your business worth more — so you can act on it before you sell.",
  },
  {
    title: "Key Risks",
    body:
      "Know what buyers will push back on before they do. Walk into every conversation prepared.",
  },
  {
    title: "Plain-English Summary",
    body:
      "No jargon. No MBA-speak. Just a clear explanation of where you stand and what it means.",
  },
];

const TRUST = [
  {
    title: "It's not replacing your advisor.",
    body:
      "SuccessionIQ doesn't replace a formal appraisal or a good broker. It replaces the blank stare. Think of it as the first step — the one that gets you informed enough to have a real conversation.",
  },
  {
    title: "Your data stays yours.",
    body:
      "We never sell your information. Your valuation is private until you choose to share it. You're in control of every step.",
  },
  {
    title: "Built on real transaction data.",
    body:
      "Our valuations use real multiples from comparable business sales — the same benchmarks brokers and CBVs use — applied instantly and without a retainer.",
  },
];

export default function Home() {
  return (
    <div className="bg-cream">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 md:pt-24 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-5xl lg:text-6xl">
              You Built Something Real.
              <br />
              <span className="text-accent-dark">Find Out What It&apos;s Worth.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy/70 sm:text-xl">
              Free AI-powered business valuation in 3 minutes. No broker. No fees. No
              obligation.
            </p>
            <div className="mt-8">
              <CTAButton className="!px-8 !py-4 !text-lg">Get My Free Valuation →</CTAButton>
            </div>
            <p className="mt-4 text-sm text-navy/50">
              Join hundreds of Canadian and American business owners who finally know their
              number.
            </p>
          </div>

          <ImagePlaceholder
            alt="60-year-old male HVAC business owner standing proudly in front of his service van fleet, warm morning light, authentic expression, no suit"
            className="aspect-[4/3] w-full shadow-lg"
          />
        </div>

        {/* Social proof bar */}
        <div className="border-y border-cream-deep bg-white/60">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <p className="text-center text-sm font-medium uppercase tracking-wider text-navy/50">
              Trusted by business owners across Canada and the United States
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {["3 minutes to your valuation", "No broker required", "Powered by real transaction data"].map(
                (s) => (
                  <span
                    key={s}
                    className="rounded-full border border-cream-deep bg-cream px-4 py-1.5 text-sm font-medium text-navy"
                  >
                    {s}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-3xl font-bold leading-tight text-navy md:text-4xl">
          Most business owners have no idea what they&apos;ve built.
        </h2>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-navy/70">
          <p>
            You&apos;ve spent decades building something valuable. But when it comes time to
            think about what&apos;s next — retirement, a sale, bringing in a partner — most
            owners hit the same wall: they have no idea what their business is actually worth.
          </p>
          <p>
            Brokers want a retainer before they&apos;ll tell you anything. Formal appraisals
            cost thousands and take weeks. And most owners end up doing nothing — for years.
          </p>
          <p className="font-semibold text-navy">
            73% of Ontario business owners have no succession plan. The average business owner
            waits 3 years too long to start thinking about their exit.
          </p>
          <p>SuccessionIQ was built to fix that.</p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-navy md:text-4xl">
              From blank slate to informed owner — in 3 minutes.
            </h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.n} className="rounded-2xl border border-cream-deep bg-cream p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-xl font-bold text-accent">
                  {step.n}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-navy">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-navy/70">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <CTAButton>Start My Free Valuation →</CTAButton>
          </div>
        </div>
      </section>

      {/* ── What You Get ── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-navy md:text-4xl">More than a number.</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {OUTCOMES.map((o) => (
            <div
              key={o.title}
              className="rounded-2xl border border-cream-deep bg-white p-7 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-navy">{o.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/70">{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust / Objection handling ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-navy md:text-4xl">
              Built for business owners. Not for Bay Street.
            </h2>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {TRUST.map((t) => (
              <div key={t.title}>
                <h3 className="text-lg font-semibold text-navy">{t.title}</h3>
                <p className="mt-3 leading-relaxed text-navy/70">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Succession Wave ── */}
      <section className="bg-navy">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold leading-tight text-cream md:text-4xl">
              12 million business owners. Most with no plan.
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-cream/75">
              <p>
                The largest transfer of business wealth in history is happening right now. Over
                the next 10–15 years, baby boomer owners will try to exit more than 12 million
                businesses worth over $10 trillion in combined value.
              </p>
              <p>
                Most won&apos;t have a plan. Most won&apos;t know what their business is worth.
                And most will leave money on the table — or simply close the doors.
              </p>
              <p>
                SuccessionIQ exists to change that — starting with a simple question: what is
                your business actually worth?
              </p>
            </div>
            <div className="mt-8">
              <CTAButton>Find Out Now — It&apos;s Free →</CTAButton>
            </div>
          </div>
          <ImagePlaceholder
            alt="Multi-generational family business owners — a retiring tradesman handing keys to a younger buyer in a workshop, warm authentic moment"
            className="aspect-[4/3] w-full"
          />
        </div>
      </section>

      {/* ── Final CTA ── */}
      <FinalCTA
        headline="You spent 30 years building it. Spend 3 minutes understanding it."
        subtext="Free. Instant. No broker required."
      />

      {/* Quiet link preserving the existing marketplace entry point */}
      <div className="bg-cream py-8 text-center">
        <Link href="/listings" className="text-sm font-medium text-navy/60 hover:text-navy">
          Looking to buy a business instead? Browse current listings →
        </Link>
      </div>
    </div>
  );
}
