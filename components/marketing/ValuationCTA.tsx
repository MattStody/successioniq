import Link from "next/link";

/**
 * Navy closing CTA band in the Mercato landing palette (#0E1330 / #4F6BFF).
 * Reused across the refreshed marketing pages and guide articles so the whole
 * surface shares one conversion moment. Defaults route to the free valuator.
 */
export default function ValuationCTA({
  headline = "What’s your business worth? Find out in a minute.",
  subtext = "No account, no broker, no cost. See your estimated range right away.",
  cta = "Get my free valuation",
  href = "/valuate",
}: {
  headline?: string;
  subtext?: string;
  cta?: string;
  href?: string;
}) {
  return (
    <section className="bg-[#0E1330] text-white">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-6 px-5 py-20 text-center sm:px-8 lg:py-24">
        <h2 className="max-w-[16em] text-[32px] font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-[44px]">
          {headline}
        </h2>
        <p className="max-w-[40em] text-lg text-[#C3CCE6]">{subtext}</p>
        <Link
          href={href}
          className="mt-1 inline-flex min-h-14 items-center rounded-[14px] bg-[#4F6BFF] px-8 py-4 text-[18px] font-bold text-white transition-colors hover:bg-[#3f57e6]"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}
