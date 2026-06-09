"use client"

import { ExternalLink, Video } from "lucide-react"
import { Section } from "@/components/section"
import Image from "next/image"
import { Cormorant_Garamond, Cinzel } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

const DRIVE_URL =
  "https://drive.google.com/drive/folders/1rWdBfXKWvD03kClL949SL5tolJwfhajh?usp=sharing"

export function VideoMessage() {
  return (
    <Section
      id="video-message"
      className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-20"
    >
      {/* Corner floral decorations — same as Welcome section */}
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

          {/* Subtle accent overlay — same as Welcome */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80"
              style={{ background: "radial-gradient(circle at center, color-mix(in srgb, var(--color-motif-accent) 6%, transparent), transparent 60%)" }}
            />
            <div
              className="absolute bottom-[-6rem] right-[-2rem] w-64 h-64"
              style={{ background: "radial-gradient(circle at center, color-mix(in srgb, var(--color-motif-accent) 5%, transparent), transparent 60%)" }}
            />
            <div className="absolute inset-[1px] rounded-[inherit] border border-motif-accent/10" />
          </div>

          <div className="relative text-center space-y-4 sm:space-y-6 md:space-y-7 lg:space-y-8">

            {/* Eyebrow label */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2.5">
              <p
                className={`${cormorant.className} text-[0.65rem] sm:text-[0.7rem] md:text-xs lg:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em]`}
                style={{ color: "var(--color-motif-deep)" }}
              >
                A Gift We&apos;ll Cherish Forever
              </p>

              {/* Script heading */}
              <h2
                className="leading-none"
                style={{
                  fontFamily: "var(--font-brittany), cursive",
                  fontSize: "clamp(2rem, 9vw, 4.5rem)",
                  color: "var(--color-motif-deep)",
                  letterSpacing: "0.01em",
                }}
              >
                Send us a video message
              </h2>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-motif-accent" />
                <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
              </div>
            </div>

            {/* Body copy */}
            <div
              className={`${cormorant.className} text-[0.75rem] sm:text-[0.85rem] md:text-sm lg:text-base leading-relaxed sm:leading-6 md:leading-7 space-y-2.5 sm:space-y-3 md:space-y-4`}
              style={{ color: "var(--color-motif-deep)" }}
            >
              <p>
                As we step into this new chapter, guided by Jehovah&apos;s loving hands,
                we give heartfelt thanks for the people He has placed along our journey.
              </p>
              <p className="italic">
                Indeed, you are a cherished treasure, a blessing we hold dear.
              </p>
              <p>
                It would mean so much to us if you could send a video message—something
                we can treasure and revisit through the years, even as our black hair
                gradually turns white with time.
              </p>
              <p>
                Your message will surely make our wedding day—and even our married
                life—more special and full of warmth. Thank you for being part of our
                lives and for your love and support. We love you!
              </p>
            </div>

            {/* Second divider */}
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-motif-accent" />
              <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
            </div>

            {/* Upload prompt + CTA */}
            <div className="space-y-3 sm:space-y-4">
              <p
                className={`${cormorant.className} text-[0.75rem] sm:text-[0.85rem] md:text-sm lg:text-base`}
                style={{ color: "var(--color-motif-deep)", opacity: 0.85 }}
              >
                You may upload your video message here:
              </p>

              <a
                href={DRIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 sm:gap-3 px-7 sm:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                style={{
                  backgroundColor: "var(--color-motif-soft)",
                  color: "#FFFFFF",
                }}
              >
                <Video className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span
                  className={cinzel.className}
                  style={{ letterSpacing: "0.12em", fontSize: "0.75rem" }}
                >
                  UPLOAD VIDEO MESSAGE
                </span>
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </Section>
  )
}
