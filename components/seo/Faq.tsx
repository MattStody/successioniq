import JsonLd from "./JsonLd";

/** FAQ section that also emits FAQPage structured data for rich results. */
export default function Faq({
  items,
  heading = "Frequently asked questions",
}: {
  items: { q: string; a: string }[];
  heading?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section>
      <JsonLd data={jsonLd} />
      <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-[#0E1330] sm:text-[34px]">
        {heading}
      </h2>
      <div className="mt-8 space-y-4">
        {items.map((it) => (
          <div key={it.q} className="rounded-2xl border border-[#DCE3F2] bg-white p-6">
            <h3 className="text-[17px] font-bold text-[#0E1330]">{it.q}</h3>
            <p className="mt-2 leading-relaxed text-[#2C3656]">{it.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
