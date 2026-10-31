import CTAButton from "@/components/CTAButton";
import FinalCTA from "@/components/FinalCTA";

export const metadata = {
  title: "How It Works — Free Business Valuation in 3 Minutes | Mercato",
  description:
    "See exactly how Mercato turns 10 simple questions into a defensible business valuation — range, value drivers, risks, and a plain-English summary.",
};

const STEPS = [
  {
    n: "1",
    title: "Tell us about your business",
    body:
      "Answer 10 straightforward questions about your revenue, profit, industry, and operations. No financials needed. No accountant required. If you know your numbers roughly, that's enough to start.",
  },
  {
    n: "2",
    title: "Get your instant valuation",
    body:
      "Our AI analyzes your inputs against real transaction data from comparable businesses sold in your industry. You get a valuation range, your key value drivers, and your biggest risks — the kind of analysis that would normally cost thousands and take weeks.",
  },
  {
    n: "3",
    title: "Decide your next step",
    body:
      "Whether you're ready to list, want to talk to an advisor, or just want to understand your options — you'll leave informed. Not guessing. And if you're ready, you can turn your valuation into a marketplace listing in one click.",
  },
];

const FAQS = [
  {
    q: "How accurate is this tool?",
    a: "It's not meant to replace a formal appraisal — it's meant to replace the blank stare. It gives you a defensible, data-informed range so you can have smarter conversations with brokers, buyers, and advisors.",
  },
  {
    q: "Does AI make mistakes?",
    a: "Our AI applies consistent valuation logic — revenue multiples, EBITDA margins, industry benchmarks — the same framework a broker uses, just instantly and without a $5,000 retainer upfront. It surfaces the right questions and the right range. A good advisor still validates it. But now you walk into that conversation informed, not blind.",
  },
  {
    q: "Is my information safe?",
    a: "Your valuation is completely private. We never share or sell your data. You choose if and when to list your business.",
  },
  {
    q: "Do I need to be ready to sell?",
    a: "Not at all. Most people who use Mercato are just curious what they've built. Knowing your number is the first step — even if you're 5 years from selling.",
  },
  {
    q: "What if I need a formal valuation for legal or tax purposes?",
    a: "A Chartered Business Valuator (CBV) is still essential for anything requiring a formal, defensible report — tax, estate, legal disputes. Mercato helps you understand the landscape before you get there. Think of it as the step that helps you realize you need one.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-16 text-center md:pt-24">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-navy md:text-5xl">
          From blank slate to informed owner — in 3 minutes.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-navy/70">
          No spreadsheets. No retainer. Just answer a few honest questions and see what
          decades of hard work are actually worth.
        </p>
        <div className="mt-8">
          <CTAButton />
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="space-y-6">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex flex-col gap-5 rounded-2xl border border-cream-deep bg-white p-8 sm:flex-row sm:items-start"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-navy text-xl font-bold text-white">
                {s.n}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-navy">{s.title}</h2>
                <p className="mt-2 leading-relaxed text-navy/70">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sample valuation output */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-navy md:text-4xl">
              Here&apos;s what you actually get.
            </h2>
            <p className="mt-4 text-navy/60">
              A real example — anonymized — for a residential HVAC business with $2.1M in
              revenue and $410K in profit.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-cream-deep shadow-sm">
            {/* Range */}
            <div className="bg-navy px-8 py-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-cream/50">
                Estimated value range
              </p>
              <div className="mt-3 flex items-end justify-center gap-3">
                <span className="text-2xl font-semibold text-cream/60">$640K</span>
                <span className="text-5xl font-bold text-white">$760K</span>
                <span className="text-2xl font-semibold text-cream/60">$890K</span>
              </div>
              <p className="mt-3 text-sm text-cream/60">
                Most likely value · based on a 1.9× EBITDA multiple for comparable trades
                businesses
              </p>
            </div>

            {/* Drivers + risks */}
            <div className="grid gap-px bg-cream-deep sm:grid-cols-2">
              <div className="bg-white p-7">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                  Key value drivers
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-navy/75">
                  <li>• Recurring maintenance contracts with 600+ residential customers</li>
                  <li>• Strong 19.5% net margin, above the industry average</li>
                  <li>• Experienced lead technicians who can run jobs without the owner</li>
                  <li>• 28 years of brand reputation in a growing service area</li>
                </ul>
              </div>
              <div className="bg-white p-7">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-red-600">
                  Key risks
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-navy/75">
                  <li>• Owner still handles most customer relationships personally</li>
                  <li>• No formal documented systems for scheduling and dispatch</li>
                  <li>• Revenue concentrated in summer and winter peak seasons</li>
                  <li>• Aging service fleet may need replacement within 2 years</li>
                </ul>
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-cream-deep bg-cream p-7">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-navy/50">
                Plain-English summary
              </h3>
              <p className="mt-3 leading-relaxed text-navy/75">
                This is a healthy, profitable business with real value — most likely worth
                around $760,000 to the right buyer. Its biggest strength is a loyal base of
                repeat customers and margins that beat the industry. The main thing holding the
                number back is how much still depends on you personally. Document your systems
                and start handing off customer relationships, and you could move toward the top
                of this range before you ever sit down with a buyer.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-navy/50">
            Sample figures for illustration. Your valuation is generated from your own inputs.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-navy md:text-4xl">
          Questions owners ask us.
        </h2>
        <div className="mt-12 space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-2xl border border-cream-deep bg-white p-7">
              <h3 className="text-lg font-semibold text-navy">{f.q}</h3>
              <p className="mt-3 leading-relaxed text-navy/70">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <FinalCTA
        headline="You spent 30 years building it. Spend 3 minutes understanding it."
        subtext="Free. Instant. No broker required."
      />
    </div>
  );
}
