import Link from "next/link";
import ValuationCTA from "@/components/marketing/ValuationCTA";

export const metadata = {
  title: "About — Why We Built FairMark",
  description:
    "FairMark was built in Hamilton, Ontario to give every business owner a dignified exit — starting with a simple answer to what their business is worth.",
};

const readable = "mx-auto max-w-[760px] px-5 sm:px-8";

export default function AboutPage() {
  return (
    <div className="bg-white text-[#0E1330]">
      {/* Hero */}
      <section className="border-b border-[#E3E8F3] bg-[#F4F6FC]">
        <div className={`${readable} py-16 lg:py-24`}>
          <span className="text-sm font-bold uppercase tracking-widest text-[#4F6BFF]">
            About FairMark
          </span>
          <h1 className="mt-4 text-[38px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[52px]">
            Built by someone who saw the problem up close.
          </h1>

          {/* Hero animation — the succession wave rising */}
          <div className="mt-10 flex h-[120px] items-end gap-1.5 sm:gap-2" aria-hidden="true">
            {[22, 30, 28, 42, 55, 50, 68, 84, 78, 100, 116, 120].map((h, i) => (
              <div
                key={i}
                className="flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-[#4F6BFF] to-[#8299FF] motion-safe:animate-[rise_0.7s_ease-out_both]"
                style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-[#525C7A]">
            The largest transfer of business ownership in history — now underway.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className={`${readable} py-16 lg:py-20`}>
        <div className="space-y-6 text-[19px] leading-[1.7] text-[#2C3656]">
          <p>
            FairMark started in Hamilton, Ontario, with a frustration that
            wouldn&apos;t go away. Everywhere I looked, I saw owners who had spent
            25, 30, 35 years building real businesses — trades, clinics, shops,
            service companies — and not one of them could answer a simple question:{" "}
            <em>what is this thing actually worth?</em>
          </p>
          <p>
            These are people who built something real. They employ their
            neighbours. They show up every day. And when it comes time to think
            about retirement, the system makes it harder, not easier. Brokers want
            a retainer. Appraisers want thousands of dollars and weeks of waiting.
            So most owners do the only thing that feels safe — nothing. And the
            years slip by.
          </p>
          <p>
            I could see the wave coming. Over the next decade, more business owners
            will try to retire than at any point in history — and most have no plan
            and no number. That problem was too big and too urgent to wait on. So I
            built FairMark with modern AI tools, because the owners living this
            don&apos;t have time for a five-year roadmap. They have a question that
            needs an answer today.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#DCE3F2] bg-[#F4F6FC] p-7">
            <div className="text-[40px] font-extrabold tracking-[-0.02em] text-[#4F6BFF]">
              $10 trillion
            </div>
            <p className="mt-2 text-[#2C3656]">
              in business value will change hands as baby boomer owners retire.
            </p>
          </div>
          <div className="rounded-2xl border border-[#DCE3F2] bg-[#F4F6FC] p-7">
            <div className="text-[40px] font-extrabold tracking-[-0.02em] text-[#4F6BFF]">
              73%
            </div>
            <p className="mt-2 text-[#2C3656]">
              of Ontario business owners have no succession plan in place.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-[#F4F6FC]">
        <div className={`${readable} py-16 lg:py-20`}>
          <h2 className="text-[30px] font-extrabold tracking-[-0.025em] text-[#0E1330] sm:text-[38px]">
            The vision
          </h2>
          <p className="mt-5 text-[19px] leading-[1.7] text-[#2C3656]">
            A modern, seller-first platform that gives every business owner a
            dignified exit. Not a cold marketplace — a clear, honest starting point
            that respects the years of hard work behind every business, and helps
            owners take the next step with confidence instead of fear.
          </p>

          <div className="mt-10 rounded-2xl border border-[#DCE3F2] bg-white p-7 sm:p-8">
            <h3 className="text-[20px] font-bold tracking-[-0.01em] text-[#0E1330]">
              Where advisors fit in
            </h3>
            <p className="mt-3 text-[17px] leading-relaxed text-[#2C3656]">
              We work with brokers, CBVs, and financial advisors — not against
              them. We&apos;re the top of funnel that sends them better-prepared,
              more informed clients.
            </p>
          </div>

          <div className="mt-10">
            <Link
              href="/guides"
              className="text-[16px] font-semibold text-[#3f57e6] hover:underline"
            >
              Read the guides to see how we think about selling →
            </Link>
          </div>
        </div>
      </section>

      <ValuationCTA
        headline="Start with your number."
        subtext="Free, instant, and private. See your estimated range in about a minute."
      />
    </div>
  );
}
