"use client"

import { useState, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import Silk from "@/components/silk"
import { Hero as MainHero } from "@/components/sections/hero"
import { Welcome } from "@/components/sections/welcome"
import { Countdown } from "@/components/sections/countdown"
import { WeddingTimeline } from "@/components/sections/wedding-timeline"
import { Gallery } from "@/components/sections/gallery"
import { Messages } from "@/components/sections/messages"
import { Details } from "@/components/sections/details"
import { Entourage } from "@/components/sections/entourage"
import { PrincipalSponsors } from "@/components/sections/principal-sponsors"
import { BookOfGuests } from "@/components/sections/book-of-guests"
import { Registry } from "@/components/sections/registry"
import { FAQ } from "@/components/sections/faq"
import { GuestInformation } from "@/components/sections/guest-information"
import { Footer } from "@/components/sections/footer"
import { LoveStory } from "@/components/sections/love-story"
import { WeddingPlaylist } from "@/components/sections/wedding-playlist"
import { Hero as InvitationHero } from "@/components/loader/Hero"
import { LoadingScreen } from "@/components/loader/LoadingScreen"
import { Navbar } from "@/components/navbar"
import { AppState } from "@/components/types"
import { SnapShare } from "@/components/sections/snap-share"
import { CoupleVideo } from "@/components/sections/couple-video"
import { VideoMessage } from "@/components/sections/video-message"

const GuestList = dynamic(() => import("@/components/sections/guest-list").then(mod => ({ default: mod.GuestList })), { ssr: false })

export default function Home() {
  // Skip loading/landing only when returning from /gallery.
  // The flag is set by the "View Full Gallery" button and cleared immediately
  // here so a page refresh always replays the loading screen.
  const [appState, setAppState] = useState<AppState>(() => {
    if (typeof window !== "undefined") {
      const returning = sessionStorage.getItem("returnFromGallery")
      if (returning === "true") {
        sessionStorage.removeItem("returnFromGallery")
        return AppState.DETAILS
      }
    }
    return AppState.LOADING
  })
  const enableDecor = process.env.NEXT_PUBLIC_ENABLE_DECOR !== 'false'

  // When returning from /gallery, scroll to the #gallery hash in the URL
  useEffect(() => {
    if (appState !== AppState.DETAILS) return
    const hash = window.location.hash
    if (!hash) return
    // Small delay lets the page paint before scrolling
    const id = setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }, 100)
    return () => clearTimeout(id)
  }, [appState])

  const handleLoadingComplete = useCallback(() => {
    setAppState(AppState.LANDING)
  }, [])

  const handleOpenInvitation = useCallback(() => {
    setAppState(AppState.DETAILS)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
      <div
        className={`relative min-h-screen overflow-hidden font-sans text-charcoal selection:bg-birch selection:text-nut ${
          enableDecor ? "bg-transparent" : "bg-[#0F1C3F]"
        }`}
      >
        {enableDecor && (
          <div className="pointer-events-none fixed inset-0 z-0">
            <Silk
              speed={5}
              scale={1.1}
              color="#0F1C3F"
              noiseIntensity={0.8}
              rotation={0.3}
            />
          </div>
        )}

        {appState === AppState.LOADING && <LoadingScreen onComplete={handleLoadingComplete} />}

        <main className="relative w-full h-full">
          <InvitationHero onOpen={handleOpenInvitation} visible={appState === AppState.LANDING} />

          <div className={`transition-opacity duration-700 ${appState === AppState.DETAILS ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="relative z-10">
              {appState === AppState.DETAILS && <Navbar />}
              {/* Spacer so content starts below fixed navbar (h-12 sm:h-14 md:h-16) */}
              {appState === AppState.DETAILS && <div className="h-12 sm:h-14 md:h-16" aria-hidden />}
              <MainHero />
              <Welcome />
              
               {/* <CoupleVideo />  */}
              {/* <LoveStory /> */}


              <Countdown />
              {/* <Gallery /> */}
              <VideoMessage />
              <Messages />
              {/* <Details /> */}
              {/* <GuestInformation /> */}
              {/* <WeddingPlaylist /> */}
              <Entourage />
              <GuestList />
              <BookOfGuests />
              <WeddingTimeline />
              {/* <PrincipalSponsors /> */}
              {/* <FAQ /> */}

              {/* <Registry />
              <SnapShare /> */}

              <Footer />
            </div>
          </div>
        </main>
      </div>
  )
}