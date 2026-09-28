"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Razorpay's checkout sets overflow:hidden on <html>/<body> while open and
// doesn't always undo it (e.g. when the checkout fails to load), which left
// every page unscrollable until a full reload. Nothing else in the site
// locks scrolling this way, so clearing it on each page change is safe.
export default function ScrollUnlock() {
  const pathname = usePathname();

  useEffect(() => {
    for (const el of [document.documentElement, document.body]) {
      el.style.removeProperty("overflow");
      el.style.removeProperty("position");
      el.style.removeProperty("height");
    }
  }, [pathname]);

  return null;
}
