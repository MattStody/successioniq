import CTAButton from "@/components/CTAButton";
import FinalCTA from "@/components/FinalCTA";

export const metadata = {
  title: "About — Why We Built Mercato",
  description:
    "Mercato was built in Hamilton, Ontario to give every business owner a dignified exit — starting with a simple answer to what their business is worth.",
};

export default function AboutPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-16 text-center md:pt-24">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-navy md:text-5xl">
          Built by someone who saw the problem up close.
        </h1>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-6 text-lg leading-relaxed text-navy/75">
          <p>
            Mercato started in Hamilton, Ontario, with a frustration that wouldn&apos;t go
            away. Everywhere I looked, I saw owners who had spent 25, 30, 35 years building
            real businesses — trades, clinics, shops, service companies — and not one of them
            could answer a simple question: <em>what is this thing actually worth?</em>
          </p>
          <p>
            These are people who built something real. They employ their neighbours. They show
            up every day. And when it comes time to think about retirement, the system makes it
            harder, not easier. Brokers want a retainer. Appraisers want thousands of dollars
            and weeks of waiting. So most owners do the only thing that feels safe — nothing.
            And the years slip by.
          </p>
          <p>
            I could see the wave coming. Over the next decade, more business owners will try to
            retire than at any point in history — and most have no plan and no number. That
            problem was too big and too urgent to wait on. So I built Mercato in under a
            week using modern AI tools, because the owners living this don&apos;t have time for
            a five-year roadmap. They have a question that needs an answer today.
          </p>
        </div>

        {/* Why this matters */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-cream-deep bg-white p-7">
            <div className="text-3xl font-bold text-accent-dark">$10 trillion</div>
            <p className="mt-2 text-navy/70">
              in business value will change hands as baby boomer owners retire.
            </p>
          </div>
          <div className="rounded-2xl border border-cream-deep bg-white p-7">
            <div className="text-3xl font-bold text-accent-dark">73%</div>
            <p className="mt-2 text-navy/70">
              of Ontario business owners have no succession plan in place.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-2xl font-bold text-navy md:text-3xl">The vision</h2>
          <p className="mt-4 text-lg leading-relaxed text-navy/75">
            A modern, seller-first platform that gives every business owner a dignified exit.
            Not a cold marketplace — a clear, honest starting point that respects the years of
            hard work behind every business, and helps owners take the next step with
            confidence instead of fear.
          </p>

          <div className="mt-10 rounded-2xl border border-cream-deep bg-cream p-7">
            <h3 className="text-lg font-semibold text-navy">
              Where advisors fit in
            </h3>
            <p className="mt-3 leading-relaxed text-navy/75">
              We work with brokers, CBVs, and financial advisors — not against them. We&apos;re
              the top of funnel that sends them better-prepared, more informed clients.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-cream py-12 text-center">
        <CTAButton />
      </div>

      <FinalCTA
        headline="Start with your number."
        subtext="Free. Instant. No broker required."
      />
    </div>
  );
}
