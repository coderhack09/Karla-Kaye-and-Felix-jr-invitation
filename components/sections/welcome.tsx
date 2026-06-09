"use client"

import { Section } from "@/components/section"
import { useSiteConfig } from "@/hooks/use-site-config"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import Image from "next/image"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})


// Palette lives in globals.css → @theme inline → --color-motif-*
// Edit there once to update every component.

// Corner decoration - white
const DECO_FILTER = "brightness(0) invert(1)"

export function Welcome() {
  const siteConfig = useSiteConfig()
  const brideName = siteConfig.couple.brideNickname || siteConfig.couple.bride
  const groomName = siteConfig.couple.groomNickname || siteConfig.couple.groom
  return (
    <Section
      id="welcome"
      className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-20"
    >
      {/* Corner floral decoration - same as countdown section */}
      {/* <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-60 scale-y-[-1]"
          priority={false}
        />
      </div> */}
      {/* <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-60 scale-x-[-1] scale-y-[-1]"
          priority={false}
        />
      </div> */}
      {/* <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-60"
          priority={false}
        />
      </div> */}
      {/* <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-60 scale-x-[-1]"
          priority={false}
        />
      </div> */}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2rem] border border-motif-accent/30 bg-[color-mix(in_srgb,var(--color-motif-cream)_18%,white)] shadow-[0_16px_60px_rgba(91,102,85,0.12)] px-4 sm:px-5 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 lg:py-12">
          {/* Subtle accent overlay */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80" style={{ background: 'radial-gradient(circle at center, color-mix(in srgb, var(--color-motif-accent) 6%, transparent), transparent 60%)' }} />
            <div className="absolute bottom-[-6rem] right-[-2rem] w-64 h-64" style={{ background: 'radial-gradient(circle at center, color-mix(in srgb, var(--color-motif-accent) 5%, transparent), transparent 60%)' }} />
            <div className="absolute inset-[1px] rounded-[inherit] border border-motif-accent/10" />
          </div>

          <div className="relative text-center space-y-4 sm:space-y-6 md:space-y-7 lg:space-y-8">
          {/* Main heading */}
          <div className="space-y-1 sm:space-y-1.5 md:space-y-2.5">
            <p
              className={`${cormorant.className} text-[0.65rem] sm:text-[0.7rem] md:text-xs lg:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em]`}
              style={{ color: 'var(--color-motif-deep)' }}
            >
              {siteConfig.couple.groomNickname} &amp; {siteConfig.couple.brideNickname}
            </p>
            <h2
              className="leading-none"
               style={{
                fontFamily: "var(--font-brittany), cursive",
                fontSize: "clamp(2rem, 9vw, 4.5rem)",
                color: "var(--color-motif-deep)",
                letterSpacing: "0.01em",  
              }}
            >
              Welcome to our forever
            </h2>


            {/* Verse */}
            <div className="space-y-0.5 sm:space-y-1">
              <p
                className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm lg:text-base italic leading-relaxed`}
                style={{ color: 'var(--color-motif-deep)', opacity: 0.9 }}
              >
                &quot;I have found the one whom my soul loves.&quot;
              </p>
              <p className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm lg:text-base italic leading-relaxed`} style={{ color: 'var(--color-motif-deep)', opacity: 0.9 }}>Song of Solomon 3:4</p>

            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-motif-accent" />
              <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
            </div>
          </div>

          {/* Body text */}
          <div
            className={`${cormorant.className} text-[0.75rem] sm:text-[0.85rem] md:text-sm lg:text-base leading-relaxed sm:leading-6 md:leading-7 space-y-2.5 sm:space-y-3 md:space-y-4`}
            style={{ color: 'var(--color-motif-deep)' }}
          >
            <p>
            With hearts full of gratitude and joy, we invite you to share in one of the most sacred and meaningful days of our lives.
            </p>
            <p>
            Our love has been guided by faith, strengthened through every season, and beautifully affirmed by those who have sincerely celebrated our happiness from the very beginning. To the ones who prayed for us, believed in us, and rejoiced in our union with genuine hearts — we thank you. Your unwavering support has meant more than words can express.
            </p>
            <p>
            You are not simply guests at our wedding; you are part of the foundation upon which this new chapter is built.
            </p>
            <p>
            As we stand before God and our loved ones to begin our life together, we do so surrounded by those who truly cherish our joy. Every detail of this day has been prepared with love, and we look forward to celebrating this blessed moment with you.
            </p>
            <p>
            Kindly explore this invitation for event details and RSVP information.
            </p>
            {/* Closing — hashtag & sign-off */}
            <div className="pt-3 sm:pt-4 md:pt-5 space-y-5 sm:space-y-6 md:space-y-7">
              <div className="flex items-center justify-center gap-2">
                <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-motif-accent" />
                <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
              </div>

              <div className="mx-auto max-w-md rounded-xl sm:rounded-2xl border border-motif-accent/25 bg-white/55 px-4 py-4 sm:px-6 sm:py-5 shadow-[0_4px_20px_rgba(91,102,85,0.06)]">
                <p
                  className={`${cormorant.className} text-[0.65rem] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.26em] mb-2 sm:mb-2.5`}
                  style={{ color: "var(--color-motif-deep)", opacity: 0.75 }}
                >
                  Share in our joy
                </p>
                <p className="text-[0.75rem] sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-3.5">
                  As you celebrate with us, please use our official hashtag when posting your photos and memories.
                </p>
                <p
                  className={`${cinzel.className} text-base sm:text-lg md:text-xl tracking-[0.06em] sm:tracking-[0.08em]`}
                  style={{ color: "var(--color-motif-accent)" }}
                >
                  {siteConfig.snapShare.hashtag}
                </p>
              </div>

              <div className="space-y-1.5 sm:space-y-2 pt-1">
                <p
                  className={`${cormorant.className} italic text-[0.8rem] sm:text-sm md:text-base`}
                  style={{ color: "var(--color-motif-deep)", opacity: 0.88 }}
                >
                  With all our love,
                </p>
                <p
                  className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl tracking-[0.1em] sm:tracking-[0.14em]`}
                  style={{ color: "var(--color-motif-deep)" }}
                >
                  {groomName} &amp; {brideName}
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </Section>
  )
}


