import Link from "next/link";
import ValuationCTA from "@/components/marketing/ValuationCTA";
import ValueRevealCard from "@/components/marketing/ValueRevealCard";
import { GUIDES } from "@/lib/guides";

export const metadata = {
  title: "For Sellers — Find Out What Your Business Is Worth | FairMark",
  description:
    "Your business is probably worth more than you think. Start with a free AI valuation, then turn it into a listing in one click when you're ready.",
};

const ACTS = [
  {
    label: "The realization",
    body:
      "You've been thinking about it. Maybe retirement is three years away. Maybe it's sooner than you planned. The question you keep coming back to is: what would I actually get for this thing?",
  },
  {
    label: "The problem",
    body:
      "Most owners call a broker and get a pitch, not an answer. Or they pay thousands for a formal appraisal they didn't really need yet. Or they do nothing — and the years slip by.",
  },
  {
    label: "The FairMark way",
    body:
      "Start with the free valuation. Understand your range, your value drivers, your risks. Then, if you're ready, turn it into a listing in one click. We'll write the description for you.",
  },
  {
    label: "What happens next",
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

const wrap = "mx-auto max-w-[1240px] px-5 sm:px-8";

export default function ForSellersPage() {
  const sellerGuides = GUIDES.filter((g) => g.audience !== "buyer").slice(0, 3);

  return (
    <div className="bg-white text-[#0E1330]">
      {/* Hero */}
      <section className="bg-[#F4F6FC]">
        <div className={`${wrap} grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24`}>
          <div className="flex flex-col gap-6">
            <span className="text-sm font-bold uppercase tracking-widest text-[#4F6BFF]">
              For owners
            </span>
            <h1 className="text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[58px]">
              Your business is probably worth more than you think.
            </h1>
            <p className="max-w-[30em] text-xl leading-normal text-[#3B4566]">
              Find out what it&apos;s worth. Then decide what&apos;s next — on your
              terms, at your pace.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/valuate"
                className="inline-flex min-h-13 items-center rounded-xl bg-[#4F6BFF] px-7 py-3.5 text-[17px] font-bold text-white transition-colors hover:bg-[#3f57e6]"
              >
                Start with your free valuation →
              </Link>
              <Link
                href="/guides"
                className="inline-flex min-h-13 items-center rounded-xl border-2 border-[#0E1330] px-6 py-3 text-[17px] font-bold text-[#0E1330] transition-colors hover:bg-[#0E1330] hover:text-white"
              >
                Read the guides
              </Link>
            </div>
            {/* quick reassurance strip */}
            <ul className="mt-1 flex flex-col gap-2.5">
              {[
                "An estimated value range for your business",
                "Your key value drivers and biggest risks",
                "A one-click path to list when you're ready",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-[15px] text-[#3B4566]"
                >
                  <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-[#E8EEFF] text-[10px] font-bold text-[#3f57e6]">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Hero animation — value reveal */}
          <ValueRevealCard />
        </div>
      </section>

      {/* Four acts */}
      <section className={`${wrap} py-20 lg:py-24`}>
        <h2 className="max-w-[16em] text-[32px] font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-[42px]">
          You&apos;re not the first owner to feel this way.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {ACTS.map((act, i) => (
            <div
              key={act.label}
              className="flex flex-col gap-3 rounded-2xl border border-[#DCE3F2] bg-[#F4F6FC] p-7"
            >
              <span className="text-sm font-bold text-[#4F6BFF]">
                {String(i + 1).padStart(2, "0")} — {act.label}
              </span>
              <p className="text-[17px] leading-relaxed text-[#2C3656]">{act.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What makes a good listing */}
      <section className="bg-[#F4F6FC]">
        <div className={`${wrap} py-20 lg:py-24`}>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-[42px]">
                What makes a good listing.
              </h2>
              <p className="mt-4 text-lg text-[#3B4566]">
                Buyers are looking for confidence. Here&apos;s what gives it to them.
              </p>
            </div>
            <ul className="flex flex-col gap-4">
              {GOOD_LISTING.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 rounded-2xl border border-[#DCE3F2] bg-white p-5"
                >
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#E8EEFF] text-sm font-bold text-[#3f57e6]">
                    ✓
                  </span>
                  <span className="text-[17px] leading-relaxed text-[#2C3656]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Learn before you list */}
      <section className={`${wrap} py-20 lg:py-24`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-[42px]">
              Learn before you list.
            </h2>
            <p className="mt-4 max-w-[34em] text-lg text-[#3B4566]">
              The owners who sell well start informed. These plain-English guides
              are the best place to begin.
            </p>
          </div>
          <Link
            href="/guides"
            className="text-[16px] font-semibold text-[#3f57e6] hover:underline"
          >
            All guides →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {sellerGuides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group flex flex-col rounded-2xl border border-[#DCE3F2] bg-white p-7 transition-shadow hover:shadow-[0_20px_48px_-26px_rgba(14,26,60,0.32)]"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-[#4F6BFF]">
                {g.category}
              </span>
              <h3 className="mt-3 text-[20px] font-bold leading-snug tracking-[-0.01em] text-[#0E1330] group-hover:text-[#3f57e6]">
                {g.title}
              </h3>
              <span className="mt-4 text-sm font-semibold text-[#525C7A]">
                {g.readingTime}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ValuationCTA
        headline="Start with your number. The rest follows."
        subtext="Free, instant, and private. See your estimated range in about a minute."
        cta="Get my free valuation"
      />
    </div>
  );
}
