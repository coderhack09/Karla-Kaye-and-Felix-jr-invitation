"use client"

import { useState, useEffect } from "react"
import { Heart, RefreshCw, TrendingUp, Mail, Users, MapPin, Calendar, Crown } from "lucide-react"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import Image from "next/image"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400"],
})

interface Guest {
  id: string | number
  name: string
  role: string
  email?: string
  contact?: string
  message?: string
  allowedGuests: number
  companions: { name: string; relationship: string }[]
  tableNumber: string
  isVip: boolean
  status: 'pending' | 'confirmed' | 'declined' | 'request'
  addedBy?: string
  createdAt?: string
  updatedAt?: string
}

const CARDS_PER_VIEW = 4

const textColor = "color-mix(in srgb, var(--color-motif-cream) 50%, white)"
const cardTextColor = "var(--color-motif-soft)"
const accentColor = "var(--color-motif-accent)"
const cardBg = "color-mix(in srgb, var(--color-motif-cream) 18%, white)"
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

export function BookOfGuests() {
  const [totalGuests, setTotalGuests] = useState(0)
  const [rsvpCount, setRsvpCount] = useState(0)
  const [confirmedGuests, setConfirmedGuests] = useState<Guest[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [previousTotal, setPreviousTotal] = useState(0)
  const [showIncrease, setShowIncrease] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [justEntered, setJustEntered] = useState(false)

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Helper function to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const fetchGuests = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true)
    
    try {
      // Fetch from local API route which connects to Google Sheets
      const response = await fetch("/api/guests", {
        cache: "no-store"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch guest list")
      }

      const data: Guest[] = await response.json()

      // Filter only confirmed/attending guests
      const attendingGuests = data.filter((guest) => guest.status === "confirmed")
      
      // Sort guests: VIPs first, then by updatedAt (most recent first)
      const sortedGuests = attendingGuests.sort((a, b) => {
        // VIPs come first
        if (a.isVip && !b.isVip) return -1
        if (!a.isVip && b.isVip) return 1
        
        // Then sort by most recent update
        const dateA = new Date(a.updatedAt || 0).getTime()
        const dateB = new Date(b.updatedAt || 0).getTime()
        return dateB - dateA
      })
      
      // Calculate total guests by summing allowedGuests for each confirmed guest
      const totalGuestCount = attendingGuests.reduce((sum, guest) => {
        return sum + (guest.allowedGuests || 1)
      }, 0)
      
      // Show increase animation if count went up
      if (totalGuestCount > totalGuests && totalGuests > 0) {
        setPreviousTotal(totalGuests)
        setShowIncrease(true)
        setTimeout(() => setShowIncrease(false), 2000)
      }
      
      setTotalGuests(totalGuestCount)
      setRsvpCount(attendingGuests.length)
      setConfirmedGuests(sortedGuests)
      setLastUpdate(new Date())
    } catch (error: any) {
      console.error("Failed to load guests:", error)
    } finally {
      if (showLoading) {
        setTimeout(() => setIsRefreshing(false), 500)
      }
    }
  }

  // Get visible guests (max 4 cards) for carousel
  const getVisibleGuests = () => {
    if (confirmedGuests.length <= CARDS_PER_VIEW) return confirmedGuests
    const visible: Guest[] = []
    for (let i = 0; i < CARDS_PER_VIEW; i++) {
      const index = (currentIndex + i) % confirmedGuests.length
      visible.push(confirmedGuests[index])
    }
    return visible
  }

  useEffect(() => {
    // Initial fetch
    fetchGuests()

    // Set up automatic polling every 30 seconds for real-time updates
    const pollInterval = setInterval(() => {
      fetchGuests()
    }, 30000) // 30 seconds

    // Set up event listener for RSVP updates
    const handleRsvpUpdate = () => {
      // Add a small delay to allow Google Sheets to update
      setTimeout(() => {
        fetchGuests(true)
      }, 2000)
    }

    window.addEventListener("rsvpUpdated", handleRsvpUpdate)

    return () => {
      clearInterval(pollInterval)
      window.removeEventListener("rsvpUpdated", handleRsvpUpdate)
    }
  }, [totalGuests])

  // Auto-rotate carousel every 5 seconds when more than 4 guests
  useEffect(() => {
    if (confirmedGuests.length <= CARDS_PER_VIEW) return
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = prev + CARDS_PER_VIEW
          return next >= confirmedGuests.length ? 0 : next
        })
        setIsTransitioning(false)
        setJustEntered(true)
        setTimeout(() => setJustEntered(false), 1100)
      }, 600)
    }, 5000)
    return () => clearInterval(interval)
  }, [confirmedGuests.length])

  return (
    <div
      id="guests"
      className="relative z-10 overflow-hidden isolate bg-transparent py-4 sm:py-8 md:py-12 lg:py-16"
    >
      {/* Flower decoration */}
      {/* <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-70 scale-y-[-1]"
          priority={false}
          style={{ filter: DECO_FILTER }}
        />
      </div> */}
      {/* <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-70 scale-x-[-1] scale-y-[-1]"
          priority={false}
          style={{ filter: DECO_FILTER }}
        />
      </div> */}
      {/* <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-70"
          priority={false}
          style={{ filter: DECO_FILTER }}
        />
      </div> */}
      {/* <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-70 scale-x-[-1]"
          priority={false}
          style={{ filter: DECO_FILTER }}
        />
      </div> */}

      {/* Section Header */}
      <div className="relative z-10 text-center mb-3 sm:mb-4 md:mb-6 px-2 sm:px-3 md:px-4">
        <p
          className={`${cormorant.className} text-[0.6rem] sm:text-[0.7rem] md:text-xs uppercase tracking-[0.25em] mb-1 sm:mb-1.5 mt-4 sm:mt-6 md:mt-8`}
          style={{ color: textColor }}
        >
          Our Cherished Guests
        </p>
        <MotifDivider />
        <h2
          className="leading-none"
          style={{
            fontFamily: "var(--font-brittany), cursive",
            fontSize: "clamp(2rem, 9vw, 4.5rem)",
            color: textColor,
            letterSpacing: "0.01em",
            textShadow: "0 2px 12px color-mix(in srgb, var(--color-motif-soft) 45%, transparent)",
          }}
        >
          Book of Guests
        </h2>
        <p
          className={`${cormorant.className} text-[10px] sm:text-xs md:text-sm font-light max-w-lg mx-auto leading-relaxed px-2 mt-2 sm:mt-2.5`}
          style={{ color: textColor }}
        >
          Meet the cherished souls joining us in celebration — your presence makes our day truly special
        </p>
      </div>

      {/* Guests content */}
      <div className="relative">
        {/* Stats card — cream card with warm brown accents */}
        <div className="text-center mb-2.5 sm:mb-4 md:mb-6 px-2 sm:px-4 md:px-6">
          <div className="relative max-w-3xl mx-auto">
            <div
              className="relative rounded-xl border border-motif-accent/25 backdrop-blur-md p-3 shadow-lg transition-all duration-300 sm:rounded-2xl sm:p-5 md:p-6"
              style={{
                backgroundColor: cardBg,
                boxShadow: "0 4px 24px color-mix(in srgb, var(--color-motif-soft) 12%, transparent)",
              }}
            >
              <button
                onClick={() => fetchGuests(true)}
                disabled={isRefreshing}
                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 sm:p-2 rounded-full transition-all duration-300 disabled:opacity-50 group z-10 hover:scale-110"
                style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-accent) 12%, transparent)" }}
                title="Refresh counts"
              >
                <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-500 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180"}`} style={{ color: accentColor }} />
              </button>

              <div className="mb-1.5 sm:mb-2.5">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                  <h3 className={`${cinzel.className} text-xl sm:text-3xl md:text-4xl font-bold transition-all duration-500 ${showIncrease ? "scale-110" : ""}`} style={{ color: cardTextColor }}>
                    {totalGuests}
                  </h3>
                  {showIncrease && (
                    <TrendingUp className="h-3.5 w-3.5 sm:h-5 sm:w-5 animate-bounce" style={{ color: accentColor }} />
                  )}
                  <p className={`${cormorant.className} text-sm sm:text-lg md:text-xl font-medium leading-tight`} style={{ color: cardTextColor }}>
                    {totalGuests === 1 ? "Guest" : "Guests"} Celebrating With Us
                  </p>
                </div>
              </div>

              <p className={`${cormorant.className} text-xs sm:text-base mb-2 sm:mb-3`} style={{ color: cardTextColor, opacity: 0.9 }}>
                {rsvpCount} {rsvpCount === 1 ? "RSVP entry" : "RSVP entries"}
              </p>
              <p className={`${cormorant.className} text-[10px] sm:text-xs md:text-sm leading-tight`} style={{ color: cardTextColor, opacity: 0.85 }}>
                Thank you for confirming your RSVP! Your presence means the world to us.
              </p>
            </div>
          </div>
        </div>

        {/* Guest List Display - 4 cards with carousel */}
        {confirmedGuests.length > 0 && (
          <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6">
            <div
              className="relative overflow-hidden"
              style={{
                perspective: "1200px",
                perspectiveOrigin: "center 85%",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={`space-y-2 sm:space-y-3 md:space-y-4 ${isTransitioning ? "animate-guest-roll-out" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {getVisibleGuests().map((guest, index) => (
                  <div
                    key={`${guest.id}-${currentIndex}-${index}`}
                    className={`relative group rounded-xl sm:rounded-2xl p-2.5 sm:p-4 md:p-6 transition-all duration-300 border hover:shadow-xl ${justEntered ? "animate-guest-roll-in" : ""}`}
                    style={{
                      backgroundColor: cardBg,
                      borderColor: "color-mix(in srgb, var(--color-motif-accent) 25%, transparent)",
                      boxShadow: "0 2px 12px color-mix(in srgb, var(--color-motif-soft) 8%, transparent)",
                      ...(justEntered
                        ? {
                            animationDelay: `${index * 120}ms`,
                            backfaceVisibility: "hidden",
                          }
                        : {}),
                    }}
                  >
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-2.5 md:mb-3">
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-md ring-2 ring-white/60 bg-motif-soft"
                      >
                        <span className="font-semibold text-xs sm:text-base md:text-lg" style={{ color: textColor }}>
                          {getInitials(guest.name)}
                        </span>
                      </div>
                      {guest.isVip && (
                        <div className="absolute -top-0.5 -right-0.5">
                          <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-md border-2 border-white">
                            <Crown className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3.5 md:w-3.5 text-white fill-current" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="mb-1 sm:mb-1.5">
                        <h3 className={`${cinzel.className} text-xs sm:text-base md:text-lg font-semibold sm:font-bold leading-tight mb-0.5`} style={{ color: cardTextColor }}>
                          {guest.name}
                        </h3>
                        {guest.role && (
                          <p className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-medium opacity-80`} style={{ color: cardTextColor }}>
                            {guest.role}
                          </p>
                        )}
                      </div>
{/* 
                      {guest.email && (
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] md:text-xs mb-1.5 sm:mb-2 md:mb-3 opacity-75" style={{ color: cardTextColor }}>
                          <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" style={{ color: accentColor }} />
                          <span className="truncate">{guest.email}</span>
                        </div>
                      )} */}

                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2 mb-1.5 sm:mb-2 md:mb-3">
                        <div
                          className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-lg border"
                          style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-accent) 10%, transparent)", borderColor: "color-mix(in srgb, var(--color-motif-accent) 25%, transparent)" }}
                        >
                          <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 flex-shrink-0" style={{ color: accentColor }} />
                          <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-semibold`} style={{ color: cardTextColor }}>
                            {guest.allowedGuests} {guest.allowedGuests === 1 ? "Guest" : "Guests"}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-lg border"
                          style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-accent) 10%, transparent)", borderColor: "color-mix(in srgb, var(--color-motif-accent) 25%, transparent)" }}
                        >
                          <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 flex-shrink-0" style={{ color: accentColor }} />
                          <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-semibold`} style={{ color: cardTextColor }}>
                            {guest.tableNumber && guest.tableNumber.trim() !== "" ? (
                              <>Table {guest.tableNumber}</>
                            ) : (
                              <span className="opacity-65">Not Assigned</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* {guest.message && guest.message.trim() !== "" && (
                        <div
                          className="relative mb-1.5 sm:mb-2.5 md:mb-3 p-2 sm:p-3 md:p-5 rounded-lg md:rounded-xl border overflow-hidden"
                          style={{ backgroundColor: cardBg, borderColor: "color-mix(in srgb, var(--color-motif-accent) 15%, transparent)" }}
                        >
                          <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-[0.06]" style={{ color: accentColor }}>
                            <svg viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 L100,0 L0,100 Z" /></svg>
                          </div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-[0.06]" style={{ color: accentColor }}>
                            <svg viewBox="0 0 100 100" fill="currentColor"><path d="M100,100 L0,100 L100,0 Z" /></svg>
                          </div>
                          <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 md:top-2 md:left-2 opacity-20" style={{ color: accentColor }}>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" /></svg>
                          </div>
                          <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 md:bottom-2 md:right-2 opacity-20" style={{ color: accentColor }}>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 7h-3l-2 4v6h6v-6h-3zm-8 0H7l-2 4v6h6v-6h-3z" /></svg>
                          </div>
                          <div className="relative px-0.5 sm:px-1">
                            <p className={`${cormorant.className} text-[10px] sm:text-xs md:text-base leading-tight sm:leading-relaxed italic font-medium`} style={{ color: cardTextColor }}>
                              {guest.message}
                            </p>
                          </div>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-8 sm:h-12 md:h-16 rounded-r-full opacity-40 bg-motif-accent/40" />
                        </div>
                      )} */}

                      {guest.companions && guest.companions.length > 0 && (
                        <div className="pt-1.5 sm:pt-2 md:pt-2.5 border-t border-motif-accent/20">
                          <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
                            <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" style={{ color: accentColor }} />
                            <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-semibold`} style={{ color: cardTextColor }}>Companions</span>
                          </div>
                          <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {guest.companions.map((companion, idx) => (
                              <div
                                key={idx}
                                className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-lg border transition-colors hover:border-opacity-60"
                                style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 80%, white)", borderColor: "color-mix(in srgb, var(--color-motif-accent) 20%, transparent)" }}
                              >
                                <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-medium whitespace-nowrap`} style={{ color: cardTextColor }}>{companion.name}</span>
                                {companion.relationship && companion.relationship.trim() !== "" && (
                                  <span className={`${cormorant.className} text-[8px] sm:text-[9px] md:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full border whitespace-nowrap`} style={{ color: cardTextColor, backgroundColor: "color-mix(in srgb, var(--color-motif-accent) 10%, transparent)", borderColor: "color-mix(in srgb, var(--color-motif-accent) 20%, transparent)" }}>
                                    {companion.relationship}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1 pt-1.5 sm:pt-2 md:pt-2.5 mt-1.5 sm:mt-2 md:mt-2.5 border-t border-motif-accent/15">
                        <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-70" style={{ color: accentColor }} />
                        <span className={`${cormorant.className} text-[8px] sm:text-[9px] md:text-[10px] opacity-80`} style={{ color: cardTextColor }}>
                          Confirmed {formatDate(guest.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>

              {/* Carousel indicators — warm brown */}
              {confirmedGuests.length > CARDS_PER_VIEW && (
                <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
                  {Array.from({ length: Math.ceil(confirmedGuests.length / CARDS_PER_VIEW) }).map((_, idx) => {
                    const pageIndex = Math.floor(currentIndex / CARDS_PER_VIEW)
                    const isActive = pageIndex === idx
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setCurrentIndex(idx * CARDS_PER_VIEW)
                            setIsTransitioning(false)
                            setJustEntered(true)
                            setTimeout(() => setJustEntered(false), 1100)
                          }, 600)
                        }}
                        className="h-2 rounded-full transition-all duration-300 hover:opacity-90"
                        style={{
                          width: isActive ? "1.75rem" : "0.5rem",
                          backgroundColor: isActive ? accentColor : "color-mix(in srgb, var(--color-motif-accent) 35%, transparent)",
                        }}
                        aria-label={`Go to page ${idx + 1}`}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}