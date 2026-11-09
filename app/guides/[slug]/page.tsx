import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuide, getRelatedGuides } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";
import Prose from "@/components/guides/Prose";
import ValuationCTA from "@/components/marketing/ValuationCTA";

// Article bodies live beside this route as plain components wrapped in <Prose>.
import WhatIsMyBusinessWorth from "@/components/guides/articles/what-is-my-business-worth";
import GetReadyToSell from "@/components/guides/articles/get-your-business-ready-to-sell";
import EbitdaExplained from "@/components/guides/articles/ebitda-sde-multiples-explained";
import SellersTimeline from "@/components/guides/articles/sellers-timeline";

const BODIES: Record<string, React.ComponentType> = {
  "what-is-my-business-worth": WhatIsMyBusinessWorth,
  "get-your-business-ready-to-sell": GetReadyToSell,
  "ebitda-sde-multiples-explained": EbitdaExplained,
  "sellers-timeline": SellersTimeline,
};

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide not found — FairMark" };
  const url = `${SITE_URL}/guides/${guide.slug}`;
  return {
    title: `${guide.title} | FairMark Guides`,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      type: "article",
      publishedTime: guide.datePublished,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const Body = BODIES[slug];
  if (!guide || !Body) notFound();

  const related = getRelatedGuides(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.datePublished,
    dateModified: guide.datePublished,
    author: { "@type": "Organization", name: "FairMark" },
    publisher: { "@type": "Organization", name: "FairMark" },
    mainEntityOfPage: `${SITE_URL}/guides/${guide.slug}`,
  };

  return (
    <article className="bg-white text-[#0E1330]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-[#E3E8F3] bg-[#F4F6FC]">
        <div className="mx-auto max-w-[760px] px-5 pb-12 pt-10 sm:px-8 lg:pt-14">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3f57e6] hover:underline"
          >
            ← All guides
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-[#E8EEFF] px-3 py-1 font-semibold text-[#3f57e6]">
              {guide.category}
            </span>
            <span className="text-[#525C7A]">{guide.readingTime}</span>
          </div>
          <h1 className="mt-5 text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[46px]">
            {guide.title}
          </h1>
          <p className="mt-5 text-xl leading-normal text-[#3B4566]">{guide.description}</p>
          <p className="mt-6 text-sm text-[#525C7A]">
            FairMark · Updated {formatDate(guide.datePublished)}
          </p>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-[760px] px-5 py-14 sm:px-8 lg:py-16">
        <Prose>
          <Body />
        </Prose>

        {/* Inline nudge */}
        <div className="mt-14 rounded-3xl border border-[#DCE3F2] bg-[#F4F6FC] p-7 text-center sm:p-9">
          <h2 className="text-[24px] font-extrabold tracking-[-0.015em] text-[#0E1330]">
            See your number in about a minute
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[#3B4566]">
            Type in last year&apos;s revenue and get an estimated value range right away.
            Free, private, no obligation.
          </p>
          <Link
            href="/valuate"
            className="mt-6 inline-flex min-h-13 items-center rounded-xl bg-[#4F6BFF] px-7 py-3.5 text-[17px] font-bold text-white transition-colors hover:bg-[#3f57e6]"
          >
            Get my free valuation →
          </Link>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-[#E3E8F3] bg-[#F4F6FC]">
          <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8">
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-[#0E1330]">
              Keep reading
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {related.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="group flex flex-col rounded-2xl border border-[#DCE3F2] bg-white p-6 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(14,26,60,0.3)]"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#4F6BFF]">
                    {g.category}
                  </span>
                  <span className="mt-3 text-[18px] font-bold leading-snug text-[#0E1330] group-hover:text-[#3f57e6]">
                    {g.title}
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-[#525C7A]">
                    {g.readingTime}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ValuationCTA />
    </article>
  );
}
