import Link from "next/link";

const stats = [
  { label: "Businesses Listed", value: "2,400+" },
  { label: "Successful Exits", value: "$1.2B+" },
  { label: "Avg. Time to Close", value: "47 days" },
];

const features = [
  {
    icon: "🧠",
    title: "AI-Powered Valuations",
    description:
      "Get an accurate, data-driven valuation in minutes using our proprietary AI model trained on thousands of transactions.",
  },
  {
    icon: "🔒",
    title: "Confidential Listings",
    description:
      "Your identity stays protected until you choose to engage. NDAs are managed automatically on the platform.",
  },
  {
    icon: "🤝",
    title: "Curated Buyer Network",
    description:
      "Access a vetted network of private equity firms, family offices, and strategic acquirers actively looking to buy.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm px-4 py-1.5 rounded-full mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Now in beta — limited access
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            The smarter way to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              exit your business
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            SuccessionIQ combines AI-driven valuations with a curated buyer
            marketplace to help business owners plan and execute a successful
            succession — on their terms.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/valuate"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-indigo-900/40 hover:shadow-indigo-800/50 hover:-translate-y-0.5"
            >
              Get your free business valuation
            </Link>
            <Link
              href="/listings"
              className="text-slate-300 hover:text-white px-8 py-4 rounded-xl text-lg font-medium border border-slate-700 hover:border-slate-500 transition-all"
            >
              Browse listings →
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for a successful exit
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            We handle the complexity so you can focus on what matters most.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-indigo-800/60 transition-colors"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-r from-indigo-900/50 to-violet-900/40 border border-indigo-800/40 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to find out what your business is worth?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
            Our AI valuation takes less than 5 minutes and is completely free —
            no strings attached.
          </p>
          <Link
            href="/valuate"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-indigo-900/40 hover:-translate-y-0.5"
          >
            Start your free valuation
          </Link>
        </div>
      </section>
    </div>
  );
}
