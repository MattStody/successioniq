/**
 * Data model for FairMark's programmatic SEO pages under /sell.
 *
 * We target specific business types (HVAC, dental, restaurant, …) crossed with
 * Ontario locations — the long-tail, high-intent queries owners actually search
 * ("what is my HVAC business worth in Hamilton", "sell my dental practice in
 * Burlington"). Each business type maps to a canonical valuator industry so the
 * CTA pre-fills the right category, and carries its own revenue-multiple band
 * and value drivers so every page has genuinely useful, differentiated content.
 */

import type { INDUSTRIES } from "@/lib/financials";

export type ValuatorIndustry = (typeof INDUSTRIES)[number];

export interface SeoIndustry {
  slug: string;
  /** Display name, e.g. "HVAC & Plumbing". */
  name: string;
  /** Lower-case noun phrase for sentences, e.g. "HVAC and plumbing business". */
  noun: string;
  /** Canonical valuator industry (drives the /valuate CTA + /listings filter). */
  category: ValuatorIndustry;
  /** Revenue-multiple band used for the example valuation. */
  low: number;
  high: number;
  /** A typical revenue figure for the worked example. */
  typicalRevenue: number;
  /** One-sentence descriptor of the business type. */
  blurb: string;
  /** What buyers pay a premium for in this type of business. */
  drivers: string[];
}

export interface SeoLocation {
  slug: string;
  /** City/area name, e.g. "Hamilton". */
  name: string;
  province: string;
  country: string;
  /** Grouping used for "nearby" internal links and local context. */
  area: string;
  /** True for the Hamilton/Golden Horseshoe core where FairMark is based. */
  core?: boolean;
  /** Province-level page rather than a city. */
  isProvince?: boolean;
}

export const SEO_INDUSTRIES: SeoIndustry[] = [
  { slug: "hvac-plumbing", name: "HVAC & Plumbing", noun: "HVAC and plumbing business", category: "Construction/Trades", low: 0.5, high: 0.9, typicalRevenue: 1_800_000, blurb: "heating, cooling and plumbing service companies", drivers: ["Recurring maintenance agreements and service contracts", "Licensed technicians who can run jobs without the owner", "A loyal, repeat residential and commercial customer base", "A well-maintained, fully-equipped service fleet"] },
  { slug: "electrical-contracting", name: "Electrical Contracting", noun: "electrical contracting business", category: "Construction/Trades", low: 0.5, high: 0.9, typicalRevenue: 1_600_000, blurb: "residential and commercial electrical contractors", drivers: ["Licensed electricians and a strong safety record", "Repeat commercial accounts and service work", "A backlog of contracted projects", "Established supplier and GC relationships"] },
  { slug: "landscaping-lawn-care", name: "Landscaping & Lawn Care", noun: "landscaping and lawn-care business", category: "Construction/Trades", low: 0.4, high: 0.8, typicalRevenue: 1_200_000, blurb: "landscaping, lawn-care and snow-removal operators", drivers: ["Recurring seasonal maintenance contracts", "A mix of residential and commercial accounts", "Owned equipment and a trained crew", "Snow or off-season revenue that smooths seasonality"] },
  { slug: "auto-repair", name: "Auto Repair & Collision", noun: "auto repair and collision business", category: "Construction/Trades", low: 0.4, high: 0.8, typicalRevenue: 1_500_000, blurb: "auto repair, service and collision shops", drivers: ["Insurer direct-repair relationships", "Licensed technicians and modern equipment", "A base of repeat retail and fleet customers", "A well-located, well-equipped facility"] },
  { slug: "dental-practice", name: "Dental Practice", noun: "dental practice", category: "Healthcare", low: 0.7, high: 1.3, typicalRevenue: 1_400_000, blurb: "general and family dental practices", drivers: ["A loyal recall patient base with high retention", "Associate dentists and hygienists in place", "Modern, well-equipped operatories", "Strong hygiene revenue and recall systems"] },
  { slug: "medical-clinic", name: "Medical & Physio Clinic", noun: "medical or physiotherapy clinic", category: "Healthcare", low: 0.6, high: 1.2, typicalRevenue: 1_200_000, blurb: "physiotherapy, chiropractic and multidisciplinary clinics", drivers: ["A diversified roster of practitioners", "Recurring treatment plans and referral flow", "Strong insurer and WSIB caseloads", "Low owner clinical dependence"] },
  { slug: "restaurant", name: "Restaurant", noun: "restaurant", category: "Restaurant/Food", low: 0.3, high: 0.5, typicalRevenue: 1_500_000, blurb: "full-service and quick-service restaurants", drivers: ["A tenured kitchen and front-of-house team", "A prime, high-traffic location and lease", "A recognizable local brand and repeat covers", "Catering, takeout or delivery revenue streams"] },
  { slug: "cafe-coffee-shop", name: "Café & Coffee Shop", noun: "café or coffee shop", category: "Restaurant/Food", low: 0.3, high: 0.6, typicalRevenue: 900_000, blurb: "cafés, coffee shops and roasters", drivers: ["A loyal daily customer base", "A strong location and foot traffic", "Wholesale or online revenue beyond the counter", "A recognizable local brand"] },
  { slug: "retail-store", name: "Retail Store", noun: "retail business", category: "Retail", low: 0.3, high: 0.6, typicalRevenue: 1_100_000, blurb: "independent and specialty retail stores", drivers: ["A strong location and local brand", "Healthy inventory turns and margins", "Repeat customers and a mailing list", "An omni-channel or e-commerce presence"] },
  { slug: "ecommerce", name: "E-commerce Business", noun: "e-commerce business", category: "Retail", low: 0.6, high: 1.4, typicalRevenue: 1_000_000, blurb: "online and direct-to-consumer brands", drivers: ["Repeat purchase rate and a loyal customer list", "Diversified, defensible traffic sources", "Healthy contribution margins after ad spend", "Owned brand and product differentiation"] },
  { slug: "manufacturing", name: "Manufacturing & Fabrication", noun: "manufacturing business", category: "Manufacturing", low: 0.5, high: 1.0, typicalRevenue: 4_500_000, blurb: "precision manufacturing and metal-fabrication shops", drivers: ["Diversified long-term customer contracts", "Modern equipment and a skilled workforce", "Documented processes and quality certifications", "Owned or secure facilities"] },
  { slug: "accounting-firm", name: "Accounting & Bookkeeping Firm", noun: "accounting or bookkeeping firm", category: "Professional Services", low: 0.9, high: 1.5, typicalRevenue: 900_000, blurb: "accounting, tax and bookkeeping practices", drivers: ["Recurring annual client relationships", "High client retention and predictable revenue", "Staff who service clients without the owner", "A diversified book with no single large client"] },
  { slug: "marketing-agency", name: "Marketing & Creative Agency", noun: "marketing or creative agency", category: "Professional Services", low: 0.6, high: 1.2, typicalRevenue: 1_600_000, blurb: "marketing, advertising and creative agencies", drivers: ["Recurring monthly retainers", "Long average client tenure", "A delivery team that runs without the founder", "Diversified clients across industries"] },
  { slug: "cleaning-facility-services", name: "Cleaning & Facility Services", noun: "commercial cleaning or facility-services business", category: "Professional Services", low: 0.5, high: 1.0, typicalRevenue: 2_000_000, blurb: "commercial cleaning and facility-services companies", drivers: ["Multi-year recurring contracts", "High revenue retention", "Supervised crews and documented operations", "Blue-chip institutional clients"] },
  { slug: "saas-software", name: "SaaS & Software", noun: "software or SaaS business", category: "Technology", low: 1.5, high: 4.0, typicalRevenue: 1_200_000, blurb: "B2B SaaS and software companies", drivers: ["High recurring (subscription) revenue", "Strong net revenue retention", "Healthy gross margins", "A defensible niche and expansion roadmap"] },
  { slug: "property-management", name: "Property Management", noun: "property management business", category: "Real Estate", low: 0.8, high: 1.6, typicalRevenue: 1_300_000, blurb: "residential and commercial property managers", drivers: ["Long-term recurring management contracts", "A sticky portfolio of doors under management", "Diversified owners and properties", "Systems and staff that run day-to-day"] },
  { slug: "veterinary-clinic", name: "Veterinary Clinic", noun: "veterinary clinic", category: "Healthcare", low: 0.9, high: 1.8, typicalRevenue: 1_300_000, blurb: "veterinary practices and animal hospitals", drivers: ["A loyal, recurring client and patient base", "Associate veterinarians and techs in place", "Strong recall and preventive-care revenue", "Modern equipment and a good location"] },
  { slug: "insurance-agency", name: "Insurance Agency", noun: "insurance agency", category: "Professional Services", low: 1.5, high: 3.0, typicalRevenue: 900_000, blurb: "insurance agencies and brokerages", drivers: ["Recurring commission and renewal revenue", "High policy-retention rates", "A diversified book of business", "Carrier relationships and licensed producers"] },
  { slug: "law-firm", name: "Law Firm", noun: "law firm", category: "Professional Services", low: 0.6, high: 1.2, typicalRevenue: 1_200_000, blurb: "law firms and legal practices", drivers: ["Recurring and referral-driven client work", "Associates and staff who service matters", "A diversified practice mix", "A strong local reputation and brand"] },
  { slug: "fitness-gym", name: "Fitness & Gym", noun: "fitness or gym business", category: "Retail", low: 0.4, high: 0.9, typicalRevenue: 900_000, blurb: "gyms, studios and fitness businesses", drivers: ["Recurring membership revenue", "Strong member retention", "A good location and facility", "A recognizable local brand and community"] },
  { slug: "salon-spa", name: "Salon & Spa", noun: "salon or spa", category: "Retail", low: 0.3, high: 0.7, typicalRevenue: 700_000, blurb: "hair salons, spas and beauty businesses", drivers: ["A loyal, repeat client base", "Tenured stylists and practitioners", "Retail product revenue", "A strong location and brand"] },
  { slug: "pest-control", name: "Pest Control", noun: "pest-control business", category: "Construction/Trades", low: 0.8, high: 1.6, typicalRevenue: 1_300_000, blurb: "pest-control and extermination companies", drivers: ["Recurring service contracts and routes", "High customer retention", "Licensed, trained technicians", "Diversified residential and commercial accounts"] },
  { slug: "roofing", name: "Roofing", noun: "roofing business", category: "Construction/Trades", low: 0.4, high: 0.8, typicalRevenue: 1_700_000, blurb: "residential and commercial roofing contractors", drivers: ["A strong referral and repeat-customer base", "Insurance and commercial work", "Trained crews and a safety record", "A backlog of booked projects"] },
  { slug: "childcare-daycare", name: "Childcare & Daycare", noun: "childcare or daycare business", category: "Professional Services", low: 0.6, high: 1.3, typicalRevenue: 1_100_000, blurb: "daycares and childcare centres", drivers: ["Full enrolment with a waitlist", "Recurring, predictable tuition revenue", "Licensed facilities and qualified staff", "A strong reputation with local families"] },
  { slug: "self-storage", name: "Self-Storage", noun: "self-storage business", category: "Real Estate", low: 2.0, high: 4.0, typicalRevenue: 1_200_000, blurb: "self-storage facilities", drivers: ["High occupancy and recurring rental income", "Strong margins and low staffing needs", "A good location with limited competition", "Room to add units or raise rates"] },
];

export const SEO_LOCATIONS: SeoLocation[] = [
  // ── Ontario (FairMark's home market) ──
  // Hamilton & Area (home turf)
  { slug: "hamilton", name: "Hamilton", province: "Ontario", country: "Canada", area: "Hamilton & Area", core: true },
  { slug: "stoney-creek", name: "Stoney Creek", province: "Ontario", country: "Canada", area: "Hamilton & Area", core: true },
  { slug: "ancaster", name: "Ancaster", province: "Ontario", country: "Canada", area: "Hamilton & Area", core: true },
  { slug: "dundas", name: "Dundas", province: "Ontario", country: "Canada", area: "Hamilton & Area", core: true },
  { slug: "waterdown", name: "Waterdown", province: "Ontario", country: "Canada", area: "Hamilton & Area", core: true },
  { slug: "grimsby", name: "Grimsby", province: "Ontario", country: "Canada", area: "Hamilton & Area", core: true },
  // Halton
  { slug: "burlington", name: "Burlington", province: "Ontario", country: "Canada", area: "Halton", core: true },
  { slug: "oakville", name: "Oakville", province: "Ontario", country: "Canada", area: "Halton" },
  { slug: "milton", name: "Milton", province: "Ontario", country: "Canada", area: "Halton" },
  { slug: "georgetown", name: "Georgetown", province: "Ontario", country: "Canada", area: "Halton" },
  // Niagara
  { slug: "st-catharines", name: "St. Catharines", province: "Ontario", country: "Canada", area: "Niagara" },
  { slug: "niagara-falls", name: "Niagara Falls", province: "Ontario", country: "Canada", area: "Niagara" },
  { slug: "welland", name: "Welland", province: "Ontario", country: "Canada", area: "Niagara" },
  // Greater Toronto
  { slug: "toronto", name: "Toronto", province: "Ontario", country: "Canada", area: "Greater Toronto" },
  { slug: "mississauga", name: "Mississauga", province: "Ontario", country: "Canada", area: "Greater Toronto" },
  { slug: "brampton", name: "Brampton", province: "Ontario", country: "Canada", area: "Greater Toronto" },
  // York Region
  { slug: "vaughan", name: "Vaughan", province: "Ontario", country: "Canada", area: "York Region" },
  { slug: "markham", name: "Markham", province: "Ontario", country: "Canada", area: "York Region" },
  { slug: "richmond-hill", name: "Richmond Hill", province: "Ontario", country: "Canada", area: "York Region" },
  { slug: "newmarket", name: "Newmarket", province: "Ontario", country: "Canada", area: "York Region" },
  // Durham Region
  { slug: "oshawa", name: "Oshawa", province: "Ontario", country: "Canada", area: "Durham Region" },
  { slug: "whitby", name: "Whitby", province: "Ontario", country: "Canada", area: "Durham Region" },
  { slug: "ajax", name: "Ajax", province: "Ontario", country: "Canada", area: "Durham Region" },
  { slug: "pickering", name: "Pickering", province: "Ontario", country: "Canada", area: "Durham Region" },
  // Waterloo Region
  { slug: "kitchener", name: "Kitchener", province: "Ontario", country: "Canada", area: "Waterloo Region" },
  { slug: "waterloo", name: "Waterloo", province: "Ontario", country: "Canada", area: "Waterloo Region" },
  { slug: "cambridge", name: "Cambridge", province: "Ontario", country: "Canada", area: "Waterloo Region" },
  { slug: "guelph", name: "Guelph", province: "Ontario", country: "Canada", area: "Waterloo Region" },
  // Southwestern Ontario
  { slug: "london", name: "London", province: "Ontario", country: "Canada", area: "Southwestern Ontario" },
  { slug: "brantford", name: "Brantford", province: "Ontario", country: "Canada", area: "Southwestern Ontario" },
  { slug: "woodstock", name: "Woodstock", province: "Ontario", country: "Canada", area: "Southwestern Ontario" },
  { slug: "sarnia", name: "Sarnia", province: "Ontario", country: "Canada", area: "Southwestern Ontario" },
  { slug: "windsor", name: "Windsor", province: "Ontario", country: "Canada", area: "Southwestern Ontario" },
  { slug: "chatham", name: "Chatham", province: "Ontario", country: "Canada", area: "Southwestern Ontario" },
  // Eastern Ontario
  { slug: "ottawa", name: "Ottawa", province: "Ontario", country: "Canada", area: "Eastern Ontario" },
  { slug: "kingston", name: "Kingston", province: "Ontario", country: "Canada", area: "Eastern Ontario" },
  { slug: "belleville", name: "Belleville", province: "Ontario", country: "Canada", area: "Eastern Ontario" },
  // Central & Northern Ontario
  { slug: "barrie", name: "Barrie", province: "Ontario", country: "Canada", area: "Central Ontario" },
  { slug: "peterborough", name: "Peterborough", province: "Ontario", country: "Canada", area: "Central Ontario" },
  { slug: "sudbury", name: "Sudbury", province: "Ontario", country: "Canada", area: "Northern Ontario" },
  { slug: "thunder-bay", name: "Thunder Bay", province: "Ontario", country: "Canada", area: "Northern Ontario" },
  { slug: "ontario", name: "Ontario", province: "Ontario", country: "Canada", area: "Province", isProvince: true },

  // ── British Columbia ──
  { slug: "british-columbia", name: "British Columbia", province: "British Columbia", country: "Canada", area: "Province", isProvince: true },
  { slug: "vancouver", name: "Vancouver", province: "British Columbia", country: "Canada", area: "British Columbia" },
  { slug: "surrey", name: "Surrey", province: "British Columbia", country: "Canada", area: "British Columbia" },
  { slug: "victoria", name: "Victoria", province: "British Columbia", country: "Canada", area: "British Columbia" },
  { slug: "kelowna", name: "Kelowna", province: "British Columbia", country: "Canada", area: "British Columbia" },
  // ── Alberta ──
  { slug: "alberta", name: "Alberta", province: "Alberta", country: "Canada", area: "Province", isProvince: true },
  { slug: "calgary", name: "Calgary", province: "Alberta", country: "Canada", area: "Alberta" },
  { slug: "edmonton", name: "Edmonton", province: "Alberta", country: "Canada", area: "Alberta" },
  { slug: "red-deer", name: "Red Deer", province: "Alberta", country: "Canada", area: "Alberta" },
  // ── Quebec ──
  { slug: "quebec", name: "Quebec", province: "Quebec", country: "Canada", area: "Province", isProvince: true },
  { slug: "montreal", name: "Montreal", province: "Quebec", country: "Canada", area: "Quebec" },
  { slug: "quebec-city", name: "Quebec City", province: "Quebec", country: "Canada", area: "Quebec" },
  { slug: "gatineau", name: "Gatineau", province: "Quebec", country: "Canada", area: "Quebec" },
  // ── Manitoba ──
  { slug: "manitoba", name: "Manitoba", province: "Manitoba", country: "Canada", area: "Province", isProvince: true },
  { slug: "winnipeg", name: "Winnipeg", province: "Manitoba", country: "Canada", area: "Manitoba" },
  // ── Saskatchewan ──
  { slug: "saskatchewan", name: "Saskatchewan", province: "Saskatchewan", country: "Canada", area: "Province", isProvince: true },
  { slug: "saskatoon", name: "Saskatoon", province: "Saskatchewan", country: "Canada", area: "Saskatchewan" },
  { slug: "regina", name: "Regina", province: "Saskatchewan", country: "Canada", area: "Saskatchewan" },
  // ── Atlantic Canada ──
  { slug: "nova-scotia", name: "Nova Scotia", province: "Nova Scotia", country: "Canada", area: "Province", isProvince: true },
  { slug: "halifax", name: "Halifax", province: "Nova Scotia", country: "Canada", area: "Nova Scotia" },
  { slug: "new-brunswick", name: "New Brunswick", province: "New Brunswick", country: "Canada", area: "Province", isProvince: true },
  { slug: "moncton", name: "Moncton", province: "New Brunswick", country: "Canada", area: "New Brunswick" },
  { slug: "fredericton", name: "Fredericton", province: "New Brunswick", country: "Canada", area: "New Brunswick" },
  { slug: "newfoundland-and-labrador", name: "Newfoundland and Labrador", province: "Newfoundland and Labrador", country: "Canada", area: "Province", isProvince: true },
  { slug: "st-johns", name: "St. John's", province: "Newfoundland and Labrador", country: "Canada", area: "Newfoundland and Labrador" },
  { slug: "prince-edward-island", name: "Prince Edward Island", province: "Prince Edward Island", country: "Canada", area: "Province", isProvince: true },
  { slug: "charlottetown", name: "Charlottetown", province: "Prince Edward Island", country: "Canada", area: "Prince Edward Island" },

  // ── United States ──
  { slug: "california", name: "California", province: "California", country: "United States", area: "Province", isProvince: true },
  { slug: "los-angeles", name: "Los Angeles", province: "California", country: "United States", area: "California" },
  { slug: "san-diego", name: "San Diego", province: "California", country: "United States", area: "California" },
  { slug: "san-francisco", name: "San Francisco", province: "California", country: "United States", area: "California" },
  { slug: "texas", name: "Texas", province: "Texas", country: "United States", area: "Province", isProvince: true },
  { slug: "houston", name: "Houston", province: "Texas", country: "United States", area: "Texas" },
  { slug: "dallas", name: "Dallas", province: "Texas", country: "United States", area: "Texas" },
  { slug: "austin", name: "Austin", province: "Texas", country: "United States", area: "Texas" },
  { slug: "san-antonio", name: "San Antonio", province: "Texas", country: "United States", area: "Texas" },
  { slug: "florida", name: "Florida", province: "Florida", country: "United States", area: "Province", isProvince: true },
  { slug: "miami", name: "Miami", province: "Florida", country: "United States", area: "Florida" },
  { slug: "orlando", name: "Orlando", province: "Florida", country: "United States", area: "Florida" },
  { slug: "tampa", name: "Tampa", province: "Florida", country: "United States", area: "Florida" },
  { slug: "new-york", name: "New York", province: "New York", country: "United States", area: "Province", isProvince: true },
  { slug: "new-york-city", name: "New York City", province: "New York", country: "United States", area: "New York" },
  { slug: "buffalo", name: "Buffalo", province: "New York", country: "United States", area: "New York" },
  { slug: "illinois", name: "Illinois", province: "Illinois", country: "United States", area: "Province", isProvince: true },
  { slug: "chicago", name: "Chicago", province: "Illinois", country: "United States", area: "Illinois" },
  { slug: "pennsylvania", name: "Pennsylvania", province: "Pennsylvania", country: "United States", area: "Province", isProvince: true },
  { slug: "philadelphia", name: "Philadelphia", province: "Pennsylvania", country: "United States", area: "Pennsylvania" },
  { slug: "pittsburgh", name: "Pittsburgh", province: "Pennsylvania", country: "United States", area: "Pennsylvania" },
  { slug: "ohio", name: "Ohio", province: "Ohio", country: "United States", area: "Province", isProvince: true },
  { slug: "columbus", name: "Columbus", province: "Ohio", country: "United States", area: "Ohio" },
  { slug: "cleveland", name: "Cleveland", province: "Ohio", country: "United States", area: "Ohio" },
  { slug: "georgia", name: "Georgia", province: "Georgia", country: "United States", area: "Province", isProvince: true },
  { slug: "atlanta", name: "Atlanta", province: "Georgia", country: "United States", area: "Georgia" },
  { slug: "north-carolina", name: "North Carolina", province: "North Carolina", country: "United States", area: "Province", isProvince: true },
  { slug: "charlotte", name: "Charlotte", province: "North Carolina", country: "United States", area: "North Carolina" },
  { slug: "raleigh", name: "Raleigh", province: "North Carolina", country: "United States", area: "North Carolina" },
  { slug: "michigan", name: "Michigan", province: "Michigan", country: "United States", area: "Province", isProvince: true },
  { slug: "detroit", name: "Detroit", province: "Michigan", country: "United States", area: "Michigan" },
  { slug: "washington", name: "Washington", province: "Washington", country: "United States", area: "Province", isProvince: true },
  { slug: "seattle", name: "Seattle", province: "Washington", country: "United States", area: "Washington" },
  { slug: "arizona", name: "Arizona", province: "Arizona", country: "United States", area: "Province", isProvince: true },
  { slug: "phoenix", name: "Phoenix", province: "Arizona", country: "United States", area: "Arizona" },
  { slug: "massachusetts", name: "Massachusetts", province: "Massachusetts", country: "United States", area: "Province", isProvince: true },
  { slug: "boston", name: "Boston", province: "Massachusetts", country: "United States", area: "Massachusetts" },
  { slug: "colorado", name: "Colorado", province: "Colorado", country: "United States", area: "Province", isProvince: true },
  { slug: "denver", name: "Denver", province: "Colorado", country: "United States", area: "Colorado" },
];

// ── Lookups ──────────────────────────────────────────────────────────────────

const INDUSTRY_BY_SLUG = new Map(SEO_INDUSTRIES.map((i) => [i.slug, i]));
const LOCATION_BY_SLUG = new Map(SEO_LOCATIONS.map((l) => [l.slug, l]));

export function getSeoIndustry(slug: string): SeoIndustry | undefined {
  return INDUSTRY_BY_SLUG.get(slug);
}
export function getSeoLocation(slug: string): SeoLocation | undefined {
  return LOCATION_BY_SLUG.get(slug);
}

/** Human location string, e.g. "Hamilton, Ontario" or "Ontario". */
export function locationLabel(l: SeoLocation): string {
  return l.isProvince ? l.province : `${l.name}, ${l.province}`;
}

/** Correct indefinite article for an industry name ("an HVAC", "a dental …"). */
export function indefinite(i: SeoIndustry): "a" | "an" {
  if (i.slug === "hvac-plumbing") return "an"; // sounds like "aitch"
  const first = i.name.toLowerCase().replace(/[^a-z]+/g, " ").trim().charAt(0);
  return /[aeiou]/.test(first) ? "an" : "a";
}
export function indefiniteCap(i: SeoIndustry): "A" | "An" {
  return indefinite(i) === "an" ? "An" : "A";
}

/** Up to `limit` nearby cities for local internal links: same sub-region first,
 *  then same province/state. Province pages fall through to their own cities. */
export function nearbyLocations(l: SeoLocation, limit = 6): SeoLocation[] {
  const cities = SEO_LOCATIONS.filter((o) => o.slug !== l.slug && !o.isProvince);
  const sameArea = cities.filter((o) => o.area === l.area);
  const sameProvince = cities.filter(
    (o) => o.province === l.province && o.area !== l.area
  );
  return [...sameArea, ...sameProvince].slice(0, limit);
}

export interface ProvinceGroup {
  province: string;
  country: string;
  provinceSlug?: string;
  cities: SeoLocation[];
}

/** Locations grouped by province/state (in listed order) for hub pages. */
export function locationGroups(): ProvinceGroup[] {
  const order: string[] = [];
  const map = new Map<string, ProvinceGroup>();
  for (const l of SEO_LOCATIONS) {
    if (!map.has(l.province)) {
      order.push(l.province);
      map.set(l.province, { province: l.province, country: l.country, cities: [] });
    }
    const g = map.get(l.province)!;
    if (l.isProvince) g.provinceSlug = l.slug;
    else g.cities.push(l);
  }
  return order.map((p) => map.get(p)!);
}

/** Other business types for cross-linking within a location. */
export function otherIndustries(current: SeoIndustry, limit = 6): SeoIndustry[] {
  return SEO_INDUSTRIES.filter((i) => i.slug !== current.slug).slice(0, limit);
}

/** Every industry × location combination (for params + sitemap). */
export function allSellCombos(): { industry: string; location: string }[] {
  const out: { industry: string; location: string }[] = [];
  for (const i of SEO_INDUSTRIES) {
    for (const l of SEO_LOCATIONS) out.push({ industry: i.slug, location: l.slug });
  }
  return out;
}
