import Image from "next/image";
import Link from "next/link";
import { ValuatorTeaser } from "./ValuatorTeaser";
import { ADVISORS_PATH, LISTINGS_PATH, VALUATOR_PATH } from "./config";

// The global root layout provides the Mercato <Nav> and footer, plus the
// brand's Satoshi font (via next/font + the Fontshare stylesheet), so this page
// inherits typography and chrome instead of shipping its own.

const INDUSTRIES = [
  { name: "Construction and trades", img: "construction", slug: "trades" },
  { name: "Healthcare", img: "healthcare", slug: "healthcare" },
  { name: "Retail", img: "retail", slug: "retail" },
  { name: "Manufacturing", img: "manufacturing", slug: "manufacturing" },
  { name: "Restaurant and food", img: "restaurant", slug: "restaurant" },
  { name: "Technology and SaaS", img: "technology", slug: "technology" },
];

const STEPS = [
  { title: "Enter your revenue", body: "See an estimated value range instantly. No signup, no phone call." },
  { title: "Add what you know", body: "Profit, years in business, why you’re thinking of selling. Skip anything you’re unsure of." },
  { title: "Choose your next step", body: "Keep the number for planning, talk to an advisor, or list privately for qualified buyers." },
];

const primaryBtn = "inline-flex items-center rounded-xl bg-[#4565E6] font-bold text-white hover:bg-[#3550D4]";
const outlineBtn = "mt-2 inline-flex min-h-12 items-center rounded-xl border-2 border-[#0E1A3C] px-[22px] py-3 text-[17px] font-bold text-[#0E1A3C] hover:bg-[#0E1A3C] hover:text-white";
const wrap = "mx-auto max-w-[1240px] px-5 sm:px-8";

function Check({ d }: { d: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4565E6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 flex-none">
      <path d={d} />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white text-lg leading-[1.55] text-[#0E1A3C] [&_a:focus-visible]:outline-[3px] [&_a:focus-visible]:outline-offset-[3px] [&_a:focus-visible]:outline-[#4565E6]">
      {/* Hero */}
      <section className="bg-[#F4F6FC]">
        <div className={`${wrap} grid items-center gap-14 pt-14 pb-20 lg:grid-cols-2 lg:pt-[72px] lg:pb-[88px]`}>
          <div className="flex flex-col gap-7">
            <h1 className="text-[42px] leading-[1.04] font-extrabold tracking-[-0.03em] sm:text-[62px]">What is your business worth? Find out in a minute.</h1>
            <p className="max-w-[30em] text-[21px] leading-normal text-[#3B4566]">Type in last year’s revenue and see an estimated value range right away. No account, no broker, no cost.</p>
            <ul className="flex flex-col gap-3.5">
              <li className="flex items-start gap-3"><Check d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM7.5 12.5l3 3 6-6.5" /><span>See your range before you give us your email</span></li>
              <li className="flex items-start gap-3"><Check d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6zM8.5 12l2.5 2.5 4.5-5" /><span>Private. Nothing is listed or shared without your say</span></li>
              <li className="flex items-start gap-3"><Check d="M4 21V9l8-5 8 5v12M9.5 21v-6.5h5V21" /><span>Built for owner-run businesses, not Wall Street deals</span></li>
            </ul>
          </div>
          <ValuatorTeaser />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-6">
        <div className={`${wrap} flex flex-col gap-14 py-20 lg:py-[104px]`}>
          <div className="flex max-w-[720px] flex-col gap-3.5">
            <h2 className="text-[34px] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[44px]">Start with a rough number. Make it yours.</h2>
            <p className="text-xl text-[#3B4566]">You’re never asked for anything before you see a result. Every detail after that makes the estimate more accurate.</p>
          </div>
          <ol className="grid gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-3.5 border-t-2 border-[#0E1A3C] pt-6">
                <span className="font-bold text-[#4565E6]">Step {i + 1}</span>
                <h3 className="text-2xl font-bold tracking-[-0.01em]">{s.title}</h3>
                <p className="text-[#3B4566]">{s.body}</p>
              </li>
            ))}
          </ol>
          <div><a href="#valuator" className={`${primaryBtn} min-h-13 px-[26px] py-4 text-lg`}>Get my free valuation</a></div>
        </div>
      </section>

      {/* Objection */}
      <section>
        <div className={`${wrap} pb-20 lg:pb-[104px]`}>
          <div className="grid items-center gap-12 rounded-[28px] bg-[#EEF2FD] px-7 py-12 sm:px-14 sm:py-16 lg:grid-cols-2">
            <p className="text-[34px] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[46px]">It won’t replace a formal appraisal. It replaces the blank stare.</p>
            <div className="flex flex-col gap-[18px] text-[19px] text-[#2C3656]">
              <p>Most owners only hear a number once they’re already across the table from a buyer. A range you understand puts you back in charge of the conversation.</p>
              <p>When you’re ready for a certified figure, we’ll introduce you to a broker or Chartered Business Valuator who works with businesses your size.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-[#F4F6FC]">
        <div className={`${wrap} flex flex-col gap-12 py-20 lg:py-[104px]`}>
          <div className="flex max-w-[640px] flex-col gap-3">
            <h2 className="text-[34px] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[44px]">Valuations for the businesses that keep towns running</h2>
            <p className="text-xl text-[#3B4566]">Pick your industry to start with the right comparisons.</p>
          </div>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((ind) => (
              <Link key={ind.slug} href={`${VALUATOR_PATH}?industry=${ind.slug}`} className="group flex flex-col gap-3.5">
                <Image src={`/mercato/${ind.img}.jpg`} alt="" width={404} height={288} className="aspect-[7/5] w-full rounded-[18px] object-cover" />
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-[22px] font-bold">{ind.name}</span>
                  <span className="text-base font-semibold text-[#3550D4] group-hover:underline">Value my business</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Buyers + advisors */}
      <section>
        <div className={`${wrap} grid gap-8 py-20 md:grid-cols-2 lg:py-[104px]`}>
          <div id="buyers" className="flex scroll-mt-6 flex-col items-start gap-4 rounded-3xl border border-[#DCE3F2] p-8 sm:p-11">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4565E6" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
            <h2 className="text-[30px] font-extrabold tracking-[-0.02em]">Looking to buy a business?</h2>
            <p className="text-[#3B4566]">Browse confidential listings from owners planning their exit. Full financials are shared once both sides are ready.</p>
            <Link href={LISTINGS_PATH} className={outlineBtn}>Browse listings</Link>
          </div>
          <div id="advisors" className="flex scroll-mt-6 flex-col items-start gap-4 rounded-3xl border border-[#DCE3F2] p-8 sm:p-11">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4565E6" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.6 3.2-5.8 6.5-5.8s5.9 2.2 6.5 5.8" /><circle cx="17" cy="7" r="2.6" /><path d="M16.5 12.4c2.6.2 4.4 2 5 4.8" /></svg>
            <h2 className="text-[30px] font-extrabold tracking-[-0.02em]">Brokers and business valuators</h2>
            <p className="text-[#3B4566]">Give clients a free starting number, co-list mandates, and meet owners who are ready for expert help.</p>
            <Link href={ADVISORS_PATH} className={outlineBtn}>Become a referral partner</Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0E1A3C] text-white">
        <div className={`${wrap} flex flex-col items-center gap-7 py-24 text-center lg:py-28`}>
          <h2 className="max-w-[15em] text-[38px] leading-[1.08] font-extrabold tracking-[-0.03em] sm:text-[54px]">You spent years building it. Knowing what it’s worth takes a minute.</h2>
          <a href="#valuator" className={`${primaryBtn} min-h-15 rounded-[14px] px-[34px] py-5 text-xl`}>Get my free valuation</a>
          <p className="text-base text-[#C3CCE6]">No signup needed to see your range.</p>
        </div>
      </section>
    </div>
  );
}
