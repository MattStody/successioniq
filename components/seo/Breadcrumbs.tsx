import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import JsonLd from "./JsonLd";

/** Visual breadcrumb trail that also emits BreadcrumbList structured data. */
export default function Breadcrumbs({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.href}`,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-sm text-[#525C7A]"
      >
        {items.map((it, i) => (
          <span key={it.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-[#C9D2E8]">/</span>}
            {i < items.length - 1 ? (
              <Link href={it.href} className="hover:text-[#3f57e6] hover:underline">
                {it.name}
              </Link>
            ) : (
              <span className="font-medium text-[#0E1330]">{it.name}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
