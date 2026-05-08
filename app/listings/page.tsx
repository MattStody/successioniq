const mockListings = [
  {
    id: 1,
    industry: "SaaS",
    revenue: "$2.4M ARR",
    ebitda: "$820K",
    multiple: "4.2x",
    location: "Remote",
    tag: "Featured",
  },
  {
    id: 2,
    industry: "Healthcare Services",
    revenue: "$5.1M",
    ebitda: "$1.2M",
    multiple: "6.1x",
    location: "Texas, USA",
    tag: "New",
  },
  {
    id: 3,
    industry: "Manufacturing",
    revenue: "$12M",
    ebitda: "$2.8M",
    multiple: "5.0x",
    location: "Midwest, USA",
    tag: null,
  },
];

export default function ListingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-slate-900">
          Business Listings
        </h1>
        <p className="text-slate-500 text-lg max-w-xl">
          Browse vetted businesses available for acquisition. All listings are
          confidential and pre-screened by our team.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {["All Industries", "SaaS", "Healthcare", "Manufacturing", "Retail"].map(
          (f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                f === "All Industries"
                  ? "bg-blue-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {f}
            </button>
          )
        )}
      </div>

      {/* Listing cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {mockListings.map((l) => (
          <div
            key={l.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                {l.industry}
              </span>
              {l.tag && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  {l.tag}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-slate-400 mb-1">Revenue</div>
                <div className="text-lg font-semibold text-slate-900">{l.revenue}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">EBITDA</div>
                <div className="text-lg font-semibold text-slate-900">{l.ebitda}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Multiple</div>
                <div className="text-lg font-semibold text-slate-900">{l.multiple}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Location</div>
                <div className="text-lg font-semibold text-slate-900">{l.location}</div>
              </div>
            </div>

            <button className="w-full text-center text-sm font-medium text-blue-800 group-hover:text-blue-900 transition-colors">
              View details →
            </button>
          </div>
        ))}

        {/* Coming soon card */}
        <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[240px]">
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-slate-400 text-sm max-w-[160px]">
            More listings added weekly. Check back soon.
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-slate-400 text-sm">
          Showing sample listings. Full marketplace coming soon.
        </p>
      </div>
    </div>
  );
}
