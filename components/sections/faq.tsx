"use client"

import { useMemo, useState, type ReactNode } from "react"
import type { SiteConfig } from "@/lib/site-config"
import { ChevronDown } from "lucide-react"
import { Section } from "@/components/section"
import Image from "next/image"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { useSiteConfig } from "@/hooks/use-site-config"
import { CloudinaryImage } from "../ui/cloudinary-image"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

// Colors sourced from globals.css @theme inline — edit there to update everywhere
const palette = {
  deep:          "var(--color-motif-deep)",
  softBrown:     "var(--color-motif-medium)",
  background:    "var(--color-motif-cream)",
  champagneGold: "var(--color-motif-silver)",
  champagneLight:"var(--color-motif-cream)",
} as const

interface FAQItem {
  question: string
  answer: string | ReactNode
}

function getFaqItems(siteConfig: SiteConfig): FAQItem[] {
  return [
  {
    question: "When is the wedding?",
    answer:
    `Our wedding will be held on ${siteConfig.ceremony.date} (${siteConfig.ceremony.day})`
  },
  {
    question: "What time should I arrive for the ceremony?",
    answer:
      `Our ceremony will begin promptly at ${siteConfig.ceremony.time}. We kindly ask guests to arrive 30–45 minutes earlier to allow enough time for parking, walking to the ceremony area, and finding your seats so we can begin on time.`,
  },
  {
    question: "Where will the ceremony and reception take place?",
    answer:
    `The ceremony and reception will be held at ${siteConfig.ceremony.location}, ${siteConfig.ceremony.venue}. You can find detailed directions, addresses, and maps in the Details Section above`
  },
  // {
  //   question: "Is there an entourage call time?",
  //   answer:
  //   `Yes. We request our Principal Sponsors to arrive at ${siteConfig.ceremony.entourageTime} so we can prepapre and settle before the ceremony begins`
  // },
  {
    question: "How do I RSVP?",
    answer: (
      <>
        Please RSVP using the{" "}
        <a
          href="#guest-list"
          className="underline font-bold transition-colors hover:opacity-80"
          style={{ color: palette.softBrown }}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("guest-list")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          guest list
        </a>{" "}
        on this invitation: search for your name and confirm your attendance.
        {"\n"}
        Please respond by{" "}
        {siteConfig.details.rsvp.deadline.replace(/\.\s*$/, "")}.
        {"\n"}
        If you have questions, message{" "}
        <a
          href="https://www.facebook.com/elyzha.david"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-bold transition-colors hover:opacity-80"
          style={{ color: palette.softBrown }}
        >
          {siteConfig.details.rsvp.contact}
        </a>{" "}
        or{" "}
        <a
          href="https://www.facebook.com/KennethJunCajayon"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-bold transition-colors hover:opacity-80"
          style={{ color: palette.softBrown }}
        >
          {siteConfig.couple.groom}
        </a>{" "}
        on Messenger.
      </>
    ),
  },
  {
    question: "Can I sit anywhere at the reception?",
    answer:
      "Please don't. We kindly ask our guests to follow the seating arrangement prepared for the reception.\n\nA great deal of thought and care went into planning the seating so that everyone will feel comfortable and be seated with friends, family, or guests who share similar connections. Each seat was thoughtfully arranged with every guest in mind. Our reception team will gladly assist you in finding your assigned table.",
  },
  {
    question: "Is there parking available?",
    answer:
      "Yes, parking is available at the venue, and parking attendants, along with our coordinators, will assist you on the day",
  },
  {
    question: "Will there be a wedding gift registry?",
    answer:
      "With all that we have, we are truly blessed. Your presence and prayers are what we request most. However, if you desire to give nonetheless, a monetary gift to help us begin our new life together would be humbly appreciated. You can find our gift registry information in the Gift Guide section.",
  },
  {
    question: "Unplugged Ceremony",
    answer:
      "EYES UP, PHONES DOWN, HEARTS OPEN.\n\nThe greatest gift you can give us during our ceremony is your presence. We respectfully request that guests refrain from taking photos or videos during the ceremony so our official photographers can capture every moment without distraction. We promise to share the beautiful photos with you afterward!\n\nOur professional photographers will be capturing every beautiful memory, and we promise to share the photos with everyone afterwards.",
  },
  {
    question: "Can I take photos or videos during the reception?",
    answer:
      "Yes! While our I DO’s will be unplugged, our reception will not be. As a couple who loves photos and memories, we would love for you to capture the fun moments throughout the evening. We prepared this celebration wholeheartedly and we want everyone to enjoy it fully.",
  },
  {
    question: "What should I do if I can’t make it?",
    answer:
      "Your presence will truly be missed, but we completely understand.\n\nPlease kindly let us know through RSVP as soon as possible so we may adjust arrangements accordingly.",
  },
  {
    question: "I said “No” to RSVP but my plans changed. Can I still attend?",
    answer:
      "Please check with us first before making arrangements. Due to limited seating and a carefully planned guest list, attendance cannot be guaranteed without prior confirmation.",
  },
  {
    question: "When is the appropriate time to leave?",
    answer:
      "It took us some time to plan for a heartfelt wedding that everyone would hopefully enjoy. We humbly request that you celebrate with us until the program ends. Please don't eat and run! Let's laugh, take pictures, sing, and have fun!",
  },
  {
    question: "Can I bring my children to the wedding?",
    answer:
      "We adore your little ones — truly. However, we have lovingly planned this as an adults-only celebration so that every guest, including you, can fully relax, enjoy the program, and be present in the moment.\n\nWe kindly ask that you make childcare arrangements for the day. We hope you understand, and we are so grateful that you are celebrating this milestone with us.",
  },
  {
    question: "What if I have dietary restrictions or allergies?",
    answer:
      "Please let us know about any dietary restrictions or allergies when you RSVP. We want to ensure everyone can enjoy the celebration comfortably.",
  },
  {
    question: "How can I help the couple have a great time during their wedding?",
    answer:
      "• Pray with us for favorable weather and the continuous blessings of our Lord as we enter this new chapter of our lives as husband and wife.\n\n• RSVP as soon as your schedule is cleared.\n\n• Dress appropriately and follow our wedding motif.\n\n• Be on time.\n\n• Follow the seating arrangement in the reception.\n\n• Stay until the end of the program.\n\n• Join the activities and enjoy!",
  },
]
}

export function FAQ() {
  const siteConfig = useSiteConfig()
  const faqItems = useMemo(() => getFaqItems(siteConfig), [siteConfig])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="relative w-full" style={{ backgroundColor: palette.background }}>
      {/* Full-bleed layered background — champagne + beige with gentle texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Soft diagonal wash */}
        <div
          className="absolute inset-0 opacity-[0.24]"
          style={{
            background: 'linear-gradient(150deg, var(--color-motif-cream) 0%, color-mix(in srgb, var(--color-motif-silver) 14%, transparent) 35%, color-mix(in srgb, var(--color-motif-medium) 6%, transparent) 70%, color-mix(in srgb, var(--color-motif-deep) 3%, transparent) 100%)',
          }}
        />
        {/* Glow behind FAQ card */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            background: 'radial-gradient(circle at 50% 10%, var(--color-motif-silver) 0%, transparent 55%)',
          }}
        />
        {/* Subtle vertical texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.0) 0, rgba(255,255,255,0.0) 32px, rgba(255,255,255,0.3) 33px, rgba(255,255,255,0.3) 34px)",
          }}
        />
      </div>

      <Section id="faq" className="relative z-10 py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Corner decorations — soft brown tint */}
      <div className="absolute left-0 top-0 z-0 pointer-events-none">
        < Image src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-20 scale-y-[-1]" priority={false} style={{ filter: "brightness(0) saturate(100%) invert(39%) sepia(18%) saturate(486%) hue-rotate(62deg) brightness(94%) contrast(88%)" }} />
      </div>
      <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <Image src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-20 scale-x-[-1] scale-y-[-1]" priority={false} style={{ filter: "brightness(0) saturate(100%) invert(39%) sepia(18%) saturate(486%) hue-rotate(62deg) brightness(94%) contrast(88%)" }} />
      </div>
      <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        < Image src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-20" priority={false} style={{ filter: "brightness(0) saturate(100%) invert(39%) sepia(18%) saturate(486%) hue-rotate(62deg) brightness(94%) contrast(88%)" }} />
      </div>
      <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        < Image src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-20 scale-x-[-1]" priority={false} style={{ filter: "brightness(0) saturate(100%) invert(39%) sepia(18%) saturate(486%) hue-rotate(62deg) brightness(94%) contrast(88%)" }} />
      </div>

      {/* Section Header */}
      <div className="relative z-30 text-center mb-6 sm:mb-9 md:mb-12 px-3 sm:px-4">
        <p className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm uppercase tracking-[0.28em] mb-2`} style={{ color: palette.softBrown }}>
          Answers for our celebration day
        </p>
        <h2 className="leading-none mt-4 sm:mt-5 md:mt-6 mb-3 sm:mb-4 md:mb-5" style={{
          fontFamily: "var(--font-brittany), cursive",
          fontSize: "clamp(2rem, 9vw, 4.5rem)",
          color: "var(--color-motif-deep)",
          letterSpacing: "0.01em",
        }}>
          Frequently Asked Questions
        </h2>
        <p className={`${cormorant.className} text-xs sm:text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed px-2 mb-2 sm:mb-3`} style={{ color: palette.softBrown }}>
          Helpful notes so you can simply arrive, celebrate, and enjoy this new chapter with us.
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          <span className="h-px w-10 sm:w-14 rounded-full" style={{ backgroundColor: palette.champagneGold }} />
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: palette.champagneGold }} />
            <span className="w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: palette.champagneGold }} />
            <span className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: palette.champagneGold }} />
          </div>
          <span className="h-px w-10 sm:w-14 rounded-full" style={{ backgroundColor: palette.champagneGold }} />
        </div>
      </div>

      {/* FAQ content — cream container with motif accents */}
      <div className="relative z-30 max-w-4xl mx-auto px-3 sm:px-5">
        <div
          className="relative backdrop-blur-md rounded-xl sm:rounded-2xl overflow-hidden shadow-lg"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-motif-cream) 94%, transparent)',
            boxShadow: '0 4px 28px color-mix(in srgb, var(--color-motif-deep) 10%, transparent)',
          }}
        >
          <div className="relative p-2.5 sm:p-4 md:p-5 lg:p-6">
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index
                const contentId = `faq-item-${index}`
                return (
                  <div
                    key={index}
                    className="rounded-xl sm:rounded-2xl border overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--color-motif-cream) 96%, white)',
                      // borderColor: 'color-mix(in srgb, var(--color-motif-silver) 33%, transparent)',
                      boxShadow: '0 4px 28px color-mix(in srgb, var(--color-motif-deep) 10%, transparent)',
                    }}
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="group w-full px-2.5 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-2.5 md:py-3 lg:py-4 flex items-center justify-between text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-motif-deep transition-colors"
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                    >
                      <span
                        className={`${cinzel.className} font-semibold pr-2 sm:pr-3 md:pr-4 text-xs sm:text-sm md:text-base lg:text-lg leading-snug sm:leading-relaxed transition-colors duration-200`}
                        style={{ color: isOpen ? palette.softBrown : palette.deep }}
                      >
                        {item.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`flex-shrink-0 transition-transform duration-300 w-4 h-4 sm:w-5 sm:h-5 ${isOpen ? "rotate-180" : ""}`}
                        style={{ color: palette.softBrown }}
                        aria-hidden
                      />
                    </button>

                    <div
                      id={contentId}
                      role="region"
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div
                          className="px-2.5 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-2.5 md:py-3 lg:py-4 border-t"
                          style={{ backgroundColor: 'color-mix(in srgb, var(--color-motif-cream) 90%, transparent)', borderColor: 'color-mix(in srgb, var(--color-motif-deep) 25%, transparent)' }}
                        >
                          {typeof item.answer === "string" &&
                          item.answer.includes("[RSVP_LINK]") ? (
                            <p className={`${cormorant.className} font-medium leading-relaxed sm:leading-loose text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre-line tracking-wide`} style={{ color: palette.deep }}>
                              {item.answer.split("[RSVP_LINK]")[0]}
                              <a
                                href="#guest-list"
                                className="underline font-bold transition-colors hover:opacity-80"
                                style={{ color: palette.softBrown }}
                                onClick={(e) => {
                                  e.preventDefault()
                                  document.getElementById("guest-list")?.scrollIntoView({ behavior: "smooth" })
                                }}
                              >
                                {item.answer.match(/\[RSVP_LINK\](.*?)\[\/RSVP_LINK\]/)?.[1]}
                              </a>
                              {item.answer.split("[/RSVP_LINK]")[1]}
                            </p>
                          ) : (
                            <p className={`${cormorant.className} font-medium leading-relaxed sm:leading-loose text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre-line tracking-wide`} style={{ color: palette.deep }}>
                              {item.answer}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      </Section>
    </div>
  )
}
