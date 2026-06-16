import CTAButton from "./CTAButton";

/** Dark navy closing CTA band reused at the bottom of marketing pages. */
export default function FinalCTA({
  headline,
  subtext,
}: {
  headline: string;
  subtext: string;
}) {
  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold leading-tight text-cream md:text-4xl">
          {headline}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-cream/70">{subtext}</p>
        <div className="mt-8">
          <CTAButton />
        </div>
      </div>
    </section>
  );
}
