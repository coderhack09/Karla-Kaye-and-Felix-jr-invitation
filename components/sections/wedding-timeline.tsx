"use client"

import type React from "react"
import { Section } from "@/components/section"
import { useSiteConfig } from "@/hooks/use-site-config"
import type { SiteConfig } from "@/lib/site-config"
import { MapPin } from "lucide-react"
import { motion } from "motion/react"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400"],
})

const textColor = "color-mix(in srgb, var(--color-motif-cream) 50%, white)"
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

type TimelineIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

interface TimelineEvent {
  time: string
  title: string
  description?: string
  location?: string
  icon: TimelineIcon
  /** Optional image source to override the default SVG icon for this event. */
  imageSrc?: string
}

function buildTimelineEvents(siteConfig: SiteConfig): TimelineEvent[] {
  const receptionVenue = siteConfig.reception.location

  return [
  {
    time: `1:00 PM`,
    title: "Guest Arrival",
    // description: "Guests are kindly requested to arrive and be seated.Our wedding ceremony will begin promptly at 2:00 PM. To preserve the solemnity of the occasion, we ask that everyone be seated at 1:30pm before the ceremony begins.",
    location: `${siteConfig.ceremony.location}`,
    icon: GuestsIcon,
    imageSrc: "/weddingtimeline/arrivalimage.png",
  },  
  {
    time: `1:30 PM`,
    title: "Wedding Ceremony",
    location: `${siteConfig.ceremony.location}`,
    icon: RingsIcon,
    imageSrc: "/weddingtimeline/WeddingCeremony.png",
  },
  {
    time: `4:00 PM`,
    title: "Post-Nuptial Pictorial",
    location: `${siteConfig.ceremony.location}`,
    icon: RingsIcon,
    imageSrc: "/weddingtimeline/PhotoSession.png",
  },
  {
    time: `5:30 PM`,
    title: "Cocktail Hour",
    location: receptionVenue,
    icon: CocktailIcon,
    imageSrc: "/weddingtimeline/CockTailHour.png",
  },
  {
    time: "5:15 PM",
    title: "Reception Program",
    location: receptionVenue,
    icon: FireworksIcon,
    imageSrc: "/weddingtimeline/reception welcom.png",
  },
  {
    time: "7:30 PM",
    title: "Dinner",
    location: receptionVenue,
    icon: DinnerIcon,
    imageSrc: "/weddingtimeline/DinnerService.png",
  },
  // {
  //   time: "9:00 PM",
  //   title: "Party",
  //   location: receptionVenue,
  //   icon: DanceIcon,
  //   imageSrc: "/weddingtimeline/SendOff.png",
  // },
]
}

export function WeddingTimeline() {
  const siteConfig = useSiteConfig()
  const timelineEvents = buildTimelineEvents(siteConfig)
  return (
    <Section
      id="wedding-timeline"
      className="relative overflow-hidden bg-transparent py-10 sm:py-12 md:py-16 lg:py-20"
    >
      {/* Corner floral decoration - white */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="absolute top-0 left-0 w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-25"
          style={{ transform: "scaleY(-1)", filter: DECO_FILTER }}
          priority={false}
        /> */}
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="absolute top-0 right-0 w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-25"
          style={{ transform: "scaleX(-1) scaleY(-1)", filter: DECO_FILTER }}
          priority={false}
        /> */}
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 left-0 w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-25"
          style={{ filter: DECO_FILTER }}
          priority={false}
        /> */}
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 right-0 w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-25"
          style={{ transform: "scaleX(-1)", filter: DECO_FILTER }}
          priority={false}
        /> */}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-8 sm:mb-10 md:mb-12 px-3 sm:px-4">
        <p
          className={`${cormorant.className} text-[0.85rem] sm:text-base md:text-lg tracking-[0.04em] mb-1 drop-shadow-sm`}
          style={{ color: textColor }}
        >
          Wedding Day
        </p>

        <MotifDivider />

        <h2
          className={`${cinzel.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[0.95] mb-2 drop-shadow`}
          style={{
            color: textColor,
            textShadow: "0 2px 12px color-mix(in srgb, var(--color-motif-soft) 45%, transparent)",
          }}
        >
          timeline
        </h2>

        <p
          className={`${cormorant.className} text-[11px] sm:text-sm md:text-base lg:text-lg max-w-xl mx-auto leading-relaxed px-2 opacity-90 drop-shadow-sm mt-2 sm:mt-2.5`}
          style={{ color: textColor }}
        >
          A simple overview of the key moments of our day, from arrival to farewell.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-5 lg:px-8">
        {/* Center line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-[2px] sm:w-px pointer-events-none opacity-80 z-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-motif-accent) 55%, transparent), transparent)",
          }}
        />

        <div className="space-y-7 sm:space-y-8 md:space-y-10 lg:space-y-12">
          {timelineEvents.map((event, index) => (
            <TimelineItem key={event.title} event={event} index={index} />
          ))}
        </div>
      </div>
    </Section>
  )
}

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const Icon = event.icon
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative z-10"
    >
      {/* Desktop: alternating left/right text with opposite-side icon, centered line + dot */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-x-10 lg:gap-x-14">
        {/* Left side */}
        <div className={`${isEven ? "" : "text-right"}`}>
          <div className="flex items-center justify-end gap-4">
            {!isEven ? <TimelineText event={event} align="right" /> : <IconMark Icon={Icon} imageSrc={event.imageSrc} />}
            <div className="hidden lg:block h-px w-10 rounded-full bg-motif-accent/60 opacity-70" />
          </div>
        </div>

        {/* Center dot */}
        <div className="relative flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-motif-accent" />
        </div>

        {/* Right side */}
        <div>
          <div className="flex items-center justify-start gap-4">
            <div className="hidden lg:block h-px w-10 rounded-full bg-motif-accent/60 opacity-70" />
            {isEven ? <TimelineText event={event} align="left" /> : <IconMark Icon={Icon} imageSrc={event.imageSrc} />}
          </div>
        </div>
      </div>

      {/* Mobile: centered line + alternating text/icon */}
      <div className="md:hidden grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 sm:gap-x-6">
        {/* Left side */}
        <div className={`${isEven ? "" : "text-right"}`}>
          <div className="flex items-center justify-end gap-3">
            {!isEven ? <TimelineText event={event} align="right" mobile /> : <IconMark Icon={Icon} imageSrc={event.imageSrc} mobile />}
            <div className="h-px w-6 rounded-full bg-motif-accent/60 opacity-70" />
          </div>
        </div>

        {/* Center dot */}
        <div className="relative flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-motif-accent" />
        </div>

        {/* Right side */}
        <div>
          <div className="flex items-center justify-start gap-3">
            <div className="h-px w-6 rounded-full bg-motif-accent/60 opacity-70" />
            {isEven ? <TimelineText event={event} align="left" mobile /> : <IconMark Icon={Icon} imageSrc={event.imageSrc} mobile />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TimelineText({
  event,
  align,
  mobile,
}: {
  event: TimelineEvent
  align: "left" | "right"
  mobile?: boolean
}) {
  const textAlign = align === "right" ? "text-right" : "text-left"
  return (
    <div className={`${textAlign} max-w-md ${align === "right" ? "ml-auto" : "mr-auto"}`}>
      <p
        className={`${cinzel.className} ${
          mobile ? "text-[0.7rem]" : "text-[0.75rem] lg:text-sm"
        } tracking-[0.22em] uppercase drop-shadow-sm`}
        style={{ color: textColor }}
      >
        {event.title}
      </p>
      <p
        className={`${cormorant.className} ${
          mobile ? "text-[0.75rem]" : "text-sm lg:text-base"
        } mt-0.5 opacity-95 drop-shadow-sm`}
        style={{ color: textColor }}
      >
        at {event.time}
      </p>

      {event.description && (
        <p
          className={`${cormorant.className} ${
            mobile ? "text-[10px]" : "text-xs lg:text-sm"
          } mt-1.5 leading-relaxed opacity-90 drop-shadow-sm`}
          style={{ color: textColor }}
        >
          {event.description}
        </p>
      )}

      {event.location && (
        <div
          className={`mt-1.5 flex items-start gap-1.5 ${align === "right" ? "justify-end" : "justify-start"} opacity-90`}
        >
          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 drop-shadow-sm" style={{ color: accentColor }} />
          <p
            className={`${cormorant.className} ${mobile ? "text-[10px]" : "text-xs lg:text-sm"} leading-relaxed drop-shadow-sm`}
            style={{ color: textColor }}
          >
            {event.location}
          </p>
        </div>
      )}
    </div>
  )
}

function IconMark({
  Icon,
  mobile,
  imageSrc,
}: {
  Icon: TimelineIcon
  mobile?: boolean
  imageSrc?: string
}) {
  if (imageSrc) {
    return (
      <CloudinaryImage
        src={imageSrc}
        alt=""
        width={96}
        height={96}
        className={`${
          mobile ? "w-16 h-16" : "w-18 h-18 lg:w-22 lg:h-22"
        } object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]`}
      />
    )
  }
  
  return (
    <div
      className={`${
        mobile ? "w-14 h-14" : "w-16 h-16 lg:w-18 lg:h-18"
      } rounded-full border bg-white/15 flex items-center justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]`}
      style={{ borderColor: "color-mix(in srgb, var(--color-motif-accent) 45%, transparent)" }}
    >
      <Icon className={`${mobile ? "w-7 h-7" : "w-8 h-8 lg:w-9 lg:h-9"}`} style={{ color: textColor }} />
    </div>
  )
}

/* Hand-drawn–style timeline icons */

function GuestsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 16a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
      <path d="M21 16a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 21 16Z" />
      <path d="M4 24.5c1.2-3 3.9-4.5 7-4.5s5.8 1.5 7 4.5" />
      <path d="M17.5 19.5A6 6 0 0 1 26 24" />
    </svg>
  )
}

function RingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="20" r="6" />
      <circle cx="20" cy="20" r="6" />
      <path d="M14 9 16 5l2 4" />
      <path d="M13 7h6" />
    </svg>
  )
}

function FireworksIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 5v4" />
      <path d="M9 7l2.5 2.5" />
      <path d="M23 7 20.5 9.5" />
      <path d="M8 14h4" />
      <path d="M20 14h4" />
      <path d="M11 21 8 24" />
      <path d="M21 21 24 24" />
      <circle cx="16" cy="14" r="3" />
    </svg>
  )
}

function DinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="16" cy="16" r="7" />
      <path d="M7 8v12" />
      <path d="M9.5 8v12" />
      <path d="M23 8v12" />
      <path d="M5 24h22" />
    </svg>
  )
}

function CocktailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 28h16" />
      <path d="M16 28V12" />
      <path d="M10 12h12l-1-4H11l-1 4Z" />
      <circle cx="16" cy="8" r="2" />
      <path d="M12 16h8" />
    </svg>
  )
}

function DanceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="10" cy="12" r="3" />
      <circle cx="22" cy="12" r="3" />
      <path d="M10 15v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />
      <path d="M12 23v2" />
      <path d="M20 23v2" />
      <path d="M8 18h16" />
      <path d="M16 5v4" />
      <path d="M13 7l3-2 3 2" />
    </svg>
  )
}

