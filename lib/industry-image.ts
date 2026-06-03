export function getIndustryImage(industry: string): string {
  const s = industry.toLowerCase();

  if (s.includes("hvac") || s.includes("heating") || s.includes("cooling") || s.includes("air condition"))
    return "/industries/hvac.webp";
  if (s.includes("plumb"))
    return "/industries/plumbing.webp";
  if (s.includes("landscap") || s.includes("garden") || s.includes("lawn") || s.includes("tree"))
    return "/industries/landscaping.webp";
  if (s.includes("construct") || s.includes("trade") || s.includes("contractor") || s.includes("builder") || s.includes("roofing"))
    return "/industries/construction.webp";
  if (s.includes("health") || s.includes("medical") || s.includes("dental") || s.includes("pharma") || s.includes("clinic") || s.includes("care"))
    return "/industries/health.webp";
  if (s.includes("saas") || s.includes("software") || s.includes("platform") || s.includes("app ") || s.includes("app,"))
    return "/industries/saas.webp";
  if (s.includes("tech") || s.includes("it ") || s.includes("digital") || s.includes("cyber") || s.includes("data"))
    return "/industries/it.webp";
  if (s.includes("logistic") || s.includes("transport") || s.includes("shipping") || s.includes("manufactur") || s.includes("warehouse") || s.includes("supply"))
    return "/industries/logistics.webp";
  if (s.includes("retail") || s.includes("restaurant") || s.includes("food") || s.includes("ecommerce") || s.includes("shop") || s.includes("store"))
    return "/industries/retail.webp";
  if (s.includes("professional") || s.includes("consult") || s.includes("legal") || s.includes("account") || s.includes("financ") || s.includes("real estate") || s.includes("insurance"))
    return "/industries/professional services.webp";

  return "/industries/professional services.webp";
}
