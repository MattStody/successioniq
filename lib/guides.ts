/**
 * Registry of long-form guides shown under /guides. This is the single source
 * of truth for the hub index, each article's SEO metadata, and cross-links.
 *
 * Content lives in-repo (components/guides/articles/*) and renders statically,
 * which is the best possible setup for SEO. When the library outgrows hand-
 * authored articles, this registry is the seam to swap for a CMS/DB source.
 */

export type GuideCategory = "Valuation" | "Preparation" | "Process" | "Selling";

export type GuideAudience = "seller" | "buyer" | "general";

export interface Guide {
  slug: string;
  title: string;
  /** One-to-two sentence summary used on cards and as the meta description. */
  description: string;
  category: GuideCategory;
  audience: GuideAudience;
  /** e.g. "7 min read" */
  readingTime: string;
  /** ISO date (YYYY-MM-DD). */
  datePublished: string;
  /** Marks the single hero guide on the hub. */
  featured?: boolean;
}

export const GUIDES: Guide[] = [
  {
    slug: "what-is-my-business-worth",
    title: "What Is My Business Actually Worth?",
    description:
      "The honest answer to the question every owner asks first — how business value is actually calculated, what moves the number up or down, and why there's a range instead of a single figure.",
    category: "Valuation",
    audience: "seller",
    readingTime: "8 min read",
    datePublished: "2026-11-09",
    featured: true,
  },
  {
    slug: "get-your-business-ready-to-sell",
    title: "How to Get Your Business Ready to Sell",
    description:
      "The practical, unglamorous work that raises your sale price: clean financials, reducing how much the business depends on you, and documenting the systems a buyer is really paying for.",
    category: "Preparation",
    audience: "seller",
    readingTime: "9 min read",
    datePublished: "2026-11-09",
  },
  {
    slug: "ebitda-sde-multiples-explained",
    title: "EBITDA, SDE, and Multiples — Explained in Plain English",
    description:
      "Buyers value your business on earnings times a multiple. Here's what those earnings figures actually mean, how to work yours out, and what makes a multiple higher or lower — no finance degree required.",
    category: "Valuation",
    audience: "general",
    readingTime: "7 min read",
    datePublished: "2026-11-09",
  },
  {
    slug: "sellers-timeline",
    title: "The Seller's Timeline: From “Thinking About It” to Sold",
    description:
      "Selling a business usually takes longer than owners expect. This is the realistic timeline — from the first quiet thought to closing day — and what to do at each stage so you're never caught flat-footed.",
    category: "Process",
    audience: "seller",
    readingTime: "8 min read",
    datePublished: "2026-11-09",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getFeaturedGuide(): Guide {
  return GUIDES.find((g) => g.featured) ?? GUIDES[0];
}

/** Up to `limit` other guides, same-category first, for the "keep reading" rail. */
export function getRelatedGuides(slug: string, limit = 3): Guide[] {
  const current = getGuide(slug);
  const others = GUIDES.filter((g) => g.slug !== slug);
  if (!current) return others.slice(0, limit);
  const sorted = [...others].sort((a, b) => {
    const aMatch = a.category === current.category ? 0 : 1;
    const bMatch = b.category === current.category ? 0 : 1;
    return aMatch - bMatch;
  });
  return sorted.slice(0, limit);
}
