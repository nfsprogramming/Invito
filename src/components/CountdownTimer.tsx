"use client";
import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string; // ISO date string
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-3 justify-center flex-wrap">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="countdown-box">
            <div
              className="text-3xl font-bold font-display"
              style={{ color: "var(--accent-gold)", fontFamily: "'Playfair Display', serif" }}
            >
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl font-bold" style={{ color: "var(--accent-gold)" }}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
