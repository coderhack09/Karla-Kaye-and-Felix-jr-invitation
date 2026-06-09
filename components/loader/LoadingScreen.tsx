"use client"

import React, { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { siteConfig } from "@/content/site"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

const playlistScriptStyle = {
  fontFamily: "var(--font-playlist-script)",
  fontWeight: 400,
} as const

interface LoadingScreenProps {
  onComplete: () => void
}

/** Splits a date string like "May 8, 2026" into ["05", "08", "26"] */
function getDateSegments(dateStr: string): string[] {
  const d = new Date(dateStr)
  return [
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
    String(d.getFullYear()).slice(-2),
  ]
}

const GHOST_NUMBERS = getDateSegments(siteConfig.wedding.date)

// ── Canvas particle system ──────────────────────────────────────────────────

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  twinklePhase: number
  twinkleSpeed: number
  colorIdx: number
}

/** Motif palette — matches proposal page silk background */
const PARTICLE_COLORS = [
  "39,  58,  90",   // --color-motif-deep
  "65,  93,  141",  // --color-motif-medium
  "136, 158, 182",  // --color-motif-accent
  "216, 222, 230",  // --color-motif-silver
]

function createParticles(width: number, height: number): Particle[] {
  const count = Math.min(45, Math.max(20, Math.floor((width * height) / 15000)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -(Math.random() * 0.18 + 0.06),   // slow upward drift
    radius: Math.random() * 1.8 + 0.4,
    opacity: Math.random() * 0.35 + 0.20,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.012 + 0.004,
    colorIdx: Math.floor(Math.random() * PARTICLE_COLORS.length),
  }))
}

// ── Component ───────────────────────────────────────────────────────────────

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut]           = useState(false)
  const [progress, setProgress]         = useState(0)
  // phase gates: 0=hidden · 1=names · 2=divider · 3=date · 4=progress
  const [phase, setPhase]               = useState(0)

  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const animFrameRef  = useRef<number>(0)
  const particlesRef  = useRef<Particle[]>([])

  const TOTAL_LOAD_MS = 12000
  const FADE_MS       = 700

  // ── Canvas particle animation ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = createParticles(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let running = true

    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        // Gentle twinkle
        p.twinklePhase += p.twinkleSpeed
        const twinkle   = (Math.sin(p.twinklePhase) + 1) * 0.5
        const alpha     = p.opacity * (0.3 + twinkle * 0.7)
        const color     = PARTICLE_COLORS[p.colorIdx]
        const blurR     = p.radius * 3.5

        // Soft glow circle via radial gradient
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blurR)
        g.addColorStop(0,   `rgba(${color}, ${alpha})`)
        g.addColorStop(0.4, `rgba(${color}, ${alpha * 0.45})`)
        g.addColorStop(1,   `rgba(${color}, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, blurR, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        // Drift
        p.x += p.vx
        p.y += p.vy

        // Wrap
        const { width, height } = canvas
        if (p.y < -20)          { p.y = height + 10; p.x = Math.random() * width }
        if (p.x < -20)            p.x = width + 20
        if (p.x > width + 20)     p.x = -20
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      running = false
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  // ── Staggered content reveal ─────────────────────────────────────────────
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 460),
      setTimeout(() => setPhase(3), 760),
      setTimeout(() => setPhase(4), 990),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // ── Progress counter ─────────────────────────────────────────────────────
  useEffect(() => {
    let rafId = 0
    const start        = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const t    = Math.min(1, (now - start) / TOTAL_LOAD_MS)
      const next = Math.round(easeOutCubic(t) * 100)
      setProgress((prev) => (next > prev ? next : prev))
      if (t < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const fadeTimer = setTimeout(() => setFadeOut(true), TOTAL_LOAD_MS - FADE_MS)
    const doneTimer = setTimeout(() => { setProgress(100); onComplete() }, TOTAL_LOAD_MS)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  // Helper: CSS transition classes based on phase gate
  const vis = (minPhase: number) =>
    phase >= minPhase
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-5 transition-all duration-700 ease-out"

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading invitation"
    >
      {/* Canvas particle field — silk background is provided by the page root */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        style={{ mixBlendMode: "screen" }}
        aria-hidden
      />

      {/* ── Layer 5: Corner floral decorations ── */}
      <Image
        src="/decoration/top-left.png"
        alt=""
        width={280}
        height={280}
        className="absolute top-0 left-0 pointer-events-none select-none w-36 sm:w-48 md:w-60 lg:w-64"
        aria-hidden
        priority
      />
      <Image
        src="/decoration/top-rightn.png"
        alt=""
        width={280}
        height={280}
        className="absolute top-0 right-0 pointer-events-none select-none w-36 sm:w-48 md:w-60 lg:w-64"
        aria-hidden
        priority
      />
      <Image
        src="/decoration/bottom-left.png"
        alt=""
        width={280}
        height={280}
        className="absolute bottom-0 left-0 pointer-events-none select-none w-36 sm:w-48 md:w-60 lg:w-64"
        aria-hidden
      />
      <Image
        src="/decoration/right-bottom.png"
        alt=""
        width={280}
        height={280}
        className="absolute bottom-0 right-0 pointer-events-none select-none w-36 sm:w-48 md:w-60 lg:w-64"
        aria-hidden
      />

      {/* ── Layer 6: Ghost wedding-date watermark (right side) ── */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col items-end justify-center pr-4 sm:pr-8 md:pr-12 lg:pr-16 select-none"
        aria-hidden
      >
        {GHOST_NUMBERS.map((num, i) => (
          <span
            key={`ghost-${num}-${i}`}
            className={`${cinzel.className} leading-[0.82]`}
            style={{
              fontSize: "clamp(5rem, 14vw, 12rem)",
              color: "color-mix(in srgb, var(--color-motif-silver) 12%, transparent)",
              letterSpacing: "-0.04em",
              opacity: phase >= 1 ? 1 : 0,
              transition: `opacity 1.6s ease-out ${i * 150}ms`,
            }}
          >
            {num}
          </span>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className={`${cormorant.className} relative z-10 mx-auto w-full max-w-2xl px-6 text-center sm:px-8`}>
        {/* Couple names — playlist script, same as proposal page */}
        <h1
          className={`leading-none ${vis(1)}`}
          style={{ ...playlistScriptStyle, color: "var(--color-motif-cream)", transitionDelay: "60ms" }}
        >
          <span className="block text-[clamp(4rem,20vw,6.5rem)] sm:text-8xl md:text-9xl lg:text-[10rem]">
            {siteConfig.couple.brideNickname.trim()}
          </span>

          <span
            className="relative my-1 block text-3xl opacity-70 sm:my-2 sm:text-4xl md:text-5xl"
            style={{ color: "var(--color-motif-accent)" }}
          >
            +
          </span>

          <span className="block text-[clamp(4rem,20vw,6.5rem)] sm:text-8xl md:text-9xl lg:text-[10rem]">
            {siteConfig.couple.groomNickname.trim()}
          </span>
        </h1>

        {/* Motif divider — matches proposal page */}
        <div className={`mt-5 mb-2 flex items-center justify-center gap-2 ${vis(2)}`}>
          <span className="h-px w-10 rounded-full bg-motif-accent/60 sm:w-14" />
          <div className="flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-80" />
            <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-50" />
            <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-80" />
          </div>
          <span className="h-px w-10 rounded-full bg-motif-accent/60 sm:w-14" />
        </div>

        {/* Supporting line */}
        {/* <p
          className={`${vis(3)}`}
          style={{
            fontFamily: '"Great Vibes", cursive',
            fontSize: "clamp(1.3rem, 4vw, 1.7rem)",
            color: "rgba(255, 255, 255, 0.48)",
            transitionDelay: "80ms",
          }}
        >
          Together with their families
        </p> */}

        {/* Wedding date */}
        <p
          className={`mt-3 mb-9 text-[10px] leading-relaxed font-medium tracking-[0.28em] uppercase sm:text-xs sm:tracking-[0.32em] ${vis(3)}`}
          style={{ color: "var(--color-motif-silver)" }}
          aria-label={`${siteConfig.ceremony.day}, ${siteConfig.wedding.date} · ${siteConfig.ceremony.time}`}
        >
          <span>{siteConfig.ceremony.day}</span>
          <span className="mx-2" style={{ opacity: 0.5 }} aria-hidden>·</span>
          <span className="tabular-nums">{siteConfig.wedding.date}</span>
          <span className="mx-2" style={{ opacity: 0.5 }} aria-hidden>·</span>
          <span className="tabular-nums">{siteConfig.ceremony.time}</span>
        </p>

        {/* Progress section */}
        <div className={`${vis(4)}`}>
          <p
            className={`${cinzel.className} mb-3.5 text-[10px] font-medium tracking-[0.22em] uppercase sm:text-[11px] sm:tracking-[0.26em]`}
            style={{ color: "var(--color-motif-cream)", opacity: 0.9 }}
          >
            Preparing your invitation
          </p>

          <div
            className="relative mx-auto w-full max-w-[200px]"
            style={{ height: "1px" }}
            role="presentation"
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-motif-accent) 25%, transparent)",
              }}
            />
            <div
              className="absolute inset-y-0 left-0 overflow-hidden rounded-full"
              style={{
                width: `${Math.max(progress, 2)}%`,
                transition: "width 200ms linear",
                background:
                  "linear-gradient(to right, var(--color-motif-soft), var(--color-motif-medium))",
              }}
            >
              <div
                className="absolute inset-y-0 animate-loader-shimmer"
                style={{
                  width: "50px",
                  background:
                    "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--color-motif-cream) 55%, transparent) 50%, transparent 100%)",
                }}
              />
            </div>
          </div>

          <p
            className={`${cinzel.className} mt-4 tabular-nums text-[10px] tracking-[0.3em] sm:text-[11px]`}
            style={{ color: "var(--color-motif-silver)" }}
            aria-live="polite"
          >
            {progress}%
          </p>
        </div>
      </div>
    </div>
  )
}
