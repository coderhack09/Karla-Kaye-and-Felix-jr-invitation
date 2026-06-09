"use client"

import { Section } from "@/components/section"
import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { useSiteConfig } from "@/hooks/use-site-config"
import Image from "next/image"
import { Cinzel, Cormorant_Garamond } from "next/font/google"
import {
  Shirt,
  Clock,
  Utensils,
  Copy,
  Check,
  Navigation,
  Heart,
  Camera,
  X,
  MapPin,
} from "lucide-react"


const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})  

// Colors sourced from globals.css @theme inline — edit there to update everywhere

export function Details() {
  const siteConfig = useSiteConfig()
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [currentReceptionImageIndex, setCurrentReceptionImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [rotationOffset, setRotationOffset] = useState(0)
  
  const coupleImages = [
    "/frontboxes/box_1.webp",
    "/frontboxes/box_2.webp",
    "/frontboxes/box_3.webp",
    "/frontboxes/hero.webp",
  ]

  const receptionImages = siteConfig.reception.image

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReceptionImageIndex((prev) => (prev + 1) % receptionImages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // Gentle reminders couple photos — subtle carousel + wobble animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % coupleImages.length)
      setRotationOffset((prev) => (prev + 10) % 360)
    }, 2600)

    return () => clearInterval(interval)
  }, [coupleImages.length])

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => new Set(prev).add(itemId))
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Venue information from site config
  const ceremonyVenueName = siteConfig.ceremony.location
  const ceremonyVenueDetail = ""
  const ceremonyAddress = siteConfig.ceremony.venue
  const ceremonyVenue = `${ceremonyVenueName}, ${ceremonyAddress}`
  const ceremonyMapsLink = siteConfig.ceremony.map

  const receptionVenueName = siteConfig.reception.location
  const receptionVenueDetail = ""
  const receptionAddress = siteConfig.reception.venue
  const receptionVenue = `${receptionVenueName}, ${receptionAddress}`
  const receptionMapsLink = `https://maps.google.com/?q=${encodeURIComponent(receptionVenue)}`

  // Aliases used in the image modal
  const ceremonyLocationFormatted = ceremonyVenueName
  const receptionLocationFormatted = receptionVenueName
  const ceremonyLocation = ceremonyVenue
  const receptionLocation = receptionVenue
  const formattedCeremonyDate = siteConfig.ceremony.date
  const formattedReceptionDate = siteConfig.ceremony.date // reception follows ceremony on same day

  const DECO_FILTER = "brightness(0) saturate(100%) invert(39%) sepia(18%) saturate(486%) hue-rotate(62deg) brightness(94%) contrast(88%)"

  const openInMaps = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }


  return (
    <Section
      id="details"
      className="relative py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden bg-motif-cream"
    >
      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            background: 'linear-gradient(165deg, var(--color-motif-cream) 0%, color-mix(in srgb, var(--color-motif-silver) 14%, transparent) 35%, color-mix(in srgb, var(--color-motif-medium) 6%, transparent) 70%, color-mix(in srgb, var(--color-motif-deep) 3%, transparent) 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 15%, var(--color-motif-silver) 0%, transparent 55%)' }}
        />
      </div>

      {/* Flower decoration - top left corner */}
      <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-65 scale-y-[-1]"
          style={{ filter: DECO_FILTER }}
          priority={false}
        />
      </div>

      {/* Flower decoration - top right corner */}
      <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-65 scale-x-[-1] scale-y-[-1]"
          style={{ filter: DECO_FILTER }}
          priority={false}
        />
      </div>

      {/* Flower decoration - left bottom corner */}
      <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-65"
          style={{ filter: DECO_FILTER }}
          priority={false}
        />
      </div>

      {/* Flower decoration - right bottom corner */}
      <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-65 scale-x-[-1]"
          style={{ filter: DECO_FILTER }}
          priority={false}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 mb-4 sm:mb-5">
          <div className="h-px w-16 sm:w-24 bg-motif-silver/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-motif-silver shadow-[0_0_18px_color-mix(in_srgb,var(--color-motif-silver)_80%,transparent)]" />
          <div className="h-px w-16 sm:w-24 bg-motif-silver/60" />
        </div>
        <h2
          className="leading-none" style={{
            fontFamily: "var(--font-brittany), cursive",
            fontSize: "clamp(2rem, 9vw, 4.5rem)",
            color: "var(--color-motif-deep)",
            letterSpacing: "0.01em",
          }}
        >
          Event Details
        </h2>
        <p
          className={`${cinzel.className} text-sm sm:text-base md:text-lg text-motif-medium font-normal max-w-xl mx-auto leading-relaxed tracking-[0.14em] px-4`}
        >
          Everything you need to know about our special day.
        </p>
      </div>

      {/* Venue and Event Information */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12 md:mb-16 space-y-6 sm:space-y-10 md:space-y-14">
        
        {/* Ceremony Card */}
        <div className="relative group">
          {/* Subtle champagne glow on hover */}
          <div className="absolute -inset-1 bg-gradient-to-br from-motif-silver/22 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
          
          {/* Main card */}
          <div className="relative bg-motif-cream rounded-xl sm:rounded-2xl overflow-hidden border border-motif-deep/20  shadow-[0_16px_40px_rgba(0,0,0,0.18)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.24)] hover:border-motif-deep/80 transition-all duration-300">
            {/* Venue Image */}
            <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[30rem] overflow-hidden">
              <Image
                src={siteConfig.ceremony.image}
                alt={siteConfig.ceremony.location}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Venue name overlay with warm gold accent */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 right-3 sm:right-4 md:right-6">
                <h3 className={`${cinzel.className} text-lg sm:text-xl md:text-2xl lg:text-3xl font-[family-name:var(--font-crimson)] font-normal text-white mb-0.5 sm:mb-1 drop-shadow-lg uppercase tracking-[0.1em] leading-tight`}>
                  {siteConfig.ceremony.location}
                </h3>
                <p className={`${cinzel.className} text-xs sm:text-sm md:text-base text-white/95 drop-shadow-md tracking-wide`}>
                  {siteConfig.ceremony.venue}
                </p>
              </div>
            </div>

            {/* Event Details Content */}
            <div className="p-3 sm:p-5 md:p-7 lg:p-9">
              {/* Date Section */}
              <div className="text-center mb-5 sm:mb-8 md:mb-10">
                {/* Day name */}
                <p className={`${cinzel.className} text-[10px] sm:text-xs md:text-sm font-semibold text-motif-medium uppercase tracking-[0.2em] mb-2 sm:mb-3`}>
                  {siteConfig.ceremony.day}
                </p>
                
                {/* Month - Script style with warm gold */}
                <div className="mb-2 sm:mb-4">
                  <p className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-motif-medium leading-none`}>
                  {new Date(siteConfig.ceremony.date).toLocaleString('default', { month: 'long' })}
                  </p>
                </div>
                
                {/* Day and Year */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-7">
                  <p className={`${cinzel.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-motif-deep leading-none`}>
                  {new Date(siteConfig.ceremony.date).getDate()}
                  </p>
                  <div className="h-10 sm:h-12 md:h-16 lg:h-20 w-[2px] bg-gradient-to-b from-motif-medium via-motif-deep to-motif-medium" />
                  <p className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-motif-deep leading-none`}>
                  {new Date(siteConfig.ceremony.date).getFullYear()}
                  </p>
                </div>

                {/* Decorative line */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="h-[1px] w-8 sm:w-10 md:w-14 bg-gradient-to-r from-transparent via-motif-medium to-motif-medium" />
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-motif-medium rounded-full" />
                  <div className="h-[1px] w-8 sm:w-10 md:w-14 bg-gradient-to-l from-transparent via-motif-medium to-motif-medium" />
                </div>

                {/* Time */}
                <p className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-motif-deep tracking-wide`}>
                  {siteConfig.ceremony.time}
                </p>
              </div>

              {/* Location Details */}
              <div className="bg-gradient-to-br from-motif-cream/40 to-motif-cream rounded-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border border-motif-deep/15">
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-motif-deep mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm md:text-base font-[family-name:var(--font-crimson)] font-semibold text-motif-deep mb-1.5 sm:mb-2 uppercase tracking-wide">
                      Location
                    </p>
                    <p className={`${cinzel.className} text-xs sm:text-sm md:text-base lg:text-lg font-[family-name:var(--font-crimson)] text-motif-deep leading-relaxed`}>
                      {ceremonyVenueName}
                    </p>
                    {ceremonyVenueDetail && (
                      <p className={`${cinzel.className} text-[10px] sm:text-xs md:text-sm font-[family-name:var(--font-crimson)] text-motif-medium/70 leading-relaxed mt-1`}>
                        {ceremonyVenueDetail}
                      </p>
                    )}
                    <p className={`${cinzel.className} text-[10px] sm:text-xs md:text-sm font-[family-name:var(--font-crimson)] text-motif-deep/70 leading-relaxed`}>
                      {ceremonyAddress}
                    </p>
                  </div>
                  {/* QR Code for Ceremony - Right side */}
                  <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <div className="bg-motif-cream p-1.5 sm:p-2 md:p-2.5 rounded-lg border border-motif-deep/20 shadow-sm">
                      <QRCodeSVG
                        value={ceremonyMapsLink}
                        size={80}
                        level="M"
                        includeMargin={false}
                        fgColor="var(--color-motif-deep)"
                        bgColor="var(--color-motif-cream)"
                      />
                    </div>
                    <p className="text-[9px] sm:text-[10px] md:text-xs font-[family-name:var(--font-crimson)] text-motif-deep/60 italic text-center max-w-[80px]">
                      Scan for directions
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => openInMaps(ceremonyMapsLink)}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-motif-deep hover:bg-motif-accent text-motif-cream rounded-lg font-[family-name:var(--font-crimson)] font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] premium-shadow"
                  aria-label="Get directions to ceremony venue"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span>Get Directions</span>
                </button>
                <button
                  onClick={() => copyToClipboard(ceremonyVenue, 'ceremony')}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-motif-cream border-2 border-motif-deep/30 hover:border-motif-deep/50 hover:bg-motif-silver/20 text-motif-deep rounded-lg font-[family-name:var(--font-crimson)] font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  aria-label="Copy ceremony venue address"
                >
                  {copiedItems.has('ceremony') ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 text-motif-deep" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  )}
                  <span>{copiedItems.has('ceremony') ? 'Copied!' : 'Copy Address'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reception Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-br from-motif-silver/22 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />

          <div className="relative elegant-card bg-motif-cream rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.18)] border border-motif-deep/25 premium-shadow hover:border-motif-deep/45 transition-all duration-300">
       
            <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[30rem] overflow-hidden">
              {receptionImages.map((src, index) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentReceptionImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={src}
                    alt={siteConfig.reception.venue}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                    priority={index === 0}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              
          
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 right-3 sm:right-4 md:right-6 z-20">
                <h3 className={`${cinzel.className} text-lg sm:text-xl md:text-2xl lg:text-3xl font-[family-name:var(--font-crimson)] font-normal text-white mb-0.5 sm:mb-1 drop-shadow-lg uppercase tracking-[0.1em] leading-tight`}>
                  {siteConfig.reception.location}
                </h3>
                <p className={`${cinzel.className} text-xs sm:text-sm md:text-base font-[family-name:var(--font-crimson)] text-white/95 drop-shadow-md tracking-wide`}>
                  {siteConfig.reception.venue}
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-5 md:p-7 lg:p-9">
         
              <div className="text-center mb-5 sm:mb-8">
                {siteConfig.reception.time === "To follow after the ceremony" ? (
                  <p className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl font-[family-name:var(--font-crimson)]  font-semibold text-motif-deep tracking-wide`}>
                    To follow after the ceremony
                  </p>
                ) : (
                  <>
                    <p className={`${cinzel.className} text-[10px] sm:text-xs md:text-sm font-[family-name:var(--font-crimson)] font-semibold text-motif-medium uppercase tracking-[0.2em] mb-2 sm:mb-3`}>
                      {siteConfig.reception.time === "After ceremony" ? "Starts" : "Starts at"}
                    </p>
                    <p className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl font-[family-name:var(--font-crimson)] font-semibold text-motif-deep tracking-wide`}>
                      {siteConfig.reception.time}
                    </p>
                  </>
                )}
              </div>

        
              <div className="bg-gradient-to-br from-motif-cream/40 to-motif-cream rounded-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border border-motif-deep/15">
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-motif-deep mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm md:text-base font-[family-name:var(--font-crimson)] font-semibold text-motif-deep mb-1.5 sm:mb-2 uppercase tracking-wide">
                      Location
                    </p>
                    <p className={`${cinzel.className} text-xs sm:text-sm md:text-base lg:text-lg font-[family-name:var(--font-crimson)] text-motif-deep leading-relaxed`}>
                      {receptionVenueName}
                    </p>
                    {receptionVenueDetail && (
                    <p className={`${cinzel.className} text-[10px] sm:text-xs md:text-sm font-[family-name:var(--font-crimson)] text-motif-deep/70 leading-relaxed mt-1`}>
                        {receptionVenueDetail}
                      </p>
                    )}
                    <p className={`${cinzel.className} text-[10px] sm:text-xs md:text-sm font-[family-name:var(--font-crimson)] text-motif-deep/70 leading-relaxed`}>
                      {receptionAddress}
                    </p>
                  </div>
              
                  <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <div className="bg-motif-cream p-1.5 sm:p-2 md:p-2.5 rounded-lg border border-motif-deep/20 shadow-sm">
                      <QRCodeSVG
                        value={receptionMapsLink}
                        size={80}
                        level="M"
                        includeMargin={false}
                        fgColor="var(--color-motif-deep)"
                        bgColor="var(--color-motif-cream)"
                      />
                    </div>
                    <p className="text-[9px] sm:text-[10px] md:text-xs font-[family-name:var(--font-crimson)] text-motif-deep/60 italic text-center max-w-[80px]">
                      Scan for directions
                    </p>
                  </div>
                </div>
              </div>

     
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => openInMaps(receptionMapsLink)}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-motif-deep hover:bg-motif-accent text-motif-cream rounded-lg font-[family-name:var(--font-crimson)] font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] premium-shadow"
                  aria-label="Get directions to reception venue"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span>Get Directions</span>
                </button>
                <button
                  onClick={() => copyToClipboard(receptionVenue, 'reception')}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-motif-cream border-2 border-motif-deep/30 hover:border-motif-deep/50 hover:bg-motif-silver/20 text-motif-deep rounded-lg font-[family-name:var(--font-crimson)] font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  aria-label="Copy reception venue address"
                >
                  {copiedItems.has('reception') ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 text-motif-deep" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  )}
                  <span>{copiedItems.has('reception') ? 'Copied!' : 'Copy Address'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attire Guidelines */}
    

        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div className="h-px w-10 sm:w-14 md:w-20 bg-motif-silver/60" />
            <Shirt className="w-5 h-5 sm:w-6 sm:h-6 text-motif-silver" />
            <div className="h-px w-10 sm:w-14 md:w-20 bg-motif-silver/60" />
          </div>
          <h3
            className={`${cinzel.className} text-base sm:text-lg md:text-xl lg:text-2xl text-motif-deep uppercase tracking-[0.22em] font-semibold leading-tight`}
            style={{ color: 'var(--color-motif-deep)' }}
          >
            Attire Guidelines
          </h3>
          <div className="flex justify-center mt-3 sm:mt-4 mb-3 sm:mb-4">
            {/* <span
              className={`${cinzel.className} inline-flex items-center gap-2 px-5 py-1.5 sm:py-2 rounded-full bg-motif-deep text-motif-cream text-[10px] sm:text-xs tracking-[0.22em] uppercase font-semibold shadow-md`}
            >
              {siteConfig.dressCode.theme}
            </span> */}
          </div>
          <p className="text-sm sm:text-base md:text-lg text-motif-medium font-normal leading-relaxed">
            Please dress according to the guidelines below.
          </p>
        </div>

        {/* Three attire cards */}
        <div className="space-y-6 sm:space-y-8 md:space-y-10 mb-6 sm:mb-8 md:mb-10">

          {/* ── Principal Sponsors ── */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-motif-silver/22 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
            <div className="relative bg-motif-cream rounded-xl sm:rounded-2xl overflow-hidden border border-motif-deep/20 shadow-[0_16px_40px_rgba(0,0,0,0.14)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.22)] hover:border-motif-deep/70 transition-all duration-300">

              {/* Title */}
              <div className="px-4 sm:px-6 md:px-8 pt-5 sm:pt-7 pb-4 sm:pb-5 text-center">
                <h4 className={`${cinzel.className} text-base sm:text-lg md:text-xl lg:text-2xl text-motif-deep uppercase tracking-[0.22em] font-semibold leading-tight`}>
                  Principal Sponsors
                </h4>
              </div>

              {/* Image */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] max-w-2xl mx-auto rounded-lg sm:rounded-xl overflow-hidden border border-motif-medium/30" style={{ width: 'calc(100% - 2rem)' }}>
                <Image
                  src={siteConfig.dressCode.sponsors.photo}
                  alt="Principal sponsor attire"
                  fill
                  className="object-contain bg-[#FFF7F6]/50 p-2 sm:p-3"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 672px"
                />
              </div>

              {/* Palette — directly below image */}
              <div className="px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-4 sm:pb-5">
                <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                  {siteConfig.dressCode.sponsors.palette.split(',').map((color) => (
                    <div
                      key={color.trim()}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full ring-1 ring-gray-300/60 hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: color.trim() }}
                      title={color.trim()}
                    />
                  ))}
                </div>
              </div>

              {/* Notes — tagline + Gents / Ladies */}
              <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6">
                <div className="border-t border-motif-silver/60 pt-3 sm:pt-3.5">
                  <div className="rounded-md sm:rounded-lg border border-motif-silver/50 bg-motif-cream/60 px-3 py-3 sm:px-4 sm:py-3.5">
                    <p className={`${cormorant.className} text-left text-sm sm:text-base italic text-motif-deep leading-snug sm:leading-relaxed mb-4`}>
                      Your presence will make our day even more special.
                    </p>

                    <div className="space-y-5">
                      <div>
                        <p className={`${cinzel.className} text-left text-sm sm:text-base md:text-lg uppercase tracking-[0.18em] font-semibold text-motif-deep mb-3`}>
                          Principal Sponsors
                        </p>
                        <div className="space-y-2.5">
                          <div>
                            <p className={`${cinzel.className} text-left text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-medium text-motif-deep/65 mb-0.5`}>
                              Ninang
                            </p>
                            <p className={`${cormorant.className} text-motif-deep text-left text-sm sm:text-base leading-snug sm:leading-relaxed`}>
                              Silver or light gray gown
                            </p>
                          </div>
                          <div>
                            <p className={`${cinzel.className} text-left text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-medium text-motif-deep/65 mb-0.5`}>
                              Ninong
                            </p>
                            <p className={`${cormorant.className} text-motif-deep text-left text-sm sm:text-base leading-snug sm:leading-relaxed`}>
                              Charcoal gray tuxedo with dusty blue necktie
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-motif-silver/45" aria-hidden />

                      <div>
                        <p className={`${cinzel.className} text-left text-sm sm:text-base md:text-lg uppercase tracking-[0.18em] font-semibold text-motif-deep mb-3`}>
                          Secondary Sponsors
                        </p>
                        <div className="space-y-2.5">
                          <div>
                            <p className={`${cinzel.className} text-left text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-medium text-motif-deep/65 mb-0.5`}>
                              Gentlemen
                            </p>
                            <p className={`${cormorant.className} text-motif-deep text-left text-sm sm:text-base leading-snug sm:leading-relaxed`}>
                              Dusty blue tuxedo with dusty blue necktie
                            </p>
                          </div>
                          <div>
                            <p className={`${cinzel.className} text-left text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-medium text-motif-deep/65 mb-0.5`}>
                              Ladies
                            </p>
                            <p className={`${cormorant.className} text-motif-deep text-left text-sm sm:text-base leading-snug sm:leading-relaxed`}>
                              Dusty blue gown
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Entourage & Secondary Sponsors ── */}
          <div className="relative group">
          {/* ── Guest Attire ── */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-motif-silver/22 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
            <div className="relative bg-motif-cream rounded-xl sm:rounded-2xl overflow-hidden border border-motif-deep/20 shadow-[0_16px_40px_rgba(0,0,0,0.14)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.22)] hover:border-motif-deep/70 transition-all duration-300">

              {/* Title */}
              <div className="px-4 sm:px-6 md:px-8 pt-5 sm:pt-7 pb-4 sm:pb-5 text-center">
                <h4 className={`${cinzel.className} text-base sm:text-lg md:text-xl lg:text-2xl text-motif-deep uppercase tracking-[0.22em] font-semibold leading-tight`}>
                  Guests
                </h4>
              </div>

              {/* Image */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] max-w-2xl mx-auto rounded-lg sm:rounded-xl overflow-hidden border border-motif-medium/30" style={{ width: 'calc(100% - 2rem)' }}>
                <Image
                  src={siteConfig.dressCode.guests.photo}
                  alt="Guest attire"
                  fill
                  className="object-contain bg-[#FFF7F6]/50 p-2 sm:p-3"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 672px"
                />
              </div>

              {/* Palette — directly below image */}
              <div className="px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-4 sm:pb-5">
                <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                  {siteConfig.dressCode.guests.palette.split(',').map((color) => (
                    <div
                      key={color.trim()}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full ring-1 ring-gray-300/60 hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: color.trim() }}
                      title={color.trim()}
                    />
                  ))}
                </div>
              </div>

              {/* Notes — tagline + Gents / Ladies */}
              <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6">
                <div className="border-t border-motif-silver/60 pt-3 sm:pt-3.5">
                  <div className="rounded-md sm:rounded-lg bg-gradient-to-br from-motif-deep/[0.1] via-motif-cream/45 to-motif-deep/[0.06] border border-motif-deep/20 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                    <p className={`${cinzel.className} text-left text-[10px] sm:text-xs text-motif-deep font-semibold uppercase tracking-[0.22em] mb-1.5`}>
                      Note
                    </p>
                    <p className={`${cormorant.className} text-left text-sm sm:text-base italic text-motif-deep leading-snug sm:leading-relaxed mb-2`}>
                      We kindly ask our guests to wear the colors shown above.
                    </p>
                    
                    <div className="space-y-2 border-l-2 border-motif-deep/45 pl-2.5 sm:pl-3">
                      <div>
                        <p className={`${cinzel.className} text-left text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-motif-deep mb-0.5`}>
                          Gentlemen
                        </p>
                        <p className={`${cormorant.className} text-motif-deep text-left text-sm sm:text-base leading-snug sm:leading-relaxed`}>
                          Long sleeve and slacks.
                        </p>
                      </div>
                      <div>
                        <p className={`${cinzel.className} text-left text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-motif-deep mb-0.5`}>
                          Ladies
                        </p>
                        <p className={`${cormorant.className} text-motif-deep text-left text-sm sm:text-base leading-snug sm:leading-relaxed`}>
                          Dusty blue gown or cocktail dress.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dress code restrictions */}
        <div className="mb-8 sm:mb-10 md:mb-12 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-motif-cream/60 border border-motif-deep/15 shadow-sm">
          <p className={`${cinzel.className} text-[10px] sm:text-xs text-motif-medium uppercase tracking-[0.2em] text-center mb-3 sm:mb-4`}>
            Please Note
          </p>
          <ul className="space-y-2 sm:space-y-3 max-w-2xl mx-auto">
            {[
              "Semi Formal Attire",
              "Please do not wear White and Navy blue",
              "We kindly request that all guests honor the dress code by avoiding overly casual attire, such as t-shirts, slippers, denim, and jeans.",
              "Please adhere to the specified dress code and color motif provided. Dressing accordingly is deeply appreciated, as it will contribute to the elegance and harmony of our celebration.",
              "We look forward to seeing you in your finest that complements our chosen theme!",
            ].map((note, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-motif-deep/40" />
                <p className="text-xs sm:text-sm font-[family-name:var(--font-crimson)] text-motif-deep/90 leading-relaxed">{note}</p>
              </li>
            ))}
          </ul>
        </div>

     {/* Gentle Reminders Container */}
     <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-5 mt-8 sm:mt-12 md:mt-16">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-motif-cream/40 bg-motif-cream backdrop-blur-lg shadow-[0_18px_40px_color-mix(in_srgb,var(--color-motif-cream)_15%,transparent)]">
          {/* Content */}
          <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
            {/* Animated couple photos carousel */}
            <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
              {coupleImages.map((image, index) => {
                const isActive = index === currentImageIndex
                // Alternate rotation: -5deg, 5deg, -3deg, 3deg for variety
                const baseRotation = index === 0 ? -5 : index === 1 ? 5 : index === 2 ? -3 : 3
                // Add gentle rotation animation for active image
                const currentRotation = isActive 
                  ? baseRotation + Math.sin(rotationOffset * Math.PI / 180) * 2 
                  : baseRotation
                
                return (
                  <div
                    key={index}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 border-motif-deep/30 shadow-lg transition-all duration-700 ease-in-out ${
                      isActive ? 'scale-110 z-10' : 'scale-100 opacity-70'
                    }`}
                    style={{
                      transform: `rotate(${currentRotation}deg) ${isActive ? 'scale(1.1)' : 'scale(1)'}`,
                    }}
                  >
                    <Image
                      src={image}
                      alt={`Wedding couple ${index + 1}`}
                      fill
                      className={`object-cover transition-opacity duration-500 ${
                        isActive ? 'opacity-100' : 'opacity-70'
                      }`}
                      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                    />
                  </div>
                )
              })}
            </div>

            {/* Title */}
            <h3 className={`${cinzel.className} text-2xl sm:text-3xl md:text-4xl text-center text-motif-deep mb-6 sm:mb-8 font-normal tracking-wide`}>
              GENTLE REMINDERS
            </h3>

            {/* Reminders List */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 max-w-2xl mx-auto">
               {/* No Kinds */}
               <div className="bg-motif-cream/60 rounded-lg p-4 sm:p-5 md:p-6 border border-motif-deep/10 shadow-sm">
                <h4 className={`${cinzel.className} text-base sm:text-lg md:text-xl font-semibold text-motif-deep mb-2 sm:mb-3`}>
                Adults-Only Celebration
                </h4>
                <p className={`${cormorant.className} text-sm sm:text-base md:text-lg text-motif-deep/80 leading-relaxed`}>
                We kindly request that our wedding be an adults-only occasion. We hope this allows everyone to relax and fully enjoy the celebration with us.
                </p>
              </div>
              {/* Unplugged Ceremony Reminder */}
              <div className="bg-motif-cream/60 rounded-lg p-4 sm:p-5 md:p-6 border border-motif-deep/10 shadow-sm">
                <h4 className={`${cinzel.className} text-base sm:text-lg md:text-xl font-semibold text-motif-deep mb-2 sm:mb-3`}>
                Unplugged Ceremony

                </h4>
                <p className={`${cormorant.className} text-sm sm:text-base md:text-lg text-motif-deep/80 leading-relaxed`}>
                We&apos;re having a mostly unplugged ceremony. Guests may take photos, but we kindly ask that it be kept minimal. Please avoid blocking or crowding our official photographers so they can capture the special moments. We&apos;d love for everyone to stay present and share the moment with us. Don&apos;t worry—professional photos will be shared with you after the event. Thank you for your understanding 
                </p>
              </div>

              {/* Arrival Reminder */}
              {/* <div className="bg-motif-cream/60 rounded-lg p-4 sm:p-5 md:p-6 border border-motif-deep/10 shadow-sm">
                <h4 className={`${cinzel.className} text-base sm:text-lg md:text-xl font-semibold text-motif-deep mb-2 sm:mb-3`}>
                Arrival
                </h4>
                <p className={`${cormorant.className} text-sm sm:text-base md:text-lg text-motif-deep/80 leading-relaxed`}>
                To ensure everything runs smoothly, please arrive at least 30 minutes before the ceremony starts. The program will begin at {siteConfig.ceremony.time}, so we kindly ask everyone to arrive by {siteConfig.ceremony.guestsTime} minutes. This will give you time to find your seat, take in the beautiful setup, and be fully present for our special moment
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-500"
          onClick={() => setShowImageModal(null)}
          style={{ backgroundColor: "rgba(91,102,85,0.96)" }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "var(--color-motif-cream)", opacity: 0.12 }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "var(--color-motif-cream)", opacity: 0.14, animationDelay: "1s" }}
            />
          </div>

          <div
            className="relative max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] bg-motif-deep rounded-3xl overflow-hidden shadow-2xl border-2 animate-in zoom-in-95 duration-500 group"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: "var(--color-motif-cream)" }}
          >
            {/* Decorative top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
              style={{ background: "linear-gradient(to right, var(--color-motif-cream), var(--color-motif-cream), var(--color-motif-deep))" }}
            />

            {/* Enhanced close button */}
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 z-20 hover:bg-motif-accent backdrop-blur-sm p-2.5 sm:p-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 border-2 group/close"
              title="Close (ESC)"
              style={{ backgroundColor: "var(--color-motif-deep)", borderColor: "var(--color-motif-cream)", color: "var(--color-motif-cream)" }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover/close:text-[#E1D5C7] transition-colors" />
            </button>

            {/* Venue badge */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 z-20">
              <div
                className="flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border-2"
                style={{ backgroundColor: "var(--color-motif-deep)", borderColor: "var(--color-motif-cream)" }}
              >
                {showImageModal === "ceremony" ? (
                  <>
                    <Heart className="w-4 h-4" fill="var(--color-motif-cream)" style={{ color: "var(--color-motif-cream)" }} />
                    <span className="text-xs sm:text-sm font-bold text-motif-cream">
                      Ceremony Venue
                    </span>
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4 text-motif-cream" />
                    <span className="text-xs sm:text-sm font-bold text-motif-cream">
                      Reception Venue
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Image section with enhanced effects */}
            <div
              className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden"
              style={{ backgroundColor: "var(--color-motif-deep)" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />

              <Image
                src={showImageModal === "ceremony" ? "/Details/ceremony&location.jpg" : "/Details/Kayama Mountain Resort And Events Place, Sitio Kaytuyang, Brgy. Aga Nasugbu, Batangas.png"}
                alt={showImageModal === "ceremony" ? ceremonyLocationFormatted : receptionLocationFormatted}
                fill
                className="object-contain p-6 sm:p-8 md:p-10 transition-transform duration-700 group-hover:scale-105 z-10"
                sizes="95vw"
                priority
              />
            </div>

            {/* Enhanced content section */}
            <div
              className={`${cormorant.className} p-5 sm:p-6 md:p-8 bg-motif-deep backdrop-blur-sm border-t-2 relative`}
              style={{ borderColor: "var(--color-motif-cream)" }}
            >
              {/* Decorative line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-motif-cream/30 to-transparent" />

              <div className="space-y-5">
                {/* Header with venue info */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-3`}
                      style={{ color: "var(--color-motif-cream)" }}
                    >
                      {showImageModal === "ceremony" ? (
                        <Heart className="w-6 h-6 text-motif-cream" fill="var(--color-motif-cream)" />
                      ) : (
                        <Utensils className="w-6 h-6 text-motif-cream" />
                      )}
                      {showImageModal === "ceremony" ? siteConfig.ceremony.venue : siteConfig.reception.venue}
                    </h3>
                    <div className="flex items-center gap-2 text-sm opacity-70 text-motif-cream">
                      <MapPin className="w-4 h-4 text-motif-cream" />
                      <span>
                        {showImageModal === "ceremony"
                          ? ceremonyLocationFormatted
                          : receptionLocationFormatted}
                      </span>
                    </div>

                    {/* Date & Time info */}
                    {showImageModal === "ceremony" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "var(--color-motif-cream)",
                          backgroundColor: "var(--color-motif-deep)",
                          opacity: 0.9,
                          borderColor: "var(--color-motif-cream)",
                        }}
                      >
                        <Clock className="w-4 h-4 text-motif-cream" />
                        <span>
                          {formattedCeremonyDate} at {siteConfig.ceremony.time}
                        </span>
                      </div>
                    )}
                    {showImageModal === "reception" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "var(--color-motif-cream)",
                          backgroundColor: "var(--color-motif-deep)",
                          opacity: 0.9,
                          borderColor: "var(--color-motif-cream)",
                        }}
                      >
                        <Clock className="w-4 h-4 text-motif-cream" />
                        <span>
                          {formattedReceptionDate} - {siteConfig.reception.time}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          showImageModal === "ceremony"
                            ? ceremonyLocation
                            : receptionLocation,
                          `modal-${showImageModal}`,
                        )
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-motif-deep border-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md hover:bg-motif-accent whitespace-nowrap text-motif-cream"
                      title="Copy address"
                      style={{ borderColor: "var(--color-motif-cream)" }}
                    >
                      {copiedItems.has(`modal-${showImageModal}`) ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        openInMaps(showImageModal === "ceremony" ? ceremonyMapsLink : receptionMapsLink)
                      }
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg whitespace-nowrap bg-motif-cream text-motif-deep"
                    >
                      <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>

                {/* Additional info */}
                  <div className="flex items-center gap-2 text-xs opacity-65 text-motif-cream">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3 h-3" />
                    Click outside to close
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5">Press ESC to close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
     
      </div>
    </Section>
  )
}
