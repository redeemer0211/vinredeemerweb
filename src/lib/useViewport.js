import { useEffect, useState } from "react";

// Matches Tailwind's default breakpoints closely enough for our purposes.
function getBreakpoint(width) {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function useBreakpoint() {
  const [bp, setBp] = useState(() =>
    typeof window === "undefined" ? "desktop" : getBreakpoint(window.innerWidth)
  );

  useEffect(() => {
    function onResize() {
      setBp(getBreakpoint(window.innerWidth));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return bp;
}

// Pick a value per breakpoint, e.g. useResponsiveValue({ mobile: 4, tablet: 6, desktop: 10 })
export function useResponsiveValue({ mobile, tablet, desktop }) {
  const bp = useBreakpoint();
  if (bp === "mobile") return mobile;
  if (bp === "tablet") return tablet;
  return desktop;
}
