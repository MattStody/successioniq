import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES, getFeaturedGuide } from "@/lib/guides";
import ValuationCTA from "@/components/marketing/ValuationCTA";

export const metadata: Metadata = {
  title: "Guides — Selling Your Business, Explained | Mercato",
  description:
    "Plain-English guides to valuing, preparing, and selling your business. Written for owner-operators across Canada and the United States — no jargon, no retainer.",
  alternates: { canonical: "https://successioniq.vercel.app/guides" },
};

// Short "what you'll take away" lines for the hero guide's panel.
const FEATURED_HIGHLIGHTS = [
  "Why value is earnings × a multiple — and what each part means",
  "The four levers that move your number up or down",
  "Why you get a range, and what a valuation is (and isn't)",
];

export default function GuidesHubPage() {
  const featured = getFeaturedGuide();
  const rest = GUIDES.filter((g) => g.slug !== featured.slug);

  return (
    <div className="bg-white text-[#0E1330]">
      {/* Hero */}
      <section className="border-b border-[#E3E8F3] bg-[#F4F6FC]">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:py-20">
          <p className="text-sm font-bold uppercase tracking-widest text-[#4F6BFF]">
            Mercato Guides
          </p>
          <h1 className="mt-3 max-w-[18em] text-[38px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[54px]">
            Selling your business, explained.
          </h1>
          <p className="mt-5 max-w-[34em] text-xl leading-normal text-[#3B4566]">
            Straight answers to the questions owners actually ask — what your
            business is worth, how to get it ready, and what the road to a sale
            really looks like. No jargon. No retainer.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-[1240px] px-5 pt-14 sm:px-8 lg:pt-16">
        <Link
          href={`/guides/${featured.slug}`}
          className="group grid overflow-hidden rounded-3xl border border-[#DCE3F2] bg-white transition-shadow hover:shadow-[0_28px_70px_-32px_rgba(14,26,60,0.4)] lg:grid-cols-2"
        >
          <div className="flex items-center bg-[#0E1330] p-9 sm:p-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8FA3E6]">
                Start here · {featured.category}
              </span>
              <h2 className="mt-4 text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-[38px]">
                {featured.title}
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-[#C3CCE6]">
                {featured.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-6 p-9 sm:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#525C7A]">
                In this guide
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {FEATURED_HIGHLIGHTS.map((h, i) => (
                  <li
                    key={h}
                    className="flex items-start gap-3 motion-safe:animate-[fade-up_0.5s_ease-out_both]"
                    style={{ animationDelay: `${0.2 + i * 0.18}s` }}
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#E8EEFF] text-xs font-bold text-[#3f57e6]">
                      ✓
                    </span>
                    <span className="text-[15px] leading-snug text-[#2C3656]">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2 text-[17px] font-bold text-[#3f57e6] group-hover:underline">
                Read the guide →
              </span>
              <span className="text-sm font-semibold text-[#525C7A]">
                · {featured.readingTime}
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* All guides */}
      <section className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 lg:py-20">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-[#0E1330]">
          All guides
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group flex flex-col rounded-2xl border border-[#DCE3F2] bg-white p-7 transition-shadow hover:shadow-[0_20px_48px_-26px_rgba(14,26,60,0.32)]"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-[#4F6BFF]">
                {g.category}
              </span>
              <h3 className="mt-3 text-[21px] font-bold leading-snug tracking-[-0.01em] text-[#0E1330] group-hover:text-[#3f57e6]">
                {g.title}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#525C7A]">
                {g.description}
              </p>
              <span className="mt-5 text-sm font-semibold text-[#525C7A]">
                {g.readingTime}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ValuationCTA
        headline="Reading is a good start. Your number is a better one."
        subtext="Put your own figures in and see your estimated range in about a minute."
      />
    </div>
  );
}
