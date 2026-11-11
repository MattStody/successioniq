// Thin, safe wrapper around the Meta Pixel's global `fbq`.
//
// No-ops when the pixel isn't present — in local dev and preview (the pixel is
// production-only), before the script has initialized, or if an ad blocker
// removed it — so callers never have to guard or worry about throwing.
type Fbq = (...args: unknown[]) => void;

export function trackMetaEvent(
  event: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq !== "function") return;
  try {
    fbq("track", event, params);
  } catch {
    // Never let analytics break the user flow.
  }
}
