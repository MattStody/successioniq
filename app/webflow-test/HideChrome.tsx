"use client";

import { useEffect } from "react";

// Hides the global Mercato nav + footer so this standalone Webflow port renders
// 1:1 like the original (reuses the .funnel-focus rule in globals.css).
export default function HideChrome() {
  useEffect(() => {
    document.body.classList.add("funnel-focus");
    return () => document.body.classList.remove("funnel-focus");
  }, []);
  return null;
}
