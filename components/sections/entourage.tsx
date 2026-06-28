"use client"

import React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { entourage as staticEntourage, principalSponsors as staticSponsors } from "@/content/site"
import { useSiteConfig } from "@/hooks/use-site-config"
import { Loader2, Users } from "lucide-react"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

interface EntourageMember {
  name: string
  roleCategory: string
  roleTitle: string
  email: string
}

interface PrincipalSponsor {
  malePrincipalSponsor: string
  femalePrincipalSponsor: string
}

/** Accepts PascalCase from API / Sheets or camelCase */
function entourageMemberFromApi(row: Record<string, unknown>): EntourageMember {
  const r = row as Record<string, string | undefined>
  return {
    name: r.name ?? r.Name ?? "",
    roleCategory: r.roleCategory ?? r.RoleCategory ?? "",
    roleTitle: r.roleTitle ?? r.RoleTitle ?? "",
    email: r.email ?? r.Email ?? "",
  }
}

function principalSponsorFromApi(row: Record<string, unknown>): PrincipalSponsor {
  const r = row as Record<string, string | undefined>
  return {
    malePrincipalSponsor: r.malePrincipalSponsor ?? r.MalePrincipalSponsor ?? "",
    femalePrincipalSponsor: r.femalePrincipalSponsor ?? r.FemalePrincipalSponsor ?? "",
  }
}

const textColor = "color-mix(in srgb, var(--color-motif-cream) 50%, white)"
const cardTextColor = "var(--color-motif-soft)"
const accentColor = "var(--color-motif-accent)"
const DECO_FILTER =
  "brightness(0) saturate(100%) invert(100%) drop-shadow(0 8px 20px color-mix(in srgb, var(--color-motif-soft) 55%, transparent))"

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

function SectionDivider() {
  return (
    <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
      <div className="h-px w-full max-w-md rounded-full bg-motif-accent/60" />
    </div>
  )
}

function mapStaticEntourage(): EntourageMember[] {
  const roleToCategory: Record<string, string> = {
    "Best Man": "Best Man",
    "Matron of Honor": "Matron of Honor",
    "Maid of Honor": "Maid of Honor",
    "Bridesmaid": "Bridesmaids",
    "Groomsman": "Groomsmen",
    "Father": "Parents of the Bride",
    "Mother": "Parents of the Bride",
    "Brother": "Parents of the Groom",
    "Flower Girl": "Flower Girls",
    "Little Bride": "Little Bride",
    "Little Groom": "Little Groom",
    "Ring Bearer": "Ring Bearer",
    "Coin Bearer": "Coin Bearer",
    "Bible Bearer": "Bible Bearer",
  }
  return staticEntourage.map(({ role, name, group }) => {
    let category = roleToCategory[role] ?? (role.endsWith("s") ? role : role + "s")
    if (group === "kate-family") category = "Parents of the Bride"
    if (group === "christian-family") category = "Parents of the Groom"
    if (group === "candle") category = "Candle Sponsors"
    if (group === "cord") category = "Cord Sponsors"
    return { name, roleTitle: role, roleCategory: category, email: "" }
  })
}

function mapStaticSponsors(): PrincipalSponsor[] {
  return staticSponsors
    .filter((s) => s.name || s.spouse)
    .map(({ name, spouse }) => ({
      malePrincipalSponsor: name || "",
      femalePrincipalSponsor: spouse || "",
    }))
}

const ROLE_CATEGORY_ORDER = [
  "OFFICIATING MINISTER",
  "The Couple",
  "Parents of the Groom",
  "Parents of the Bride",
  "Family of the Groom",
  "Family of the Bride",
  "Matron of Honor",
  "Best Man",
  "Maid of Honor",
  "Bride squad",
  "Candle Sponsors",
  "Veil Sponsors",
  "Cord Sponsors",
  "Groomsmen",
  "Bridesmaids",
  "Little Groom",
  "Little Bride",
  "Ring Bearer",
  "Bible Bearer",
  "Coin Bearer",
  "Flower Girls",
]

const HIDDEN_ROLE_CATEGORIES = new Set<string>([])

function normalizeRoleCategory(category: string): string {
  const normalized = category.trim()
  if (normalized.toLowerCase() === "officiating minister") {
    return "OFFICIATING MINISTER"
  }
  return normalized
}

/** Preserve sheet order for unknown categories; known categories follow ROLE_CATEGORY_ORDER. */
function buildCategoryOrder(
  members: EntourageMember[],
  grouped: Record<string, EntourageMember[]>
): string[] {
  const firstSeen = new Map<string, number>()
  members.forEach((member, index) => {
    const category = normalizeRoleCategory(member.roleCategory)
    if (!category || category === "Other") return
    if (!firstSeen.has(category)) firstSeen.set(category, index)
  })

  const categories = Object.keys(grouped).filter(
    (cat) => cat && cat !== "Other" && !HIDDEN_ROLE_CATEGORIES.has(cat)
  )

  return categories.sort((a, b) => {
    const aKnown = ROLE_CATEGORY_ORDER.indexOf(a)
    const bKnown = ROLE_CATEGORY_ORDER.indexOf(b)
    if (aKnown >= 0 && bKnown >= 0) return aKnown - bKnown
    if (aKnown >= 0) return -1
    if (bKnown >= 0) return 1
    return (firstSeen.get(a) ?? 0) - (firstSeen.get(b) ?? 0)
  })
}

/** Title case per word; uses Unicode letters so ñe → Ñe (not ñE from ASCII-only `/\b\w/g`). */
function toTitleCaseDisplayName(name: string): string {
  const lower = name.toLocaleLowerCase("es")
  return lower.replace(
    /(^|[\s'\-])(\p{L})/gu,
    (_, sep: string, letter: string) => sep + letter.toLocaleUpperCase("es")
  )
}

export function Entourage() {
  const siteConfig = useSiteConfig()
  const [entourage, setEntourage] = useState<EntourageMember[]>([])
  const [sponsors, setSponsors] = useState<PrincipalSponsor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const fetchEntourage = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/entourage", { cache: "no-store" })
      if (!response.ok) throw new Error("Failed to fetch entourage")
      const data: unknown = await response.json()
      const list = Array.isArray(data)
        ? data
            .map((row) => entourageMemberFromApi(row as Record<string, unknown>))
            .filter((m) => m.name.trim())
        : mapStaticEntourage()
      setEntourage(list.length > 0 ? list : mapStaticEntourage())
    } catch (err: unknown) {
      console.error("Failed to load entourage:", err)
      setEntourage(mapStaticEntourage())
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSponsors = async () => {
    try {
      const res = await fetch("/api/principal-sponsor", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load principal sponsors")
      const data: unknown = await res.json()
      const list =
        Array.isArray(data) && data.length > 0
          ? data.map((row) => principalSponsorFromApi(row as Record<string, unknown>)).filter((s) => s.malePrincipalSponsor || s.femalePrincipalSponsor)
          : mapStaticSponsors()
      setSponsors(list)
    } catch (e: unknown) {
      console.error("Failed to load sponsors:", e)
      setSponsors(mapStaticSponsors())
    }
  }

  useEffect(() => {
    fetchEntourage()
    fetchSponsors()

    // Set up auto-refresh listener for dashboard updates
    const handleEntourageUpdate = () => {
      setTimeout(() => {
        fetchEntourage()
        fetchSponsors()
      }, 1000)
    }

    window.addEventListener("entourageUpdated", handleEntourageUpdate)

    return () => {
      window.removeEventListener("entourageUpdated", handleEntourageUpdate)
    }
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Group entourage by RoleCategory from Google Sheets (preserve API row order within each group)
  const grouped = useMemo(() => {
    const grouped: Record<string, EntourageMember[]> = {}

    entourage.forEach((member) => {
      const name = member.name?.trim()
      if (!name) return

      const category = normalizeRoleCategory(member.roleCategory) || "Uncategorized"
      if (category === "Other") return

      if (!grouped[category]) grouped[category] = []
      grouped[category].push(member)
    })

    return grouped
  }, [entourage])

  const categoryOrder = useMemo(
    () => buildCategoryOrder(entourage, grouped),
    [entourage, grouped]
  )

  const hasParents =
    (grouped["Parents of the Groom"]?.length ?? 0) > 0 || (grouped["Parents of the Bride"]?.length ?? 0) > 0

  // Helper component for elegant section titles (category labels)
  const SectionTitle = ({
    children,
    align = "center",
    className = "",
  }: {
    children: React.ReactNode
    align?: "left" | "center" | "right"
    className?: string
  }) => {
    const textAlign =
      align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"
    return (
      <h3
        className={`relative ${cinzel.className} text-[0.7rem] sm:text-[0.85rem] md:text-base lg:text-lg tracking-[0.18em] uppercase mb-1 sm:mb-1.5 md:mb-2 ${textAlign} ${className} transition-all duration-300 whitespace-nowrap`}
        style={{ color: cardTextColor }}
      >
        {children}
      </h3>
    )
  }

  // Helper component for name items with role title (supports alignment)
  const NameItem = ({
    member,
    align = "center",
    showRole = true,
  }: {
    member: EntourageMember
    align?: "left" | "center" | "right"
    showRole?: boolean
  }) => {
    const containerAlign =
      align === "right" ? "items-end" : align === "left" ? "items-start" : "items-center"
    const textAlign =
      align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"
    return (
      <div
        className={`relative flex flex-col ${containerAlign} justify-center py-0.5 sm:py-1 md:py-1 leading-snug sm:leading-snug group/item transition-all duration-300 hover:scale-[1.02] sm:hover:scale-[1.03]`}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-md"
          style={{ background: 'color-mix(in srgb, var(--color-motif-accent) 12%, transparent)' }}
        />
        <p
          className={`relative text-[10px] sm:text-[11.5px] md:text-[12.5px] lg:text-[13.5px] font-semibold ${textAlign} transition-all duration-300`}
          style={{ color: cardTextColor }}
        >
          {toTitleCaseDisplayName(member.name)}
        </p>
        {showRole && member.roleTitle && (
          <p
            className={`relative text-[9px] sm:text-[10px] md:text-[10px] lg:text-xs font-medium mt-0 leading-tight ${textAlign} tracking-wide uppercase transition-colors duration-300 opacity-80`}
            style={{ color: cardTextColor }}
          >
            {member.roleTitle}
          </p>
        )}
      </div>
    )
  }

  // Helper component for two-column layout wrapper
  const TwoColumnLayout = ({ 
    children, 
    leftTitle, 
    rightTitle,
    singleTitle,
    centerContent = false 
  }: { 
    children: React.ReactNode
    leftTitle?: string
    rightTitle?: string
    singleTitle?: string
    centerContent?: boolean
  }) => {
    if (singleTitle) {
      return (
        <div className="mb-2 sm:mb-2.5 md:mb-3">
          <SectionTitle>{singleTitle}</SectionTitle>
          <div className={`grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-0.5 sm:gap-y-1 md:gap-y-1 ${centerContent ? 'max-w-2xl mx-auto' : ''}`}>
            {children}
          </div>
        </div>
      )
    }

    return (
      <div className="mb-2 sm:mb-2.5 md:mb-3">
        <div className="grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-6 mb-2 sm:mb-2.5 md:mb-3">
          {leftTitle && (
            <SectionTitle align="right" className="pr-1 sm:pr-1.5 md:pr-2">{leftTitle}</SectionTitle>
          )}
          {rightTitle && (
            <SectionTitle align="left" className="pl-1 sm:pl-1.5 md:pl-2">{rightTitle}</SectionTitle>
          )}
        </div>
        <div className={`grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-0.5 sm:gap-y-1 md:gap-y-1 ${centerContent ? 'max-w-2xl mx-auto' : ''}`}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-transparent">
      <section
        ref={sectionRef}
        id="entourage"
        className="relative z-10 py-8 md:py-10 lg:py-12 overflow-hidden"
      >
      {/* Corner floral decoration - softly tinted */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="absolute top-0 left-0 w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-20"
          style={{ transform: "scaleY(-1)", filter: DECO_FILTER }}
          priority={false}
        /> */}
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="absolute top-0 right-0 w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-20"
          style={{ transform: "scaleX(-1) scaleY(-1)", filter: DECO_FILTER }}
          priority={false}
        /> */}
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 left-0 w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-20"
          style={{ filter: DECO_FILTER }}
          priority={false}
        /> */}
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 right-0 w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-20"
          style={{ transform: "scaleX(-1)", filter: DECO_FILTER }}
          priority={false}
        /> */}
      </div>

      {/* Section Header */}
      <div className={`relative z-30 text-center mb-4 sm:mb-5 md:mb-6 px-3 sm:px-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
        <p
          className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm uppercase tracking-[0.28em] mb-2`}
          style={{ color: textColor }}
        >
          Those who stand with {siteConfig.couple.groomNickname} &amp; {siteConfig.couple.brideNickname}
        </p>

        <MotifDivider />

        <h2
          className={`${cinzel.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-1 sm:mb-2 md:mb-2.5`}
          style={{
            color: textColor,
            textShadow: "0 2px 12px color-mix(in srgb, var(--color-motif-soft) 45%, transparent)",
          }}
        >
          Wedding Entourage
        </h2>

        <p
          className={`${cormorant.className} text-xs sm:text-sm md:text-base mb-2 sm:mb-2.5 md:mb-3 italic opacity-90`}
          style={{ color: textColor }}
        >
          Honoring those who share in our joy
        </p>
      </div>

      {/* Central Card Container */}
      <div
        className={`relative z-30 max-w-4xl mx-auto px-3 sm:px-5 transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div
          className="relative overflow-hidden rounded-xl border border-motif-accent/25 bg-[color-mix(in_srgb,var(--color-motif-cream)_18%,white)] backdrop-blur-lg shadow-lg transition-all duration-500 group sm:rounded-2xl"
          style={{ boxShadow: '0 18px 40px color-mix(in srgb, var(--color-motif-soft) 13%, transparent)' }}
        >
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div
              className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2"
              style={{ background: 'radial-gradient(circle at center, color-mix(in srgb, var(--color-motif-accent) 6%, transparent), transparent 60%)' }}
            />
            <div className="absolute inset-[1px] rounded-[inherit] border border-motif-accent/10" />
          </div>
          {/* Card content */}
          <div className="relative p-3 sm:p-4 md:p-5 z-10">
            {isLoading ? (
              <div className="flex items-center justify-center py-24 sm:py-28 md:py-32">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin opacity-70" style={{ color: cardTextColor }} />
                  <span className="font-serif text-base sm:text-lg opacity-80" style={{ color: cardTextColor }}>Loading entourage...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-24 sm:py-28 md:py-32">
                <div className="text-center">
                  <p className="font-serif text-base sm:text-lg mb-3" style={{ color: cardTextColor }}>{error}</p>
                  <button
                    onClick={fetchEntourage}
                    className="font-serif underline transition-colors duration-200 opacity-90 hover:opacity-100"
                    style={{ color: accentColor }}
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : entourage.length === 0 ? (
              <div className="text-center py-24 sm:py-28 md:py-32">
                <Users className="h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-4 opacity-30" style={{ color: accentColor }} />
                <p className="font-serif text-base sm:text-lg opacity-60" style={{ color: cardTextColor }}>No entourage members yet</p>
              </div>
            ) : (
            <>
              {categoryOrder.map((category, categoryIndex) => {
                const members = grouped[category] || []
                
                if (members.length === 0) return null
                if (HIDDEN_ROLE_CATEGORIES.has(category)) return null

                // Bride squad and similar API categories — single section from Google Sheet
                if (category === "Bride squad") {
                  return (
                    <div key={category}>
                      {categoryIndex > 0 && <SectionDivider />}
                      <TwoColumnLayout singleTitle="Bride Squad" centerContent={true}>
                        <div className="col-span-full">
                          <div className="max-w-sm mx-auto flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
                            {members.map((member, idx) => (
                              <NameItem key={`${category}-${idx}-${member.name}`} member={member} align="center" />
                            ))}
                          </div>
                        </div>
                      </TwoColumnLayout>
                    </div>
                  )
                }

                // Render OFFICIATING MINISTER directly above Principal Sponsors (in Parents block)
                if (category === "OFFICIATING MINISTER" && hasParents) return null

                // Special handling for The Couple - display Bride and Groom side by side
                if (category === "The Couple") {
                   const groom = members.find(m => m.roleTitle?.toLowerCase().includes('groom'))
                  const bride = members.find(m => m.roleTitle?.toLowerCase().includes('bride'))
                  
                  return (
                    <div key={category}>
                      {categoryIndex > 0 && (
                        <SectionDivider />
                      )}
                      <TwoColumnLayout singleTitle="The Couple" centerContent={true}>
                        <div className="px-1.5 sm:px-2 md:px-2.5">
                          {groom && <NameItem member={groom} align="right" />}
                        </div>
                        <div className="px-1.5 sm:px-2 md:px-2.5">
                          {bride && <NameItem member={bride} align="left" />}
                        </div>
                      </TwoColumnLayout>
                    </div>
                  )
                }

                // Special handling for Parents sections - combine into single two-column layout
                if (category === "Parents of the Bride" || category === "Parents of the Groom") {
                  // Get both parent groups
                  const parentsBride = grouped["Parents of the Bride"] || []
                  const parentsGroom = grouped["Parents of the Groom"] || []
                  
                  // Helper function to sort parents: father first, then mother
                  const sortParents = (members: EntourageMember[]) => {
                    return [...members].sort((a, b) => {
                      const aIsFather = a.roleTitle?.toLowerCase().includes('father') ?? false
                      const bIsFather = b.roleTitle?.toLowerCase().includes('father') ?? false
                      
                      // Father comes first
                      if (aIsFather && !bIsFather) return -1
                      if (!aIsFather && bIsFather) return 1
                      return 0
                    })
                  }
                  
                  // Only render once (when processing "Parents of the Groom")
                  if (category === "Parents of the Groom") {
                    return (
                      <div key="Parents">
                        {categoryIndex > 0 && (
                          <SectionDivider />
                        )}
                        <TwoColumnLayout leftTitle="Groom’s Parents" rightTitle="Bride’s Parents">
                          {(() => {
                            const leftArr = sortParents(parentsGroom)
                            const rightArr = sortParents(parentsBride)
                            const maxLen = Math.max(leftArr.length, rightArr.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = leftArr[i]
                              const right = rightArr[i]
                              rows.push(
                                <React.Fragment key={`parents-row-${i}`}>
                                  <div key={`parent-groom-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`parent-bride-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                        
                        {/* Officiating Minister section - displayed above Principal Sponsors */}
                        {(() => {
                          const officiating = grouped["OFFICIATING MINISTER"] || []
                          if (officiating.length === 0) return null
                          return (
                            <div key="OfficiatingMinisterBeforeSponsors" className="mt-4 sm:mt-5 md:mt-6">
                              <TwoColumnLayout singleTitle="OFFICIATING MINISTER" centerContent={true}>
                                {officiating.map((member, idx) => (
                                  <div
                                    key={`officiating-${idx}-${member.name}`}
                                    className="px-1.5 sm:px-2 md:px-2.5 min-[350px]:col-span-2 flex justify-center"
                                  >
                                    <NameItem member={member} align="center" showRole={false} />
                                  </div>
                                ))}
                              </TwoColumnLayout>
                            </div>
                          )
                        })()}

                        {/* Principal Sponsors section - displayed after Parents */}
                        {sponsors.length > 0 && (
                          <div key="SponsorsAfterParents">
                            <div className="flex justify-center py-1.5 sm:py-2 md:py-2.5 mb-2 sm:mb-2.5 md:mb-3">
                            </div>
                            <TwoColumnLayout singleTitle="Principal Sponsors" centerContent={true}>
                              {sponsors.map((sponsor, idx) => (
                                <React.Fragment key={`sponsor-row-${idx}`}>
                                  <div key={`sponsor-male-${idx}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {sponsor.malePrincipalSponsor ? (
                                      <NameItem 
                                        member={{
                                          name: sponsor.malePrincipalSponsor,
                                          roleCategory: "",
                                          roleTitle: "",
                                          email: ""
                                        }} 
                                        align="right" 
                                        showRole={false}
                                      />
                                    ) : (
                                      <div className="py-0.5 sm:py-1 md:py-1.5" />
                                    )}
                                  </div>
                                  <div key={`sponsor-female-${idx}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {sponsor.femalePrincipalSponsor ? (
                                      <NameItem 
                                        member={{
                                          name: sponsor.femalePrincipalSponsor,
                                          roleCategory: "",
                                          roleTitle: "",
                                          email: ""
                                        }} 
                                        align="left" 
                                        showRole={false}
                                      />
                                    ) : (
                                      <div className="py-0.5 sm:py-1 md:py-1.5" />
                                    )}
                                  </div>
                                </React.Fragment>
                              ))}
                            </TwoColumnLayout>
                          </div>
                        )}
                      </div>
                    )
                  }
                  // Skip rendering for "Parents of the Bride" since it's already rendered above
                  return null
                }

                // Special handling for Family of the Groom/Bride - combine into single two-column layout
                if (category === "Family of the Groom" || category === "Family of the Bride") {
                  const familyGroom = grouped["Family of the Groom"] || []
                  const familyBride = grouped["Family of the Bride"] || []

                  if (category === "Family of the Groom") {
                    return (
                      <div key="Family">
                        {categoryIndex > 0 && (
                          <SectionDivider />
                        )}
                        <TwoColumnLayout leftTitle="Family of the Groom" rightTitle="Family of the Bride">
                          {(() => {
                            const maxLen = Math.max(familyGroom.length, familyBride.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = familyGroom[i]
                              const right = familyBride[i]
                              rows.push(
                                <React.Fragment key={`family-row-${i}`}>
                                  <div key={`family-groom-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`family-bride-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }

                  return null
                }

                // Special handling for Maid/Matron of Honor and Best Man - combine into single two-column layout
                if (category === "Matron of Honor" || category === "Maid of Honor" || category === "Best Man") {
                  // Get both honor attendant groups - combine Maid and Matron of Honor
                  const maidOfHonor = [...(grouped["Maid of Honor"] || []), ...(grouped["Matron of Honor"] || [])]
                  const bestMan = grouped["Best Man"] || []
                  
                  // Only render once (when processing "Best Man")
                  if (category === "Best Man") {
                    return (
                      <div key="HonorAttendants">
                        {categoryIndex > 0 && (
                          <SectionDivider />
                        )}
                        <TwoColumnLayout leftTitle="Best Man" rightTitle="Maid of Honor">
                          {(() => {
                            const maxLen = Math.max(bestMan.length, maidOfHonor.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = bestMan[i]
                              const right = maidOfHonor[i]
                              rows.push(
                                <React.Fragment key={`honor-row-${i}`}>
                                  <div key={`maid-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`bestman-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }
                  // Skip rendering for "Matron of Honor" and "Maid of Honor" since they're already rendered above
                  return null
                }

                // Special handling for Little Groom and Little Bride - combine into single two-column layout
                if (category === "Little Groom" || category === "Little Bride") {
                  // Get both little ones groups
                  const littleGroom = grouped["Little Groom"] || []
                  const littleBride = grouped["Little Bride"] || []
                  
                  // Only render once (when processing "Little Groom")
                  if (category === "Little Groom") {
                    return (
                      <div key="LittleOnes">
                        {categoryIndex > 0 && (
                          <SectionDivider />
                        )}
                        <TwoColumnLayout leftTitle="Little Groom" rightTitle="Little Bride">
                          {(() => {
                            const maxLen = Math.max(littleGroom.length, littleBride.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = littleGroom[i]
                              const right = littleBride[i]
                              rows.push(
                                <React.Fragment key={`little-row-${i}`}>
                                  <div key={`littlegroom-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`littlebride-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }
                  // Skip rendering for "Little Bride" since it's already rendered above
                  return null
                }

                // Special handling for Bridesmaids and Groomsmen - combine into single two-column layout
                if (category === "Bridesmaids" || category === "Groomsmen") {
                  // Get both bridal party groups
                  const bridesmaids = grouped["Bridesmaids"] || []
                  const groomsmen = grouped["Groomsmen"] || []
                  
                  // Only render once (when processing "Bridesmaids")
                  if (category === "Bridesmaids") {
                    return (
                      <React.Fragment key="BridalPartySection">
                        {/* Groomsmen/Bridesmaids section */}
                        <div key="BridalParty">
                          {categoryIndex > 0 && (
                            <SectionDivider />
                          )}
                          <TwoColumnLayout leftTitle="Groomsmen" rightTitle="Bridesmaids">
                            {(() => {
                              const maxLen = Math.max(bridesmaids.length, groomsmen.length)
                              const rows = []
                              for (let i = 0; i < maxLen; i++) {
                                const groomsman = groomsmen[i]
                                const bridesmaid = bridesmaids[i]
                                rows.push(
                                  <React.Fragment key={`bridal-row-${i}`}>
                                    <div key={`groomsman-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                      {groomsman ? <NameItem member={groomsman} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                    </div>
                                    <div key={`bridesmaid-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                      {bridesmaid ? <NameItem member={bridesmaid} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                    </div>
                                  </React.Fragment>
                                )
                              }
                              return rows
                            })()}
                          </TwoColumnLayout>
                        </div>
                      </React.Fragment>
                    )
                  }
                  // Skip rendering for "Groomsmen" since it's already rendered above
                  return null
                }

                // Secondary Sponsors block: render all three groups under one heading
                if (category === "Candle Sponsors" || category === "Veil Sponsors" || category === "Cord Sponsors") {
                  // Only render the full block once — when processing the first one that exists in order
                  const secondarySponsorGroups = ["Candle Sponsors", "Veil Sponsors", "Cord Sponsors"] as const
                  const firstPresentGroup = secondarySponsorGroups.find((g) => (grouped[g]?.length ?? 0) > 0)
                  if (category !== firstPresentGroup) return null

                  const renderPairedGroup = (groupName: string) => {
                    const grpMembers = grouped[groupName] || []
                    if (grpMembers.length === 0) return null
                    return (
                      <div key={groupName} className="mb-2 sm:mb-2.5 md:mb-3">
                        <TwoColumnLayout singleTitle={groupName} centerContent={true}>
                          {grpMembers.length === 2 ? (
                            <>
                              <div className="px-1.5 sm:px-2 md:px-2.5">
                                <NameItem member={grpMembers[0]} align="right" />
                              </div>
                              <div className="px-1.5 sm:px-2 md:px-2.5">
                                <NameItem member={grpMembers[1]} align="left" />
                              </div>
                            </>
                          ) : (
                            <div className="col-span-full">
                              <div className="max-w-sm mx-auto flex flex-col items-center gap-0.5 sm:gap-1 md:gap-1">
                                {grpMembers.map((member, idx) => (
                                  <NameItem key={`${groupName}-${idx}-${member.name}`} member={member} align="center" />
                                ))}
                              </div>
                            </div>
                          )}
                        </TwoColumnLayout>
                      </div>
                    )
                  }

                  return (
                    <div key="SecondarySponsorBlock">
                      {categoryIndex > 0 && (
                        <SectionDivider />
                      )}
                      {/* Parent heading */}
                      <div className="mb-2 sm:mb-2.5 md:mb-3">
                        <SectionTitle>Secondary Sponsors</SectionTitle>
                      </div>
                      {secondarySponsorGroups.map(renderPairedGroup)}
                    </div>
                  )
                }

                // Default: single title, centered content
                return (
                  <div key={category}>
                    {categoryIndex > 0 && (
                      <SectionDivider />
                    )}
                    <TwoColumnLayout singleTitle={category} centerContent={true}>
                      {(() => {
                        const SINGLE_COLUMN_SECTIONS = new Set([
                          "Best Man",
                          "Maid of Honor",
                          "Ring Bearer",
                          "Coin Bearer",
                          "Bible Bearer",
                          "Flower Girls",
                          "Presider",
                        ])
                        // Special rule: paired sponsor roles with exactly 2 names should meet at center
                        const PAIRED_SECTIONS = new Set(["Candle Sponsors", "Cord Sponsors", "Veil Sponsors"])
                        if (PAIRED_SECTIONS.has(category) && members.length === 2) {
                          const left = members[0]
                          const right = members[1]
                          return (
                            <>
                              <div className="px-1.5 sm:px-2 md:px-2.5">
                                <NameItem member={left} align="right" />
                              </div>
                              <div className="px-1.5 sm:px-2 md:px-2.5">
                                <NameItem member={right} align="left" />
                              </div>
                            </>
                          )
                        }
                        if (SINGLE_COLUMN_SECTIONS.has(category) || members.length <= 2) {
                          return (
                            <div className="col-span-full">
                              <div className="max-w-sm mx-auto flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
                                {members.map((member, idx) => (
                                  <NameItem key={`${category}-${idx}-${member.name}`} member={member} align="center" />
                                ))}
                              </div>
                            </div>
                          )
                        }
                        // Default two-column sections: render row-by-row pairs to keep alignment on small screens
                        const half = Math.ceil(members.length / 2)
                        const left = members.slice(0, half)
                        const right = members.slice(half)
                        const maxLen = Math.max(left.length, right.length)
                        const rows = []
                        for (let i = 0; i < maxLen; i++) {
                          const l = left[i]
                          const r = right[i]
                          rows.push(
                            <React.Fragment key={`${category}-row-${i}`}>
                              <div key={`${category}-cell-left-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                {l ? <NameItem member={l} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                              <div key={`${category}-cell-right-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                {r ? <NameItem member={r} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                            </React.Fragment>
                          )
                        }
                        return rows
                      })()}
                    </TwoColumnLayout>
                  </div>
                )
              })}
            </>
            )}
          </div>
        </div>
      </div>
      </section>
    </div>
  )
}