"use client"

import React from 'react';
import Link from 'next/link';
import { StorySection } from '@/components/StorySection';
import type { FlipbookPhoto } from '@/components/PhotoFlipbook';
import { Cinzel } from "next/font/google";

const SECTION_IMAGE_FILES: Record<number, string[]> = {
  1: ['story (1).webp', 'story (2).webp', 'story (3).webp', 'story (4).webp', 'story (5).webp', 'story (6).webp', 'story (7).webp'],
  2: ['story (8).webp', 'story (9).webp', 'story (10).webp', 'story (11).webp', 'story (12).webp', 'story (13).webp', 'story (14).webp'],
  3: ['story (1).webp', 'story (2).webp', 'story (3).webp', 'story (4).webp', 'story (5).webp', 'story (6).webp', 'story (7).webp'],
  4: ['story (8).webp', 'story (9).webp', 'story (10).webp', 'story (11).webp', 'story (12).webp', 'story (13).webp', 'story (14).webp'],
  5: ['story (15).webp', 'story (16).webp', 'story (17).webp', 'story (18).webp', 'story (19).webp', 'story (20).webp', 'story (21).webp'],
  6: ['story (22).webp', 'story (23).webp', 'story (24).webp', 'story (25).webp', 'story (26).webp', 'story (27).webp', 'story (28).webp'],
  7: ['story (29).webp', 'story (30).webp', 'story (31).webp', 'story (32).webp', 'story (33).webp', 'story (34).webp', 'story (35).webp'],
  8: ['story (36).webp', 'story (37).webp', 'story (38).webp', 'story (39).webp', 'story (40).webp', 'story (41).webp', 'story (42).webp'],
};

function sectionPhotos(section: number, alt: string): FlipbookPhoto[] {
  return (SECTION_IMAGE_FILES[section] ?? []).map((file, index) => ({
    src: `/LoveStory/section${section}/${file}`,
    alt: index === 0 ? alt : `${alt} (${index + 1})`,
  }));
}

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

// Palette lives in globals.css → @theme inline → --color-motif-*
// Edit there once to update every component.

export function LoveStory() {
  return (
    <div className="min-h-screen bg-motif-cream overflow-x-hidden">


      <div className="text-center text-motif-medium z-0 relative px-4 pt-10 sm:pt-12 md:pt-16 pb-1 sm:pb-2 md:pb-3">
        <div className="w-12 sm:w-16 h-[1px] bg-motif-silver mx-auto mb-4 sm:mb-6 opacity-60"></div>
        <h1 className="leading-none mt-4 sm:mt-5 md:mt-6" style={{
          fontFamily: "var(--font-brittany), cursive",
          fontSize: "clamp(2rem, 9vw, 4.5rem)",
          color: "var(--color-motif-deep)",
          letterSpacing: "0.01em",
        }}>
        When Road Trip Buddies Became Forever
        </h1>
        <p className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl tracking-[0.14em] sm:tracking-[0.18em] font-normal leading-tight text-motif-medium mt-3 sm:mt-4 md:mt-5 mb-1`}>
        A friendship that began on a journey in 2022 and blossomed into a love anchored in faith, purpose, and unwavering devotion.
        </p>
      </div>

      {/* SECTION 1: Top - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isFirst={true}
        // title="From Secret Glances to Forever Vows"
        images={sectionPhotos(1, 'Nicole and PJ — how it began')}
        text={
          <>
            <p className="mb-4">
            Pj and Nicole’s story began in 2022 through someone very dear to Nicole’s heart — Karina, her college classmate who had long been more like a sister. At the time, Nicole was living alone in Kansas, bravely building her life in a new country with no relatives nearby, guided only by faith, resilience, and quiet determination. Through Karina’s introduction, she met PJ, a nurse in New York — unaware that this introduction would gently change the course of her life.
            </p>
           
          </>
        }
      />

      {/* SECTION 2: Middle - Light */}
      <StorySection
        theme="dark"
        layout="image-right"
        images={sectionPhotos(2, 'Nicole and PJ — first impressions')}
        // title="March 8, 2019 — Perfectly Matched"
        text={
          <>
            <p>
            Karina would teasingly call him the “Kilabot ng Zamboanga,” a title Nicole found amusing and hard to believe. When she finally met him, he was nothing like the bold image she imagined. Instead, he was calm, sincere, and unexpectedly gentle — almost too kind, too intentional, too good to be true. He wasn’t even her usual type, which made her wonder if someone could truly be that genuinely good.
            </p>
            <br />
            <p>
            But he was.
            </p>
          </>
        }
      />

      {/* SECTION 3: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        images={sectionPhotos(3, 'Nicole and PJ — road trip')}
        // title="April 18, 2019 — Our First Conversation"
        text={
          <>
            <p>
            In the last week of August 2022, they set out on a road trip across New York, Washington, Pennsylvania, and Niagara Falls. What began as an easy friendship on the open road slowly unfolded into something deeper. Between long drives, shared laughter, and quiet conversations, they discovered aligned dreams, shared values, and a peace in each other’s presence that felt steady and rare — like coming home.
           </p>
           <br />
           <p>
            Then came a small, ordinary moment that would quietly mean everything.
           </p>
          </>
        }
      />
            {/* SECTION 4: Middle - Light */}
            <StorySection
        theme="dark"
        layout="image-right"
        images={sectionPhotos(4, 'Nicole and PJ — a tender gesture')}
        // title="May 3, 2019 — Our First Date"
        text={
          <>
            <p>
            At a convenience store at 5am, PJ had to step away briefly. Before leaving, he gently asked the staff to keep an eye on Nicole — as if she were someone precious entrusted to his care. It was simple. Unplanned. Unassuming. But in that tender gesture, Nicole saw his heart: protective, thoughtful, and deeply sincere. In that moment, she realized he was not just someone kind — he was her answered prayer. A love sent in God’s perfect timing.
            </p>
          </>
        }
      />

      {/* SECTION 5: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        images={sectionPhotos(5, 'Nicole and PJ — Disneyland')}
        // title="June 2019 — Our First Trip Together"
        text={
          <>
            <p>
            In a world where so much can look perfect on the surface, they found something far more rare — a love grounded in faith, depth, and true understanding. A connection that did not rush, did not pretend, but quietly chose forever from the very beginning.
            </p>
            <br />
            <p>
            On April 2, 2023, in front of the Disneyland Castle in California, PJ officially asked Nicole to be his girlfriend — a moment filled with certainty, joy, and the unmistakable feeling that this was only the beginning of something eternal.
            </p>
           
          </>      
        }
      />
                  {/* SECTION 6: Middle - Light */}
                  <StorySection
        theme="dark"
        layout="image-right"
        images={sectionPhotos(6, 'Nicole and PJ — building a life together')}
        // title="July 30, 2019 — Our First “Yes”"
        text={
          <>
            <p>
            For nearly a year, they embraced the long distance between Kansas and New York. The miles were not easy, but they strengthened what already felt unshakable. Every goodbye deepened their trust. Every reunion felt like an answered prayer.
            </p>
            <br />
            <p>
            In March 2024, Nicole moved to New York to begin her career and finally build a life beside PJ — no longer counting down visits, but building a home together. Side by side, they created a life rooted in faith, shared dreams, and unwavering support — both fully aware that they had become each other’s greatest blessing.
            </p>
          </>
        }
      />

      {/* SECTION 7: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        images={sectionPhotos(7, 'Nicole and PJ — Mt. Fuji proposal')}
        // title="The Years That Followed"
        text={
          <>
            <p>
            Having walked through life’s earlier chapters with resilience, they now share one clear vision: to build a joyful, God-centered family founded on love, unity, and a faith so strong that no circumstance — and no one — could ever shake it.
            </p>
            <br />
            <p>
            On October 11, 2025, at the Chureito Pagoda in Mt. Fuji, Japan, beneath a gentle rain and hidden mountain skies, PJ knelt and asked Nicole to spend forever with him. Though Mt. Fuji remained behind the clouds, the moment itself was crystal clear — sacred, intentional, and long prayed for.
            </p>
          </>      
        }
      />
                  {/* SECTION 8: Middle - Light */}
                  <StorySection
        theme="dark"
        layout="image-right"
        images={sectionPhotos(8, 'Nicole and PJ — forever')}
        // title="March 2, 2025 — Our Sixth Year Together"
        text={
          <>
            <p>
            With faith as our foundation and love as our guide, we now look forward to a lifetime of journeys — together.
<br />
“I have found the one whom my soul loves.”

            </p>
          </>
        }
      />

                 
      {/* Footer Decoration */}
      <div className="bg-motif-cream pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24 text-center text-motif-deep z-0 relative px-4">
        <div className="w-12 sm:w-16 h-[1px] bg-motif-silver mx-auto mb-4 sm:mb-6 opacity-60"></div>
        <Link 
          href="#guest-list"
          className={`${cinzel.className} group relative inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 text-[0.7rem] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase font-normal text-motif-cream bg-motif-deep rounded-sm border border-motif-deep transition-all duration-300 hover:bg-motif-accent hover:border-motif-accent hover:text-motif-cream hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-motif-soft/50 focus-visible:ring-offset-2 focus-visible:ring-offset-motif-cream`}
        >
          <span className="relative z-10">Join us</span>
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 rounded-sm bg-motif-soft opacity-0 group-hover:opacity-25 blur-md transition-opacity duration-300 -z-0"></div>
        </Link>
      </div>

    </div>
  );
}