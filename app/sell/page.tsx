import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SEO_INDUSTRIES, SEO_LOCATIONS } from "@/lib/seo-data";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import ValuationCTA from "@/components/marketing/ValuationCTA";

const wrap = "mx-auto max-w-[1100px] px-5 sm:px-8";

export const metadata: Metadata = {
  title: "Sell Your Business — Free Valuation by Industry & Location | FairMark",
  description:
    "What is your business worth, and how do you sell it? Free, private valuations for every kind of business across Ontario — trades, healthcare, restaurants, retail, manufacturing and more. No broker, no cost.",
  alternates: { canonical: `${SITE_URL}/sell` },
};

export default function SellHub() {
  const coreCities = SEO_LOCATIONS.filter((l) => l.core && !l.isProvince);
  // A handful of high-intent industry × core-city links to seed the leaf pages.
  const popular = coreCities.slice(0, 4).flatMap((city) =>
    SEO_INDUSTRIES.slice(0, 4).map((ind) => ({ ind, city }))
  );

  return (
    <div className="bg-white text-[#0E1330]">
      {/* Hero */}
      <section className="border-b border-[#E3E8F3] bg-[#F4F6FC]">
        <div className={`${wrap} pb-12 pt-8 lg:pt-10`}>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Sell a business", href: "/sell" },
            ]}
          />
          <h1 className="mt-6 text-[36px] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-[54px]">
            What is your business worth? Sell it with FairMark.
          </h1>
          <p className="mt-5 max-w-[44em] text-xl leading-normal text-[#3B4566]">
            Pick your type of business to see how it is valued, what drives the price, and how to
            sell — starting with a free, private valuation. No broker, no account, no cost.
          </p>
          <div className="mt-7">
            <Link
              href="/valuate"
              className="inline-flex min-h-13 items-center rounded-xl bg-[#4F6BFF] px-7 py-3.5 text-[17px] font-bold text-white transition-colors hover:bg-[#3f57e6]"
            >
              Get my free valuation →
            </Link>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className={`${wrap} py-14 lg:py-16`}>
        <h2 className="text-[28px] font-extrabold tracking-[-0.025em] text-[#0E1330] sm:text-[34px]">
          Valuations by type of business
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEO_INDUSTRIES.map((ind) => (
            <Link
              key={ind.slug}
              href={`/sell/${ind.slug}`}
              className="group rounded-2xl border border-[#DCE3F2] bg-white p-5 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(14,19,48,0.3)]"
            >
              <div className="text-[18px] font-bold text-[#0E1330] group-hover:text-[#3f57e6]">
                {ind.name}
              </div>
              <div className="mt-1 text-sm text-[#525C7A]">
                Typically {ind.low}–{ind.high}× revenue
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular searches */}
      <section className="bg-[#F4F6FC]">
        <div className={`${wrap} py-14 lg:py-16`}>
          <h2 className="text-[28px] font-extrabold tracking-[-0.025em] text-[#0E1330] sm:text-[34px]">
            Popular in the Hamilton area
          </h2>
          <div className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map(({ ind, city }) => (
              <Link
                key={`${ind.slug}-${city.slug}`}
                href={`/sell/${ind.slug}/${city.slug}`}
                className="rounded-xl border border-[#DCE3F2] bg-white px-4 py-3 text-[15px] font-semibold text-[#0E1330] transition-colors hover:border-[#4F6BFF] hover:text-[#3f57e6]"
              >
                {ind.name} in {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ValuationCTA />
    </div>
  );
}
