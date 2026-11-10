import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fmtMoney } from "@/lib/financials";
import { SITE_URL } from "@/lib/site";
import {
  getSeoIndustry,
  getSeoLocation,
  locationLabel,
  nearbyLocations,
  otherIndustries,
  allSellCombos,
  indefinite,
  indefiniteCap,
  type SeoIndustry,
  type SeoLocation,
} from "@/lib/seo-data";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import Faq from "@/components/seo/Faq";
import JsonLd from "@/components/seo/JsonLd";
import InlineValuator from "@/components/seo/InlineValuator";
import ValuationCTA from "@/components/marketing/ValuationCTA";

const wrap = "mx-auto max-w-[900px] px-5 sm:px-8";

export function generateStaticParams() {
  return allSellCombos();
}

function resolve(params: { industry: string; location: string }) {
  const industry = getSeoIndustry(params.industry);
  const location = getSeoLocation(params.location);
  return industry && location ? { industry, location } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string; location: string }>;
}): Promise<Metadata> {
  const p = await params;
  const r = resolve(p);
  if (!r) return { title: "Not found — FairMark" };
  const { industry, location } = r;
  const url = `${SITE_URL}/sell/${industry.slug}/${location.slug}`;
  const title = `What Is ${indefiniteCap(industry)} ${industry.name} Business Worth in ${location.name}? | FairMark`;
  const description = `Free, private valuation for your ${industry.noun} in ${locationLabel(
    location
  )}. See what your business could sell for, what drives the price, and how to sell — no broker, no cost.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

function exampleRange(industry: SeoIndustry) {
  return {
    low: fmtMoney(industry.typicalRevenue * industry.low),
    high: fmtMoney(industry.typicalRevenue * industry.high),
    revenue: fmtMoney(industry.typicalRevenue),
  };
}

function buildFaq(industry: SeoIndustry, location: SeoLocation) {
  const ex = exampleRange(industry);
  const where = location.isProvince ? location.province : location.name;
  return [
    {
      q: `How much is ${indefinite(industry)} ${industry.name} business worth in ${where}?`,
      a: `Most ${industry.blurb} sell for roughly ${industry.low}–${industry.high}× annual revenue, so ${indefinite(industry)} ${industry.name.toLowerCase()} business doing ${ex.revenue} a year would land around ${ex.low}–${ex.high}. The exact figure depends on your profit (SDE/EBITDA), how much the business relies on you, and the quality of your earnings. A free FairMark valuation gives you a defensible range in about a minute.`,
    },
    {
      q: `How do I sell my ${industry.name} business in ${where}?`,
      a: `Start with a free valuation to anchor on a realistic number, clean up your financials, and reduce how much the business depends on you. When you're ready, you can list confidentially on FairMark and reach qualified buyers in ${where} and beyond — no broker retainer required.`,
    },
    {
      q: `What multiple do ${industry.name} businesses sell for?`,
      a: `${industry.name} businesses typically trade in the ${industry.low}–${industry.high}× revenue range, but the earnings multiple matters more: buyers pay for transferable, recurring, verifiable profit. Strong ${industry.drivers[0].toLowerCase()} and low owner-dependence push you toward the top of the range.`,
    },
    {
      q: `Do I need a broker to sell my ${industry.name} business in ${where}?`,
      a: `Not to get started. A broker can help with larger or more complex deals, but you don't need a retainer just to understand what your business is worth or to reach buyers. FairMark gives you a free valuation and a confidential listing, and can connect you with an advisor when you're ready.`,
    },
  ];
}

export default async function SellPage({
  params,
}: {
  params: Promise<{ industry: string; location: string }>;
}) {
  const p = await params;
  const r = resolve(p);
  if (!r) notFound();
  const { industry, location } = r;

  const ex = exampleRange(industry);
  const where = location.isProvince ? location.province : location.name;
  const nearby = nearbyLocations(location);
  const others = otherIndustries(industry);
  const faq = buildFaq(industry, location);
  const valuateHref = `/valuate?industry=${encodeURIComponent(industry.category)}`;
  const listingsHref = `/listings?industry=${encodeURIComponent(industry.category)}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${industry.name} business valuation in ${where}`,
    serviceType: "Business valuation",
    areaServed: { "@type": "Place", name: `${where}, ${location.country}` },
    provider: { "@type": "Organization", name: "FairMark", url: SITE_URL },
    description: `Free valuation and confidential marketplace for ${industry.noun}s in ${where}.`,
  };

  return (
    <div className="bg-white text-[#0E1330]">
      <JsonLd data={serviceJsonLd} />

      {/* Hero */}
      <section className="border-b border-[#E3E8F3] bg-[#F4F6FC]">
        <div className={`${wrap} pb-12 pt-8 lg:pt-10`}>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Sell a business", href: "/sell" },
              { name: industry.name, href: `/sell/${industry.slug}` },
              { name: where, href: `/sell/${industry.slug}/${location.slug}` },
            ]}
          />
          <h1 className="mt-6 text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[46px]">
            What is {indefinite(industry)} {industry.name} business worth in {where}?
          </h1>
          <p className="mt-5 max-w-[42em] text-xl leading-normal text-[#3B4566]">
            Get a free, private valuation for your {industry.noun} in {locationLabel(location)} —
            then sell it on your terms. No broker, no account, no cost.
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

      {/* Interactive estimator — the conversion driver, high on the page */}
      <section className={`${wrap} py-12 lg:py-14`}>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <h2 className="text-[28px] font-extrabold tracking-[-0.025em] text-[#0E1330] sm:text-[34px]">
              See what your {industry.noun} is worth
            </h2>
            <p className="mt-4 text-[18px] leading-[1.7] text-[#2C3656]">
              Buyers value {indefinite(industry)} {industry.noun} on the profit it reliably
              produces — your SDE or EBITDA — times a multiple. As a rule of thumb,{" "}
              {industry.blurb} change hands for roughly{" "}
              <strong>{industry.low}–{industry.high}× annual revenue</strong>. Put your number in
              to see a range, then get an exact figure free.
            </p>
            <p className="mt-4 text-[15px] text-[#525C7A]">
              Example: {indefinite(industry)} {industry.name.toLowerCase()} business doing{" "}
              <strong>{ex.revenue}</strong> is typically worth around{" "}
              <strong className="text-[#3f57e6]">{ex.low} – {ex.high}</strong>.
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

      {/* Value drivers */}
      <section className="bg-[#F4F6FC]">
        <div className={`${wrap} py-14 lg:py-16`}>
          <h2 className="text-[28px] font-extrabold tracking-[-0.025em] text-[#0E1330] sm:text-[34px]">
            What drives the value of {indefinite(industry)} {industry.noun}
          </h2>
          <p className="mt-4 max-w-[42em] text-[18px] text-[#3B4566]">
            Two businesses with the same revenue can sell for very different prices. For{" "}
            {indefinite(industry)} {industry.noun}, buyers pay a premium for:
          </p>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2">
            {industry.drivers.map((d) => (
              <li
                key={d}
                className="flex items-start gap-3 rounded-2xl border border-[#DCE3F2] bg-white p-5"
              >
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#E8EEFF] text-sm font-bold text-[#3f57e6]">
                  ✓
                </span>
                <span className="text-[16px] leading-relaxed text-[#2C3656]">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mid-page CTA back to the estimator */}
      <section className="bg-[#EEF2FD]">
        <div className={`${wrap} flex flex-col items-center gap-4 py-12 text-center sm:flex-row sm:justify-between sm:text-left`}>
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.015em] text-[#0E1330] sm:text-[26px]">
              Ready to see your exact number?
            </h2>
            <p className="mt-1 text-[#3B4566]">Free, private, and takes about a minute.</p>
          </div>
          <a
            href="#estimate"
            className="inline-flex min-h-13 flex-none items-center rounded-xl bg-[#4F6BFF] px-7 py-3.5 text-[17px] font-bold text-white transition-colors hover:bg-[#3f57e6]"
          >
            Estimate my business →
          </a>
        </div>
      </section>

      {/* Local + selling */}
      <section className={`${wrap} py-14 lg:py-16`}>
        <h2 className="text-[28px] font-extrabold tracking-[-0.025em] text-[#0E1330] sm:text-[34px]">
          Selling {indefinite(industry)} {industry.noun} in {where}
        </h2>
        <p className="mt-4 text-[18px] leading-[1.7] text-[#2C3656]">
          {location.isProvince
            ? `Across ${location.province}, demand for well-run ${industry.blurb} stays steady — the largest transfer of business ownership in history is underway as owners retire.`
            : `${where} and the surrounding area are home to many established ${industry.blurb}, and there is a steady pool of buyers looking for a profitable, well-run business to step into.`}{" "}
          FairMark gives you a free valuation first, then a confidential listing that reaches
          qualified buyers — you decide if and when anything is shared.
        </p>
        <p className="mt-4 text-[15px]">
          <Link href={listingsHref} className="font-semibold text-[#3f57e6] hover:underline">
            Looking to buy instead? Browse {industry.name.toLowerCase()} businesses for sale →
          </Link>
        </p>

        {nearby.length > 0 && (
          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#525C7A]">
              {industry.name} valuations nearby
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {nearby.map((n) => (
                <Link
                  key={n.slug}
                  href={`/sell/${industry.slug}/${n.slug}`}
                  className="rounded-full border border-[#C9D2E8] bg-white px-3.5 py-2 text-sm font-semibold text-[#0E1330] transition-colors hover:border-[#0E1330]"
                >
                  {n.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="bg-[#F4F6FC]">
        <div className={`${wrap} py-14 lg:py-16`}>
          <Faq items={faq} />
        </div>
      </section>

      {/* Explore more — internal linking mesh */}
      <section className={`${wrap} py-14 lg:py-16`}>
        <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-[#0E1330]">
          Explore more
        </h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#525C7A]">
              Other businesses in {where}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/sell/${o.slug}/${location.slug}`}
                    className="text-[16px] font-semibold text-[#3f57e6] hover:underline"
                  >
                    Sell {indefinite(o)} {o.name.toLowerCase()} business in {where} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#525C7A]">
              Guides for owners
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link href="/guides/what-is-my-business-worth" className="text-[16px] font-semibold text-[#3f57e6] hover:underline">
                  What is my business actually worth? →
                </Link>
              </li>
              <li>
                <Link href="/guides/get-your-business-ready-to-sell" className="text-[16px] font-semibold text-[#3f57e6] hover:underline">
                  How to get your business ready to sell →
                </Link>
              </li>
              <li>
                <Link href="/guides/ebitda-sde-multiples-explained" className="text-[16px] font-semibold text-[#3f57e6] hover:underline">
                  EBITDA, SDE &amp; multiples, explained →
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-[16px] font-semibold text-[#3f57e6] hover:underline">
                  All guides →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <ValuationCTA
        headline={`What is your ${industry.name.toLowerCase()} business worth?`}
        subtext={`Get a free, private valuation in about a minute. No broker, no account, no cost.`}
        href={valuateHref}
      />
    </div>
  );
}
