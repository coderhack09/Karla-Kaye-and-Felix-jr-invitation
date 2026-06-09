"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  targetDate: string
}

function getTimeLeft(targetDate: string): TimeLeft {
  const target = new Date(targetDate).getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="min-w-[56px] rounded-xl border border-motif-accent/25 bg-white/50 px-3 py-2.5 text-center sm:min-w-[60px]">
        <span
          className="font-mono text-xl font-bold sm:text-2xl"
          style={{ color: "var(--color-motif-deep)" }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span
        className="text-[9px] uppercase tracking-widest"
        style={{ color: "var(--color-motif-medium)" }}
      >
        {label}
      </span>
    </div>
  )
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <Unit value={timeLeft.days} label="Days" />
      <span style={{ color: "var(--color-motif-accent)" }}>:</span>
      <Unit value={timeLeft.hours} label="Hours" />
      <span style={{ color: "var(--color-motif-accent)" }}>:</span>
      <Unit value={timeLeft.minutes} label="Mins" />
      <span style={{ color: "var(--color-motif-accent)" }}>:</span>
      <Unit value={timeLeft.seconds} label="Secs" />
    </div>
  )
}
