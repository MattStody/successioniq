"use client";

// Keys used to carry intent across the unauthenticated valuation → account
// creation journey (survives the email-confirmation round trip in the same
// browser via localStorage).
export const PENDING_LISTING_KEY = "siq_pending_listing_url";
export const GATE_EMAIL_KEY = "siq_gate_email";

/**
 * Returns the create-listing URL a visitor was headed to before being asked to
 * create an account, clearing it so it's only used once. Null when there's none.
 */
export function consumePendingListingUrl(): string | null {
  if (typeof window === "undefined") return null;
  const url = window.localStorage.getItem(PENDING_LISTING_KEY);
  if (url) window.localStorage.removeItem(PENDING_LISTING_KEY);
  return url;
}
