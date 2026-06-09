"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { useSiteConfig } from "@/hooks/use-site-config"

const SHOW_BUTTERFLIES = false

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

const textColor = "color-mix(in srgb, var(--color-motif-cream) 50%, white)"

const primaryBtnClass =
  "cursor-pointer rounded-full border border-motif-soft bg-motif-soft px-5 py-3 text-[9px] font-bold tracking-[0.16em] uppercase shadow-[0_8px_24px_rgba(15,28,63,0.18)] transition-all duration-300 hover:bg-[color-mix(in_srgb,var(--color-motif-soft)_85%,black)] hover:border-[color-mix(in_srgb,var(--color-motif-soft)_85%,black)] hover:shadow-xl hover:-translate-y-0.5 sm:px-7 sm:py-3.5 sm:text-[10px] sm:tracking-[0.18em] md:px-8 md:py-4 md:text-[11px]"

function MotifDivider() {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="h-px w-10 rounded-full bg-motif-accent/60 sm:w-14" />
      <div className="flex gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-80" />
        <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-50" />
        <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-80" />
      </div>
      <span className="h-px w-10 rounded-full bg-motif-accent/60 sm:w-14" />
    </div>
  )
}

function CoupleNamesHero({
  brideNickname,
  groomNickname,
}: {
  brideNickname: string
  groomNickname: string
}) {
  return (
    <div
      className="relative z-10 flex w-full flex-col items-center leading-none"
      style={{ ...playlistScriptStyle, color: textColor }}
    >
      <motion.span
        aria-hidden
        className="absolute -top-3 left-[18%] h-2 w-2 rounded-full bg-motif-accent/70 sm:-top-4 sm:left-[22%] sm:h-2.5 sm:w-2.5"
        animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8], y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        aria-hidden
        className="absolute -top-2 right-[16%] h-1.5 w-1.5 rounded-full bg-motif-accent/60 sm:-top-3 sm:right-[20%] sm:h-2 sm:w-2"
        animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.9, 1.25, 0.9], y: [0, -5, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
      />
      <span className="text-[clamp(3.5rem,20vw,6rem)] drop-shadow-sm sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem]">
        {brideNickname}
      </span>
      <span
        className="relative my-1 text-2xl opacity-70 sm:my-2 sm:text-3xl md:text-4xl"
        style={{ color: textColor }}
      >
        <motion.span
          aria-hidden
          className="absolute -inset-6 rounded-full border border-motif-accent/20 sm:-inset-8"
          animate={{ rotate: 360, scale: [1, 1.06, 1] }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        +
      </span>
      <span className="text-[clamp(3.5rem,20vw,6rem)] drop-shadow-sm sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem]">
        {groomNickname}
      </span>
    </div>
  )
}

export function Hero() {
  const siteConfig = useSiteConfig()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const [weddingMonth = "June", weddingDayRaw = "7", weddingYear = "2026"] =
    siteConfig.wedding.date.split(" ")
  const weddingDayNumber = weddingDayRaw.replace(/[^0-9]/g, "") || "7"
  const ceremonyTime = siteConfig.wedding.time
  const ceremonyDayShort = siteConfig.ceremony.day
    ? siteConfig.ceremony.day.slice(0, 3).toUpperCase()
    : "THU"

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent"
    >
      {SHOW_BUTTERFLIES && (
        <>
          {/* Realistic Butterflies flying in lower part near flowers */}
          <style jsx>{`
            @keyframes flutter {
              0% { transform: rotateX(0deg); }
              50% { transform: rotateX(75deg); }
              100% { transform: rotateX(0deg); }
            }
            
            @keyframes flutter-left {
              0% { transform: rotateX(0deg) rotateY(2deg); }
              50% { transform: rotateX(70deg) rotateY(5deg); }
              100% { transform: rotateX(0deg) rotateY(2deg); }
            }
            
            @keyframes flutter-right {
              0% { transform: rotateX(0deg) rotateY(-2deg); }
              50% { transform: rotateX(70deg) rotateY(-5deg); }
              100% { transform: rotateX(0deg) rotateY(-2deg); }
            }
            
            .butterfly-wing {
              transform-origin: 50% 50%;
            }
            
            .butterfly-wing-left {
              animation: flutter-left 180ms ease-in-out infinite;
            }
            
            .butterfly-wing-right {
              animation: flutter-right 180ms ease-in-out infinite;
              animation-delay: 90ms;
            }
          `}</style>

          {/* Butterfly 1 - Flying at CTA button level */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{ 
              perspective: '1000px',
              bottom: '15%',
              left: 0,
              width: '100%',
            }}
            initial={{ x: '5%', y: 0 }}
            animate={{
              x: ['5%', '15%', '30%', '50%', '70%', '85%', '75%', '55%', '30%', '10%', '5%'],
              y: [0, 15, 8, -5, 12, 5, 18, 10, -8, 5, 0],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 8, 12, 5, -3, -8, -5, 2, 10, 6, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 120 120"
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              >
                <g className="butterfly-wing butterfly-wing-left">
                  <path
                    d="M 60 60 Q 35 50 25 35 Q 18 25 20 18 Q 25 10 32 15 Q 40 20 45 30 Q 52 45 60 60"
                    fill="#FFBD87"
                    opacity="0.95"
                  />
                  <path
                    d="M 60 60 Q 40 55 32 45 Q 28 38 30 32 Q 33 28 38 32 Q 43 36 48 45 Q 55 52 60 60"
                    fill="#FCB8B5"
                    opacity="0.85"
                  />
                  <ellipse cx="35" cy="30" rx="8" ry="10" fill="#FFE5B4" opacity="0.7" />
                  <circle cx="38" cy="35" r="3" fill="#E6A27A" opacity="0.8" />
                  <circle cx="30" cy="25" r="2" fill="#FCB8B5" opacity="0.9" />
                  <path
                    d="M 60 65 Q 45 72 35 80 Q 28 86 30 92 Q 35 98 42 93 Q 48 88 52 80 Q 57 72 60 65"
                    fill="#FFBD87"
                    opacity="0.9"
                  />
                  <path
                    d="M 60 65 Q 48 70 40 76 Q 36 80 38 84 Q 41 88 45 84 Q 49 80 54 74 Q 58 69 60 65"
                    fill="#FCB8B5"
                    opacity="0.75"
                  />
                </g>
                <g className="butterfly-wing butterfly-wing-right">
                  <path
                    d="M 60 60 Q 85 50 95 35 Q 102 25 100 18 Q 95 10 88 15 Q 80 20 75 30 Q 68 45 60 60"
                    fill="#FFBD87"
                    opacity="0.95"
                  />
                  <path
                    d="M 60 60 Q 80 55 88 45 Q 92 38 90 32 Q 87 28 82 32 Q 77 36 72 45 Q 65 52 60 60"
                    fill="#FCB8B5"
                    opacity="0.85"
                  />
                  <ellipse cx="85" cy="30" rx="8" ry="10" fill="#FFE5B4" opacity="0.7" />
                  <circle cx="82" cy="35" r="3" fill="#E6A27A" opacity="0.8" />
                  <circle cx="90" cy="25" r="2" fill="#FCB8B5" opacity="0.9" />
                  <path
                    d="M 60 65 Q 75 72 85 80 Q 92 86 90 92 Q 85 98 78 93 Q 72 88 68 80 Q 63 72 60 65"
                    fill="#FFBD87"
                    opacity="0.9"
                  />
                  <path
                    d="M 60 65 Q 72 70 80 76 Q 84 80 82 84 Q 79 88 75 84 Q 71 80 66 74 Q 62 69 60 65"
                    fill="#FCB8B5"
                    opacity="0.75"
                  />
                </g>
                <g className="butterfly-body">
                  <ellipse cx="60" cy="65" rx="3.5" ry="28" fill="#654321" />
                  <ellipse cx="60" cy="64" rx="2.5" ry="25" fill="#8B6F47" />
                  <ellipse cx="60" cy="63" rx="2" ry="22" fill="#A0826D" />
                  <circle cx="60" cy="55" r="4" fill="#4A3423" />
                  <ellipse cx="60" cy="75" rx="2.5" ry="10" fill="#654321" />
                  <line x1="60" y1="55" x2="55" y2="45" stroke="#4A3423" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="60" y1="55" x2="65" y2="45" stroke="#4A3423" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="55" cy="45" r="2" fill="#654321" />
                  <circle cx="65" cy="45" r="2" fill="#654321" />
                </g>
              </svg>
            </motion.div>
          </motion.div>
        </>
      )}

      <div className="relative z-10 container mx-auto flex min-h-screen w-full flex-col items-center justify-center px-5 pt-20 pb-12 sm:px-8 sm:pt-24 sm:pb-16 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 sm:max-w-4xl sm:gap-7 md:gap-9"
        >
          <p
            className={`${cormorant.className} px-1 text-center text-[11px] leading-[1.85] font-medium tracking-[0.18em] uppercase sm:px-0 sm:text-sm sm:leading-relaxed sm:tracking-[0.32em]`}
            style={{ color: textColor }}
          >
            Together with our families,
            <br />
            we joyfully invite you to witness our union.
          </p>

          <MotifDivider />

          <CoupleNamesHero
            brideNickname={siteConfig.couple.brideNickname}
            groomNickname={siteConfig.couple.groomNickname}
          />

          <p
            className={`${cinzel.className} text-sm font-medium tracking-[0.18em] uppercase sm:text-base sm:tracking-[0.26em]`}
            style={{ color: textColor }}
          >
            Are Getting Married
          </p>

          {/* Date & Time block */}
          <div className="w-full max-w-2xl mx-auto">
            <div
              className={`${cormorant.className} flex flex-col items-center gap-1.5 sm:gap-2.5 md:gap-3`}
              style={{ color: textColor }}
            >
              <span
                className={`${cinzel.className} text-[0.65rem] sm:text-xs md:text-sm uppercase tracking-[0.4em] sm:tracking-[0.5em] font-light`}
                style={{ color: textColor }}
              >
                {weddingMonth}
              </span>

              <div className="flex w-full items-center gap-2 sm:gap-4 md:gap-5">
                <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2.5">
                  <span className="h-px flex-1 rounded-full bg-motif-accent/60" />
                  <span
                    className={`${cinzel.className} text-[0.6rem] sm:text-[0.7rem] md:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] font-light`}
                    style={{ color: textColor }}
                  >
                    {ceremonyDayShort}
                  </span>
                  <span className="h-px w-6 rounded-full bg-motif-accent/60 sm:w-8 md:w-10" />
                </div>

                <div className="relative flex items-center justify-center px-3 sm:px-4 md:px-5">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 mx-auto h-[70%] max-h-[180px] w-[100px] rounded-full bg-motif-accent/20 blur-[28px] opacity-80 sm:w-[140px] md:w-[170px]"
                  />
                  <span
                    className={`${cinzel.className} relative text-[4rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7rem] font-light leading-none tracking-wider`}
                    style={{
                      color: textColor,
                      textShadow:
                        "0 2px 12px color-mix(in srgb, var(--color-motif-soft) 45%, transparent)",
                    }}
                  >
                    {weddingDayNumber}
                  </span>
                </div>

                <div className="flex flex-1 items-center gap-1.5 sm:gap-2.5">
                  <span className="h-px w-6 rounded-full bg-motif-accent/60 sm:w-8 md:w-10" />
                  <span
                    className={`${cinzel.className} text-[0.6rem] sm:text-[0.7rem] md:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] font-light`}
                    style={{ color: textColor }}
                  >
                    {ceremonyTime.split(",")[0]}
                  </span>
                  <span className="h-px flex-1 rounded-full bg-motif-accent/60" />
                </div>
              </div>

              <span
                className={`${cinzel.className} text-[0.65rem] sm:text-xs md:text-sm uppercase tracking-[0.4em] sm:tracking-[0.5em] font-light`}
                style={{ color: textColor }}
              >
                {weddingYear}
              </span>
            </div>
          </div>

          <p
            className={`${cinzel.className} text-center text-xs font-medium uppercase tracking-[0.22em] sm:text-sm md:text-base sm:tracking-[0.26em] md:tracking-[0.3em]`}
            style={{ color: textColor }}
          >
            {siteConfig.ceremony.location}
          </p>

          <div className="flex w-full max-w-2xl flex-col items-center gap-3 px-4 sm:gap-4">
            <p
              className={`${cormorant.className} text-center text-[13px] leading-[1.75] font-light italic sm:text-base sm:leading-[1.8]`}
              style={{ color: textColor }}
            >
              Your presence, prayers, and love will mean the world to us.
            </p>

            <a
              href="#guest-list"
              className={`${primaryBtnClass} inline-flex min-h-11 min-w-[200px] items-center justify-center sm:min-w-[220px]`}
              style={{ color: textColor }}
            >
              Confirm Attendance
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
