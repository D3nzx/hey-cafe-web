"use client";

import { useEffect, useState } from "react";
import { getCafeStatus, type CafeHours } from "@/lib/cafe-content";

export function CafeStatus({ hours, compact = false }: { hours: CafeHours[]; compact?: boolean }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const status = getCafeStatus(hours, now);
  return (
    <span className={`cafe-status cafe-status-${status.state}${compact ? " cafe-status-compact" : ""}`}>
      <span className="cafe-status-dot" aria-hidden="true" />
      <strong>{status.label}</strong>
      {status.detail && !compact && <small>Opens {status.detail}</small>}
    </span>
  );
}
