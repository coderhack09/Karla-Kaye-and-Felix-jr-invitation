"use client"

import { useState } from "react"
import { Section } from "@/components/section"
import { Cinzel } from "next/font/google"
import { useSiteConfig } from "@/hooks/use-site-config"
import Image from "next/image"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

export function Registry() {
  const siteConfig = useSiteConfig()
  const gcashQr = Object.values(siteConfig.giftRegistry ?? {})
  const [activeQr, setActiveQr] = useState(gcashQr[0]?.id ?? "")
  const activeItem = gcashQr.find((i) => i.id === activeQr) ?? gcashQr[0]

  return (
    <Section
      id="registry"
      className="relative overflow-hidden py-10 sm:py-12 md:py-16 lg:py-20"
    >
      <div className="relative z-10 text-center mb-6 sm:mb-8 md:mb-10 px-3 sm:px-4">
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <div className="w-8 sm:w-12 md:w-16 h-px bg-motif-cream/60" />
          <div className="w-1.5 h-1.5 bg-motif-cream/80 rounded-full" />
          <div className="w-1.5 h-1.5 bg-motif-cream/60 rounded-full" />
          <div className="w-1.5 h-1.5 bg-motif-cream/80 rounded-full" />
          <div className="w-8 sm:w-12 md:w-16 h-px bg-motif-cream/60" />
        </div>
        
        <h2 className="style-script-regular text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-motif-cream mb-2 sm:mb-3 md:mb-4">
          Gift Guide
        </h2>
        
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-motif-cream/90 font-light max-w-2xl mx-auto leading-relaxed px-2">
        With all that we have, we've been truly blessed.
Your presence and prayers are all that we request,
But if you desire to give nonetheless,
Monetary gift is the one we suggest.

        </p>
        
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          <div className="w-1.5 h-1.5 bg-motif-cream/80 rounded-full" />
          <div className="w-1.5 h-1.5 bg-motif-cream/60 rounded-full" />
          <div className="w-1.5 h-1.5 bg-motif-cream/80 rounded-full" />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
  {/* GCASH QR toggle */}
  <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
        {/* <h3 className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl font-normal text-motif-cream text-center mb-4 sm:mb-6`}>
          GCASH
        </h3> */}
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <div className="inline-flex rounded-lg border border-motif-cream/40 bg-motif-cream/5 p-1">
            {gcashQr.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveQr(item.id)}
                className={`px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeQr === item.id
                    ? "bg-motif-cream/20 text-motif-cream"
                    : "text-motif-cream/80 hover:text-motif-cream hover:bg-motif-cream/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-xl overflow-hidden bg-white shadow-lg">
            <Image
              src={activeItem.src}
              alt={`QR code - ${activeItem.label}`}
              fill
              className="object-contain p-2"
              sizes="(max-width: 640px) 208px, (max-width: 768px) 240px, 288px"
            />
          </div>
            <div className="mt-3 sm:mt-4 w-full max-w-md text-center">
              <p className="text-[11px] sm:text-xs tracking-[0.18em] uppercase text-motif-cream/70">
                Account Number
              </p>
              <p className={`${cinzel.className} mt-1 text-sm sm:text-base text-motif-cream drop-shadow-sm`}>
                {activeItem.accountNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-motif-cream/90 italic">
            Thank you from the bottom of our hearts.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-motif-cream/90 italic text-center">
            With love,
            <br />
            {siteConfig.couple.brideNickname} and {siteConfig.couple.groomNickname}
          </p>
        </div>
      </div>
    </Section>
  );
}
