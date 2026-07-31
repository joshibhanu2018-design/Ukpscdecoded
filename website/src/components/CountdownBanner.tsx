"use client";

import { useEffect, useState } from "react";
import { Clock, Flame } from "lucide-react";

interface CountdownBannerProps {
  deadline: string;
  badge?: string;
  headline: string;
  subtext?: string;
  stockNote?: string;
}

function getTimeLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownBanner({
  deadline,
  badge,
  headline,
  subtext,
  stockNote,
}: CountdownBannerProps) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(deadline));
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(deadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  // Don't render if expired
  if (mounted && !timeLeft) return null;

  const units = [
    { label: "Days", value: timeLeft?.days ?? 0 },
    { label: "Hrs", value: timeLeft?.hours ?? 0 },
    { label: "Min", value: timeLeft?.minutes ?? 0 },
    { label: "Sec", value: timeLeft?.seconds ?? 0 },
  ];

  return (
    <div className="bg-gradient-to-r from-saffron-600 via-saffron-500 to-saffron-600 text-white">
      <div className="container-custom px-4 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
          <div className="text-center sm:text-left">
            {badge && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/20 rounded-full px-3 py-1 mb-1.5">
                <Flame className="w-3.5 h-3.5" /> {badge}
              </span>
            )}
            <p className="font-display font-bold text-base sm:text-lg leading-tight">
              {headline}
            </p>
            {subtext && (
              <p className="text-xs sm:text-sm text-white/90 mt-0.5">{subtext}</p>
            )}
            {stockNote && (
              <p className="text-xs text-white/80 mt-1 flex items-center justify-center sm:justify-start gap-1">
                <Clock className="w-3 h-3" /> {stockNote}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {units.map((unit) => (
              <div
                key={unit.label}
                className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-center min-w-[3rem]"
              >
                <div className="text-xl sm:text-2xl font-display font-bold tabular-nums">
                  {mounted ? String(unit.value).padStart(2, "0") : "--"}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-white/80">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
