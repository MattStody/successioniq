import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fmtMoney } from "@/lib/financials";
import { SITE_URL } from "@/lib/site";
import {
  SEO_INDUSTRIES,
  getSeoIndustry,
  indefinite,
  locationGroups,
} from "@/lib/seo-data";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import Faq from "@/components/seo/Faq";
import InlineValuator from "@/components/seo/InlineValuator";
import ValuationCTA from "@/components/marketing/ValuationCTA";

const wrap = "mx-auto max-w-[1100px] px-5 sm:px-8";

export function generateStaticParams() {
  return SEO_INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const { industry: slug } = await params;
  const industry = getSeoIndustry(slug);
  if (!industry) return { title: "Not found — FairMark" };
  const url = `${SITE_URL}/sell/${industry.slug}`;
  const title = `Sell Your ${industry.name} Business — Free Valuation | FairMark`;
  const description = `What is ${indefinite(industry)} ${industry.noun} worth, and how do you sell it? Free valuation, plain-English guidance, and a confidential marketplace — no broker, no cost.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

export default async function IndustryHub({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const { industry: slug } = await params;
  const industry = getSeoIndustry(slug);
  if (!industry) notFound();

  const exLow = fmtMoney(industry.typicalRevenue * industry.low);
  const exHigh = fmtMoney(industry.typicalRevenue * industry.high);
  const valuateHref = `/valuate?industry=${encodeURIComponent(industry.category)}`;
  const groups = locationGroups();

  const faq = [
    {
      q: `How are ${industry.name.toLowerCase()} businesses valued?`,
      a: `On earnings (SDE or EBITDA) times a multiple, which usually works out to roughly ${industry.low}–${industry.high}× annual revenue for ${industry.blurb}. A ${fmtMoney(
        industry.typicalRevenue
      )} business would typically be worth around ${exLow}–${exHigh}, depending on profit and how transferable it is.`,
    },
    {
      q: `What makes ${indefinite(industry)} ${industry.noun} sell for more?`,
      a: `Buyers pay a premium for ${industry.drivers
        .slice(0, 3)
        .map((d) => d.toLowerCase())
        .join(", ")}. The less the business depends on you personally, the higher the multiple.`,
    },
    {
      q: `How do I sell my ${industry.name.toLowerCase()} business?`,
      a: `Start with a free FairMark valuation to anchor on a realistic number, get your financials in order, then list confidentially to reach qualified buyers — no broker retainer required.`,
    },
  ];

  return (
    <div className="bg-white text-[#0E1330]">
      {/* Hero */}
      <section className="border-b border-[#E3E8F3] bg-[#F4F6FC]">
        <div className={`${wrap} pb-12 pt-8 lg:pt-10`}>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Sell a business", href: "/sell" },
              { name: industry.name, href: `/sell/${industry.slug}` },
            ]}
          />
          <h1 className="mt-6 text-[36px] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-[52px]">
            Sell your {industry.name} business
          </h1>
          <p className="mt-5 max-w-[42em] text-xl leading-normal text-[#3B4566]">
            Find out what your {industry.noun} is worth, what drives the price, and how to sell —
            with a free, private valuation. {industry.blurb.charAt(0).toUpperCase() + industry.blurb.slice(1)}{" "}
            typically sell for {industry.low}–{industry.high}× revenue.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#estimate"
              className="inline-flex min-h-13 items-center rounded-xl bg-[#4F6BFF] px-7 py-3.5 text-[17px] font-bold text-white transition-colors hover:bg-[#3f57e6]"
            >
              Estimate my business →
            </a>
            <Link
              href={valuateHref}
              className="inline-flex min-h-13 items-center rounded-xl border-2 border-[#0E1330] px-6 py-3 text-[17px] font-bold text-[#0E1330] transition-colors hover:bg-[#0E1330] hover:text-white"
            >
              Get my free valuation
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive estimator */}
      <section className={`${wrap} py-12 lg:py-14`}>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <h2 className="text-[28px] font-extrabold tracking-[-0.025em] text-[#0E1330] sm:text-[34px]">
              See what your {industry.noun} is worth
            </h2>
            <p className="mt-4 text-[18px] leading-[1.7] text-[#2C3656]">
              {industry.blurb.charAt(0).toUpperCase() + industry.blurb.slice(1)} typically sell
              for <strong>{industry.low}–{industry.high}× annual revenue</strong>. Put your number
              in to see a range for your business, then get an exact figure free — no account
              needed.
            </p>
            <p className="mt-4 text-[15px] text-[#525C7A]">
              Example: {indefinite(industry)} {industry.name.toLowerCase()} business doing{" "}
              <strong>{fmtMoney(industry.typicalRevenue)}</strong> is typically worth around{" "}
              <strong className="text-[#3f57e6]">{exLow} – {exHigh}</strong>.
            </p>
          </div>
          <InlineValuator
            industryName={industry.name}
            category={industry.category}
            low={industry.low}
            high={industry.high}
            defaultRevenue={industry.typicalRevenue}
          />
        </div>
      </section>

      {/* Drivers */}
      <section className={`${wrap} py-14 lg:py-16`}>
        <h2 className="text-[28px] font-extrabold tracking-[-0.025em] text-[#0E1330] sm:text-[34px]">
          What drives the value of {indefinite(industry)} {industry.noun}
        </h2>
        <ul className="mt-7 grid gap-4 sm:grid-cols-2">
          {industry.drivers.map((d) => (
            <li key={d} className="flex items-start gap-3 rounded-2xl border border-[#DCE3F2] bg-[#F4F6FC] p-5">
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#E8EEFF] text-sm font-bold text-[#3f57e6]">✓</span>
              <span className="text-[16px] leading-relaxed text-[#2C3656]">{d}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Locations */}
      <section className="bg-[#F4F6FC]">
        <div className={`${wrap} py-14 lg:py-16`}>
          <h2 className="text-[28px] font-extrabold tracking-[-0.025em] text-[#0E1330] sm:text-[34px]">
            {industry.name} valuations by location
          </h2>
          <p className="mt-4 max-w-[42em] text-[18px] text-[#3B4566]">
            Choose your area to see what {indefinite(industry)} {industry.noun} is worth there and how to sell it.
          </p>
          <div className="mt-10 flex flex-col gap-9">
            {groups.map((g) => (
              <div key={g.province}>
                <div className="flex items-baseline justify-between gap-4 border-b border-[#DCE3F2] pb-2">
                  <h3 className="text-[18px] font-bold text-[#0E1330]">{g.province}</h3>
                  {g.provinceSlug && (
                    <Link
                      href={`/sell/${industry.slug}/${g.provinceSlug}`}
                      className="flex-none text-sm font-semibold text-[#3f57e6] hover:underline"
                    >
                      {g.province} overview →
                    </Link>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.cities.map((l) => (
                    <Link
                      key={l.slug}
                      href={`/sell/${industry.slug}/${l.slug}`}
                      className="rounded-full border border-[#C9D2E8] bg-white px-3.5 py-2 text-sm font-semibold text-[#0E1330] transition-colors hover:border-[#4F6BFF] hover:text-[#3f57e6]"
                    >
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${wrap} py-14 lg:py-16`}>
        <Faq items={faq} />
      </section>

      <ValuationCTA
        headline={`What is your ${industry.name.toLowerCase()} business worth?`}
        subtext="Get a free, private valuation in about a minute. No broker, no account, no cost."
        href={valuateHref}
      />
    </div>
  );
}
