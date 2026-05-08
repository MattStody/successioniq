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
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 to-white pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-1.5 rounded-full mb-8 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-700" />
            Now in beta — limited access
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-slate-900">
            The smarter way to
            <br />
            <span className="text-blue-900">exit your business</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            SuccessionIQ combines AI-driven valuations with a curated buyer
            marketplace to help business owners plan and execute a successful
            succession — on their terms.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/valuate"
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Get your free business valuation
            </Link>
            <Link
              href="/listings"
              className="text-slate-700 hover:text-slate-900 px-8 py-4 rounded-xl text-lg font-medium border border-slate-300 hover:border-slate-400 transition-all bg-white"
            >
              Browse listings →
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-slate-900">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Everything you need for a successful exit
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            We handle the complexity so you can focus on what matters most.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-200 hover:shadow-md transition-all shadow-sm"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-blue-900 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to find out what your business is worth?
          </h2>
          <p className="text-blue-200 text-lg mb-8 max-w-lg mx-auto">
            Our AI valuation takes less than 5 minutes and is completely free —
            no strings attached.
          </p>
          <Link
            href="/valuate"
            className="inline-block bg-white text-blue-900 hover:bg-blue-50 px-10 py-4 rounded-xl text-lg font-semibold transition-all shadow-md hover:-translate-y-0.5"
          >
            Start your free valuation
          </Link>
        </div>
      </section>
    </div>
  );
}
