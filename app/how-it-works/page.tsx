import Link from "next/link";
import ValuationCTA from "@/components/marketing/ValuationCTA";

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

const wrap = "mx-auto max-w-[1240px] px-5 sm:px-8";

export default function HowItWorksPage() {
  return (
    <div className="bg-white text-[#0E1330]">
      {/* Hero */}
      <section className="border-b border-[#E3E8F3] bg-[#F4F6FC]">
        <div className="mx-auto max-w-[820px] px-5 py-16 text-center sm:px-8 lg:py-24">
          <span className="text-sm font-bold uppercase tracking-widest text-[#4F6BFF]">
            How it works
          </span>
          <h1 className="mt-4 text-[38px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[54px]">
            From blank slate to informed owner — in 3 minutes.
          </h1>
          <p className="mx-auto mt-5 max-w-[34em] text-xl leading-normal text-[#3B4566]">
            No spreadsheets. No retainer. Just answer a few honest questions and
            see what decades of hard work are actually worth.
          </p>
          <Link
            href="/valuate"
            className="mt-8 inline-flex min-h-13 items-center rounded-xl bg-[#4F6BFF] px-7 py-3.5 text-[17px] font-bold text-white transition-colors hover:bg-[#3f57e6]"
          >
            Get my free valuation →
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className={`${wrap} py-20 lg:py-24`}>
        <div className="grid gap-6 lg:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex flex-col gap-4 rounded-2xl border border-[#DCE3F2] bg-[#F4F6FC] p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0E1330] text-xl font-bold text-white">
                {s.n}
              </div>
              <h2 className="text-[21px] font-bold tracking-[-0.01em] text-[#0E1330]">
                {s.title}
              </h2>
              <p className="text-[17px] leading-relaxed text-[#2C3656]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample valuation output */}
      <section className="bg-[#F4F6FC]">
        <div className={`${wrap} py-20 lg:py-24`}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[32px] font-extrabold tracking-[-0.025em] text-[#0E1330] sm:text-[42px]">
              Here&apos;s what you actually get.
            </h2>
            <p className="mt-4 text-[#3B4566]">
              A real example — anonymized — for a residential HVAC business with
              $2.1M in revenue and $410K in profit.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-[820px] overflow-hidden rounded-3xl border border-[#DCE3F2] bg-white shadow-[0_28px_70px_-36px_rgba(14,19,48,0.4)]">
            {/* Range */}
            <div className="bg-[#0E1330] px-8 py-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#8FA3E6]">
                Estimated value range
              </p>
              <div className="mt-3 flex items-end justify-center gap-3">
                <span className="text-2xl font-semibold text-[#C3CCE6]">$640K</span>
                <span className="text-5xl font-extrabold text-white">$760K</span>
                <span className="text-2xl font-semibold text-[#C3CCE6]">$890K</span>
              </div>
              <p className="mt-3 text-sm text-[#C3CCE6]">
                Most likely value · based on a 1.9× EBITDA multiple for comparable
                trades businesses
              </p>
            </div>

            {/* Drivers + risks */}
            <div className="grid gap-px bg-[#DCE3F2] sm:grid-cols-2">
              <div className="bg-white p-7">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                  Key value drivers
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-[#2C3656]">
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
                <ul className="mt-4 space-y-3 text-sm text-[#2C3656]">
                  <li>• Owner still handles most customer relationships personally</li>
                  <li>• No formal documented systems for scheduling and dispatch</li>
                  <li>• Revenue concentrated in summer and winter peak seasons</li>
                  <li>• Aging service fleet may need replacement within 2 years</li>
                </ul>
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-[#DCE3F2] bg-[#F4F6FC] p-7">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#525C7A]">
                Plain-English summary
              </h3>
              <p className="mt-3 leading-relaxed text-[#2C3656]">
                This is a healthy, profitable business with real value — most likely
                worth around $760,000 to the right buyer. Its biggest strength is a
                loyal base of repeat customers and margins that beat the industry.
                The main thing holding the number back is how much still depends on
                you personally. Document your systems and start handing off customer
                relationships, and you could move toward the top of this range
                before you ever sit down with a buyer.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-[#525C7A]">
            Sample figures for illustration. Your valuation is generated from your
            own inputs.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${wrap} py-20 lg:py-24`}>
        <div className="mx-auto max-w-[760px]">
          <h2 className="text-center text-[32px] font-extrabold tracking-[-0.025em] text-[#0E1330] sm:text-[42px]">
            Questions owners ask us.
          </h2>
          <div className="mt-12 space-y-4">
            {FAQS.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-[#DCE3F2] bg-white p-7"
              >
                <h3 className="text-[18px] font-bold text-[#0E1330]">{f.q}</h3>
                <p className="mt-3 leading-relaxed text-[#2C3656]">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-[15px] text-[#525C7A]">
            Want to go deeper? Read the{" "}
            <Link href="/guides" className="font-semibold text-[#3f57e6] hover:underline">
              Mercato guides
            </Link>
            .
          </p>
        </div>
      </section>

      <ValuationCTA
        headline="You spent 30 years building it. Spend 3 minutes understanding it."
        subtext="Free, instant, and private. See your estimated range right away."
      />
    </div>
  );
}
