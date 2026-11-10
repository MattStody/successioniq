import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { GUIDES } from "@/lib/guides";
import { SEO_INDUSTRIES, allSellCombos } from "@/lib/seo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (path: string) => `${SITE_URL}${path}`;

  const staticPages: MetadataRoute.Sitemap = [
    { url: u("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: u("/valuate"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: u("/sell"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: u("/listings"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: u("/for-sellers"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: u("/for-buyers"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: u("/how-it-works"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: u("/guides"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: u("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: u("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: u("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const guidePages: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: u(`/guides/${g.slug}`),
    lastModified: new Date(`${g.datePublished}T00:00:00`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const industryHubs: MetadataRoute.Sitemap = SEO_INDUSTRIES.map((i) => ({
    url: u(`/sell/${i.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const leafPages: MetadataRoute.Sitemap = allSellCombos().map((c) => ({
    url: u(`/sell/${c.industry}/${c.location}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...guidePages, ...industryHubs, ...leafPages];
}
