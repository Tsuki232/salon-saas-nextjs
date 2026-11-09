"use client";

import { useEffect, useState } from "react";
import { formatCOP } from "@/lib/utils";

export function AnimatedNumber({
  value,
  duration = 900,
  currency = false,
}: {
  value: number;
  duration?: number;
  currency?: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    function step(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{currency ? formatCOP(display) : display.toLocaleString("es-CO")}</>;
}
