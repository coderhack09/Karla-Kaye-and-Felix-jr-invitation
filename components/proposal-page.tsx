"use client"

import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react"
import Link from "next/link"
import Silk from "@/components/silk"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import {
  Heart,
  Check,
  X,
  Sparkles,
  MapPin,
} from "lucide-react"
import { useSiteConfig } from "@/hooks/use-site-config"
import { LoadingScreen } from "@/components/loader/LoadingScreen"
import { getRoleSingular } from "@/lib/proposal-roles"
import type { ProposalRole, ProposalResponse } from "@/lib/proposal-types"

// Palette lives in globals.css → @theme inline → --color-motif-*

const enableDecor = process.env.NEXT_PUBLIC_ENABLE_DECOR !== "false"

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

const brittanyStyle = {
  fontFamily: "var(--font-brittany), cursive",
  color: "var(--color-motif-deep)",
  letterSpacing: "0.01em",
} as const

function CoupleNamesHero() {
  const siteConfig = useSiteConfig()

  return (
    <div
      className="relative z-10 flex w-full flex-col items-center leading-none"
      style={{ ...playlistScriptStyle, color: "var(--color-motif-soft)" }}
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
        {siteConfig.couple.brideNickname}
      </span>
      <span
        className="relative my-1 text-2xl opacity-70 sm:my-2 sm:text-3xl md:text-4xl"
        style={{ color: "var(--color-motif-accent)" }}
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
        {siteConfig.couple.groomNickname}
      </span>
    </div>
  )
}

function ProposalIntroSection({ venue }: { venue: string }) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 text-center sm:space-y-7">
      <p
        className={`${cormorant.className} px-1 text-[11px] leading-[1.85] font-medium tracking-[0.18em] uppercase sm:px-0 sm:text-sm sm:leading-relaxed sm:tracking-[0.32em]`}
        style={{ color: "var(--color-motif-medium)" }}
      >
        With the grace of God and the blessings
        <br className="sm:hidden" />
        {" "}of our families we ask of you
      </p>

      <MotifDivider />

      <p
        className={`${cormorant.className} text-xs font-light tracking-[0.2em] uppercase italic sm:text-sm sm:tracking-[0.22em]`}
        style={{ color: "var(--color-motif-medium)" }}
      >
        We,
      </p>

      <CoupleNamesHero />

      <p
        className={`${cinzel.className} text-sm font-medium tracking-[0.18em] uppercase sm:text-base sm:tracking-[0.26em]`}
        style={{ color: "var(--color-motif-deep)", opacity: 0.9 }}
      >
        Are Getting Married
      </p>

      {/* <div
        className={`${cinzel.className} mx-auto flex max-w-md items-center justify-center gap-2 px-2 text-xs tracking-[0.14em] uppercase sm:text-sm sm:tracking-[0.16em]`}
        style={{ color: "var(--color-motif-medium)" }}
      >
        <MapPin className="h-4 w-4 shrink-0" style={{ color: "var(--color-motif-accent)" }} />
        <span className="text-pretty text-center" title={venue}>
          {venue}
        </span>
      </div> */}
    </div>
  )
}

const cardClass =
  "relative w-full overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2rem] border border-motif-accent/10 bg-[color-mix(in_srgb,var(--color-motif-cream)_18%,white)] p-5 text-center sm:p-12 md:p-14 lg:p-16"

const primaryBtnClass =
  "cursor-pointer rounded-full border border-motif-soft bg-motif-soft px-5 py-3 text-[9px] font-bold tracking-[0.16em] text-motif-cream uppercase shadow-[0_8px_24px_rgba(15,28,63,0.18)] transition-all duration-300 hover:bg-[color-mix(in_srgb,var(--color-motif-soft)_85%,black)] hover:border-[color-mix(in_srgb,var(--color-motif-soft)_85%,black)] hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 sm:px-7 sm:py-3.5 sm:text-[10px] sm:tracking-[0.18em] md:px-8 md:py-4 md:text-[11px]"

const secondaryBtnClass =
  "cursor-pointer rounded-full border border-motif-accent/45 bg-white/70 px-5 py-3 text-[9px] font-bold tracking-[0.16em] uppercase shadow-sm transition-all duration-300 hover:border-motif-accent/70 hover:bg-motif-accent/10 sm:px-7 sm:py-3.5 sm:text-[10px] sm:tracking-[0.18em] md:px-8 md:py-4 md:text-[11px]"

function ProposalAskSection({
  roleSingular,
  description,
  coAttendants,
  onYes,
  onNo,
}: {
  roleSingular: string
  description: string
  coAttendants: string[]
  onYes: () => void
  onNo: () => void
}) {
  const questionRef = useRef<HTMLDivElement>(null)
  const [questionHeight, setQuestionHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    const node = questionRef.current
    if (!node) return

    const syncHeight = () => {
      setQuestionHeight(node.getBoundingClientRect().height)
    }

    syncHeight()
    const observer = new ResizeObserver(syncHeight)
    observer.observe(node)

    return () => observer.disconnect()
  }, [roleSingular, description])

  return (
    <div className="relative mx-auto mt-0 w-full sm:mt-10">
      {coAttendants.length > 0 && (
        <div className="mx-auto mb-8 max-w-lg space-y-3 rounded-2xl border border-motif-accent/20 bg-white/60 px-5 py-4 text-center sm:px-6 sm:py-5">
          <div
            className="flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase sm:text-xs"
            style={{ color: "var(--color-motif-accent)" }}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>Co-members standing in this position</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {coAttendants.map((name, idx) => (
              <span
                key={idx}
                className="rounded-full border border-motif-accent/30 bg-motif-soft/30 px-3 py-1 text-xs font-medium shadow-sm"
                style={{ color: "var(--color-motif-deep)" }}
              >
                ✨ {name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="relative pt-0 sm:border-t sm:border-motif-accent/15 sm:pt-10">
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6 md:gap-10 mt-10">
          <div className="flex flex-row items-stretch justify-between gap-3 sm:contents">
            {/* Question + quote */}
            <div className="relative z-10 flex min-w-0 flex-1 flex-col items-start text-left">
              <div ref={questionRef} className="w-full">
                <p
                  className={`${cormorant.className} text-xs tracking-[0.34em] uppercase sm:text-sm sm:tracking-[0.4em] font-bold`}
                  style={{ color: "var(--color-motif-medium)" }}
                >
                  Will You Be Our
                </p>

                <h2
                  className="mt-2 leading-[0.92] sm:mt-3"
                  style={{
                    ...playlistScriptStyle,
                    fontFamily: "var(--font-playlist-script), cursive",
                    fontSize: "clamp(2.75rem, 11vw, 5.25rem)",
                    color: "var(--color-motif-soft)",
                    opacity: 0.9,
                    letterSpacing: "0.01em",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontStretch: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                  }}
                >
                  {roleSingular}?
                </h2>

                <p
                  className={`${cormorant.className} mt-3 max-w-lg pr-1 text-sm leading-[1.65] font-light italic sm:mt-6 sm:pr-0 sm:text-base sm:leading-[1.75] md:mt-7 md:text-lg md:leading-relaxed`}
                  style={{ color: "var(--color-motif-medium)" }}
                >
                  &ldquo;{description}&rdquo;
                </p>
              </div>

              {/* Desktop / tablet buttons */}
              <div className="mt-8 hidden w-full flex-row gap-3 sm:mt-10 sm:flex sm:max-w-md md:mt-12">
                <button onClick={onYes} className={`${primaryBtnClass} min-w-0 flex-1`}>
                  Yes, I&apos;d Be Honored
                </button>
                <button
                  onClick={onNo}
                  className={`${secondaryBtnClass} min-w-0 flex-1`}
                  style={{ color: "var(--color-motif-accent)" }}
                >
                  Regretfully Decline
                </button>
              </div>
            </div>

            {/* Couple illustration — height tracks question block on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden
              style={
                questionHeight
                  ? ({ "--ask-image-h": `${questionHeight}px` } as React.CSSProperties)
                  : undefined
              }
              className="pointer-events-none relative -mr-1 flex w-[38%] max-w-[168px] shrink-0 items-center justify-end self-stretch translate-x-4 max-sm:h-[var(--ask-image-h)] sm:mr-0 sm:block sm:w-[min(36vw,240px)] sm:max-w-none sm:translate-x-0 md:w-[min(32vw,280px)] lg:w-[300px]"
            >
              <div className="relative h-full w-full sm:h-auto sm:aspect-[3/4] sm:translate-y-4 md:translate-y-6">
                <Image
                  src="/Details/guest-new.png"
                  alt=""
                  fill
                  className="object-contain object-[right_center] sm:object-bottom"
                  sizes="(max-width: 640px) 38vw, 300px"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* Mobile buttons — full width below text + image */}
          <div className="flex w-full flex-row gap-2.5 sm:hidden">
            <button
              onClick={onYes}
              className={`${primaryBtnClass} min-h-11 min-w-0 flex-1 px-4 py-3.5 text-[10px] tracking-[0.12em]`}
            >
              Yes
            </button>
            <button
              onClick={onNo}
              className={`${secondaryBtnClass} min-h-11 min-w-0 flex-1 px-4 py-3.5 text-[10px] tracking-[0.12em]`}
              style={{ color: "var(--color-motif-medium)" }}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

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

type ProposalFlowState =
  | "question"
  | "yes_details"
  | "yes_submitted"
  | "no_clicked"
  | "no_submitted"

interface ProposalPageProps {
  role: ProposalRole
}

export function ProposalPage({ role }: ProposalPageProps) {
  const siteConfig = useSiteConfig()
  const [isReady, setIsReady] = useState(false)
  const [flowState, setFlowState] = useState<ProposalFlowState>("question")
  const [preferredName, setPreferredName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [responses, setResponses] = useState<ProposalResponse[]>([])

  const handleLoadingComplete = useCallback(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    fetch("/api/proposal-responses", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setResponses(Array.isArray(data) ? data : []))
      .catch(() => setResponses([]))
  }, [])

  const coAttendants = responses
    .filter((r) => r.role === role.id && r.status === "Confirmed")
    .map((r) => r.name || "A Secret Supporter")

  const submitResponse = async (status: "Confirmed" | "Declined", name: string) => {
    const response = await fetch("/api/proposal-responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: role.id,
        name,
        status,
        submittedAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to submit response")
    }

    window.dispatchEvent(new Event("entourageUpdated"))
  }

  const handleYesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!preferredName.trim()) {
      setValidationError(
        "Please type your preferred name so we can add it to our invitation."
      )
      return
    }
    setValidationError("")
    setSubmitting(true)

    try {
      await submitResponse("Confirmed", preferredName.trim())
      setFlowState("yes_submitted")
    } catch (err) {
      console.error("Failed to submit confirmation:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNoSubmit = async () => {
    setSubmitting(true)
    try {
      await submitResponse("Declined", "Declined Entourage Offer")
      setFlowState("no_submitted")
    } catch (err) {
      console.error("Failed to submit decline:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const roleSingular = getRoleSingular(role.title)
  const venue = siteConfig.ceremony.location

  return (
    <div
      className={`${cormorant.className} relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden bg-transparent px-3 py-8 sm:px-6 sm:py-16`}
    >
      {!isReady && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Silk background — full visibility, no page overlays */}
      {enableDecor && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <Silk
            speed={5}
            scale={1.1}
            color="#368BC1"
            noiseIntensity={0.8}
            rotation={0.3}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-2xl lg:max-w-4xl"
      >
        <AnimatePresence mode="wait">
          {flowState === "question" && (
            <motion.div
              key="question-box"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={cardClass}
            >
              <div className="relative z-10 w-full space-y-3 pt-1 sm:space-y-8 sm:pt-2">
                <ProposalIntroSection venue={venue} />

                <div
                  className="mx-auto max-w-xl space-y-3 border-t border-motif-accent/15 px-1 pt-4 pb-0 text-[13px] leading-[1.75] font-light italic sm:space-y-5 sm:px-0 sm:border-y sm:py-8 sm:text-base sm:leading-[1.8]"
                  style={{ color: "var(--color-motif-deep)", opacity: 0.88 }}
                >
                  <p className="text-pretty">
                    &ldquo;As we enter the next chapter of our lives as husband and wife, we seek
                    the guidance and support of special people who have inspired us through their
                    love, wisdom, and example.&rdquo;
                  </p>
                  <p
                    className="text-[11px] leading-relaxed font-medium tracking-[0.14em] uppercase not-italic sm:text-sm sm:tracking-[0.2em]"
                    style={{ color: "var(--color-motif-medium)" }}
                  >
                    Because you are a role model of love, laughter, and happily ever after, it
                    would be our honor if you would stand with us and witness our love as our:
                  </p>
                </div>

                <ProposalAskSection
                  roleSingular={roleSingular}
                  description={role.description}
                  coAttendants={coAttendants}
                  onYes={() => setFlowState("yes_details")}
                  onNo={() => setFlowState("no_clicked")}
                />
              </div>
            </motion.div>
          )}

          {flowState === "yes_details" && (
            <motion.form
              key="yes-form"
              onSubmit={handleYesSubmit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={cardClass}
            >
              <div className="relative z-10 w-full space-y-4 py-1 sm:space-y-6 sm:py-3">
                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200/80 bg-emerald-50/90 shadow-sm backdrop-blur-sm sm:h-12 sm:w-12">
                    <Check className="h-5 w-5 text-emerald-600 sm:h-6 sm:w-6" />
                  </div>
                </div>

                <h2
                  className="mb-2 text-xl font-medium italic sm:text-3xl"
                  style={{ color: "var(--color-motif-deep)" }}
                >
                  We are honored to have you as part of our special day.
                </h2>

                <p
                  className="mx-auto max-w-md text-xs leading-relaxed font-light sm:text-sm"
                  style={{ color: "var(--color-motif-medium)" }}
                >
                  Thank you for accepting our proposal! Please enter the exact name you would like
                  displayed on our wedding invitation and guestlists:
                </p>

                <div className="mx-auto max-w-md text-left">
                  <label
                    className="mb-2 block text-[10px] font-semibold tracking-widest uppercase sm:text-xs"
                    style={{ color: "var(--color-motif-medium)" }}
                  >
                    Your Preferred Name <span style={{ color: "var(--color-motif-accent)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aunt Maria Clara / Mr. James Bond"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    className="w-full rounded-xl border border-motif-accent/15 bg-[color-mix(in_srgb,var(--color-motif-cream)_8%,white)] px-4 py-2.5 text-xs font-medium transition-all placeholder:text-motif-medium/35 focus:border-motif-accent/40 focus:ring-2 focus:ring-motif-accent/15 focus:outline-none sm:py-3 sm:text-sm"
                    style={{ color: "var(--color-motif-deep)" }}
                  />
                  {validationError && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-rose-500">
                      <span>⚠️</span> {validationError}
                    </p>
                  )}
                </div>

                <div
                  className="mx-auto flex max-w-md flex-col gap-3 border-t pt-4 sm:flex-row"
                  style={{ borderColor: "color-mix(in srgb, var(--color-motif-accent) 20%, transparent)" }}
                >
                  <button type="submit" disabled={submitting} className={`${primaryBtnClass} flex-1`}>
                    {submitting ? "Saving..." : "Submit Response"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowState("question")}
                    className={secondaryBtnClass}
                    style={{ color: "var(--color-motif-medium)" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.form>
          )}

          {flowState === "yes_submitted" && (
            <motion.div
              key="yes-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cardClass}
            >
              <div className="relative z-10 space-y-4">
                <div className="relative mb-6 flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-motif-accent/30 bg-motif-soft/50 shadow-[0_8px_24px_rgba(15,28,63,0.08)] backdrop-blur-sm"
                    style={{ color: "var(--color-motif-accent)" }}
                  >
                    <Sparkles className="h-8 w-8" />
                  </motion.div>
                </div>

                <h2
                  className="mb-4 leading-none"
                  style={{ ...brittanyStyle, fontSize: "clamp(2rem, 9vw, 3.5rem)" }}
                >
                  It&apos;s Official!
                </h2>

                <div className="mx-auto mb-6 max-w-sm rounded-2xl border border-motif-accent/25 bg-white/65 px-6 py-4 shadow-[0_8px_28px_rgba(15,28,63,0.08)] backdrop-blur-sm">
                  <span
                    className="mb-1 block text-[10px] font-semibold tracking-widest uppercase"
                    style={{ color: "var(--color-motif-medium)" }}
                  >
                    Registered partner
                  </span>
                  <p
                    className="text-lg font-semibold tracking-wide sm:text-xl"
                    style={{ color: "var(--color-motif-deep)" }}
                  >
                    {preferredName}
                  </p>
                  <span
                    className="mt-1.5 block text-xs font-medium italic"
                    style={{ color: "var(--color-motif-accent)" }}
                  >
                    for the position of {role.title}
                  </span>
                </div>

                <p
                  className="mx-auto mb-10 max-w-md text-sm leading-relaxed font-light"
                  style={{ color: "var(--color-motif-medium)" }}
                >
                  Thank you so much. Having you stand with us fills our hearts with endless joy
                  and confidence. We can&apos;t wait to celebrate together on our wedding day!
                </p>

                <Link href="/" className={`${primaryBtnClass} inline-block w-full max-w-sm`}>
                  Return to Wedding Page
                </Link>
              </div>
            </motion.div>
          )}

          {flowState === "no_clicked" && (
            <motion.div
              key="no-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cardClass}
            >
              <div className="relative z-10 space-y-4">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-200/80 bg-rose-50/90 shadow-sm backdrop-blur-sm">
                    <X className="h-6 w-6 text-rose-500" />
                  </div>
                </div>

                <h2
                  className="mb-4 text-2xl font-semibold tracking-wide uppercase"
                  style={{ color: "var(--color-motif-deep)" }}
                >
                  Thank You for Responding
                </h2>

                <p
                  className="mx-auto mb-10 max-w-lg text-sm leading-relaxed font-light italic sm:text-base"
                  style={{ color: "var(--color-motif-medium)" }}
                >
                  &ldquo;Thank you for taking the time to respond. While we&apos;re saddened that
                  you won&apos;t be able to join us in this role, we truly appreciate your support
                  and well wishes as we begin this new chapter together.&rdquo;
                </p>

                <div
                  className="mx-auto flex max-w-xs flex-col gap-3 border-t pt-4 sm:max-w-md sm:flex-row"
                  style={{ borderColor: "color-mix(in srgb, var(--color-motif-accent) 20%, transparent)" }}
                >
                  <button
                    onClick={handleNoSubmit}
                    disabled={submitting}
                    className="flex-1 cursor-pointer rounded-full border border-rose-500 bg-rose-500 px-8 py-4 text-[11px] font-bold tracking-[0.18em] text-white uppercase shadow-md transition-all duration-300 hover:border-rose-600 hover:bg-rose-600 disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Send Response"}
                  </button>
                  <button
                    onClick={() => setFlowState("question")}
                    className={secondaryBtnClass}
                    style={{ color: "var(--color-motif-medium)" }}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {flowState === "no_submitted" && (
            <motion.div
              key="no-submitted-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cardClass}
            >
              <div className="relative z-10 space-y-4">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-motif-accent/30 bg-white/70 shadow-sm backdrop-blur-sm">
                    <Heart className="h-6 w-6" style={{ color: "var(--color-motif-accent)" }} />
                  </div>
                </div>

                <h2
                  className="mb-4 leading-none italic"
                  style={{ ...brittanyStyle, fontSize: "clamp(1.75rem, 7vw, 2.75rem)" }}
                >
                  Response Sent Successfully
                </h2>

                <p
                  className="mx-auto mb-8 max-w-md text-sm leading-relaxed font-light"
                  style={{ color: "var(--color-motif-medium)" }}
                >
                  We have received your response. Your love, support, and well wishes mean the
                  world to us regardless. We look forward to celebrating other special milestones
                  with you in the future!
                </p>

                <Link
                  href="/"
                  className={secondaryBtnClass}
                  style={{ color: "var(--color-motif-medium)" }}
                >
                  Return to Wedding Page
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
