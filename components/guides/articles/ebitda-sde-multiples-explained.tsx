import Link from "next/link";
import Callout from "../Callout";

export default function Article() {
  return (
    <>
      <p>
        If you&apos;ve started reading about selling a business, you&apos;ve run
        into a wall of acronyms — EBITDA, SDE, multiples — thrown around as if
        everyone was born knowing them. They&apos;re actually simple ideas wearing
        intimidating names. Once they click, you&apos;ll understand exactly how
        buyers arrive at a price.
      </p>

      <h2>Earnings first: the profit a buyer actually cares about</h2>
      <p>
        The number at the bottom of your tax return is designed to{" "}
        <strong>minimize tax</strong>, not to show a buyer what the business
        earns. So buyers don&apos;t use it. Instead they rebuild your earnings into
        one of two figures, depending on the size of the business.
      </p>

      <h3>SDE — Seller&apos;s Discretionary Earnings</h3>
      <p>
        Used for most small, owner-operated businesses (roughly under $1–2M in
        earnings). SDE answers: <strong>&ldquo;What&apos;s the total financial
        benefit to one working owner?&rdquo;</strong> You start with net profit and
        add back:
      </p>
      <ul>
        <li>The owner&apos;s salary and benefits (one owner&apos;s).</li>
        <li>Interest, taxes, depreciation, and amortization.</li>
        <li>One-time or non-business expenses (that &ldquo;conference&rdquo; in Cabo).</li>
      </ul>

      <h3>EBITDA — Earnings Before Interest, Taxes, Depreciation &amp; Amortization</h3>
      <p>
        Used for larger businesses that run with management in place, or when the
        buyer will be an investor rather than an owner-operator. EBITDA{" "}
        <strong>does not</strong> add back a market-rate manager&apos;s salary,
        because the business still has to pay someone to run it. That&apos;s the
        core difference from SDE.
      </p>

      <Callout title="The owner-salary trap">
        The gap between SDE and EBITDA is usually the owner&apos;s salary. When you
        compare your business to a sale you read about online, make sure you&apos;re
        comparing the <strong>same</strong> earnings figure — mixing them up is the
        most common way owners wildly over- or under-estimate their value.
      </Callout>

      <h2>The multiple: how many years of earnings</h2>
      <p>
        Once you have an earnings figure, value is simply that number times a{" "}
        <strong>multiple</strong>. A multiple of 3× means a buyer is paying roughly
        three years of current earnings for the business.
      </p>
      <blockquote>
        Value ≈ earnings × multiple. A $400,000 SDE business at a 3× multiple is
        worth about $1.2M.
      </blockquote>
      <p>
        The multiple isn&apos;t arbitrary. It reflects how risky and transferable
        those earnings are. Lower risk and easier transfer mean a higher multiple —
        and a higher price for the same profit.
      </p>

      <h2>What pushes a multiple up</h2>
      <ul>
        <li>
          <strong>Recurring revenue</strong> — contracts and repeat customers a
          buyer can count on.
        </li>
        <li>
          <strong>Low owner-dependence</strong> — the business runs without the
          seller.
        </li>
        <li>
          <strong>Growth</strong> — rising revenue in a healthy industry.
        </li>
        <li>
          <strong>Diversified customers</strong> — no single client who could sink
          the ship by leaving.
        </li>
        <li>
          <strong>Clean books</strong> — earnings a buyer can verify quickly.
        </li>
      </ul>

      <h2>What drags a multiple down</h2>
      <ul>
        <li>Revenue that depends on the owner&apos;s personal relationships.</li>
        <li>One customer making up a large share of sales.</li>
        <li>Lumpy, project-based income with no repeat base.</li>
        <li>Flat or declining revenue, or a shrinking industry.</li>
        <li>Messy financials that slow down or spook a buyer.</li>
      </ul>

      <h2>Why your industry sets the starting point</h2>
      <p>
        Different industries trade in different multiple ranges, because their
        earnings carry different risk. A software business with recurring
        subscriptions might trade at 4× or more; a restaurant, closer to 2×. That&apos;s
        why a good valuation starts from <strong>comparable sales in your
        industry</strong>, then adjusts up or down for the levers above — rather
        than applying one generic number to everyone.
      </p>

      <Callout title="Put it together">
        Your rough value is: (your SDE or EBITDA) × (your industry&apos;s typical
        multiple), then nudged up for your strengths and down for your risks. A
        free valuation does this math for you in a couple of minutes — and tells
        you which levers are moving your number.
      </Callout>

      <p>
        Want to see it applied to your own numbers? Read{" "}
        <Link href="/guides/what-is-my-business-worth">
          What Is My Business Actually Worth?
        </Link>{" "}
        next, or run your figures through a valuation and see your range.
      </p>
    </>
  );
}
