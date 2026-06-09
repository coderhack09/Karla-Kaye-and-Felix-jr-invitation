"use client"

import { useState, useEffect, useRef } from "react"
import { Section } from "@/components/section"
import { motion } from "motion/react"
import { Play } from "lucide-react"
import { useAudio } from "@/contexts/audio-context"
import { Cinzel } from "next/font/google"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { getCloudinaryUrl } from "@/lib/cloudinary"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

// YouTube Player API types
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function CoupleVideo() {
  // State to track if user has clicked to play the video
  const [hasClicked, setHasClicked] = useState(false)
  const playerRef = useRef<any>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { pauseMusic, resumeMusic } = useAudio()
  // https://youtube.com/shorts/ixwta53J-_I
  // YouTube video ID
  const videoId = "ixwta53J-_I"

  // Load YouTube IFrame API
  useEffect(() => {
    // Load YouTube IFrame API script if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }
  }, [])

  // Initialize YouTube player when clicked
  useEffect(() => {
    if (!hasClicked || !iframeRef.current) return

    const initPlayer = () => {
      if (window.YT && window.YT.Player && iframeRef.current) {
        playerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: (_event: any) => {
              // Pause background music when video is ready
              pauseMusic()
            },
            onStateChange: (event: any) => {
              // YouTube player states:
              // -1 (unstarted)
              // 0 (ended)
              // 1 (playing)
              // 2 (paused)
              // 3 (buffering)
              // 5 (video cued)
              
              if (event.data === 1) {
                // Video is playing - pause background music
                pauseMusic()
              } else if (event.data === 2 || event.data === 0) {
                // Video is paused or ended - resume background music
                resumeMusic()
              }
            },
          },
        })
      }
    }

    // Wait a bit for iframe to be ready, then initialize
    const timer = setTimeout(() => {
      if (window.YT && window.YT.Player) {
        initPlayer()
      } else {
        // Otherwise wait for API to load
        window.onYouTubeIframeAPIReady = initPlayer
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy()
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    }
  }, [hasClicked, pauseMusic, resumeMusic, videoId])

  // Handle thumbnail click - show iframe with autoplay
  const handleThumbnailClick = () => {
    setHasClicked(true)
    // Pause music immediately when user clicks
    pauseMusic()
  }

  return (
    <>
      {/* Global styles for YouTube embed */}
      <style jsx global>{`
        .youtube-embed-wrapper iframe {
          pointer-events: auto;
        }
        .youtube-mask-container {
          position: relative;
        }
      `}</style>

      <Section
        id="couple-video"
        className="relative bg-motif-deep py-8 sm:py-10 md:py-12 lg:py-16 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={getCloudinaryUrl("/decoration/DDA foto's, afbeeldingen, assets.jpg", { width: 1920 })}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-motif-deep via-motif-deep/90 to-motif-deep" />
        </div>

        {/* Header */}
        <div className="relative z-10 text-center mb-6 sm:mb-8 md:mb-10 px-3 sm:px-4">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-r from-transparent to-motif-cream/60" />
            <div className="w-1.5 h-1.5 bg-motif-cream/70 rounded-full" />
            <div className="w-1 h-1 bg-motif-cream/40 rounded-full" />
            <div className="w-1.5 h-1.5 bg-motif-cream/70 rounded-full" />
            <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-l from-transparent to-motif-cream/60" />
          </div>

          <h2
            className={`${cinzel.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-motif-cream mb-2 sm:mb-3 drop-shadow-lg`}
            style={{ textShadow: "0 4px 18px rgba(236,229,219,0.3)" }}
          >
            The Proposal
          </h2>

          <p className="text-[0.7rem] sm:text-xs md:text-sm text-motif-cream/70 font-light max-w-sm mx-auto px-2">
            A story of love unfolding—where one question changed everything, and forever began.
          </p>
        </div>

        {/* Video Container — portrait phone dimensions */}
        <div className="relative z-10 flex justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative group w-full max-w-[300px] sm:max-w-[330px] md:max-w-[360px]"
          >
            {/* Cream ambient glow layers */}
            <div className="absolute -inset-8 bg-motif-cream/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
            <div className="absolute -inset-4 bg-motif-cream/15 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Borderless frame — no radius, cream glow shadow */}
            <div
              className="relative overflow-hidden"
              style={{
                boxShadow:
                  "0 0 40px rgba(236,229,219,0.25), 0 0 80px rgba(236,229,219,0.15), 0 16px 48px rgba(236,229,219,0.1)",
              }}
            >
              {/* 9:16 portrait aspect ratio */}
              <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>

                {/* Thumbnail — shown before user clicks */}
                {!hasClicked && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 cursor-pointer z-20"
                    onClick={handleThumbnailClick}
                  >
                    <CloudinaryImage
                      src="/mobile-background/img (2).webp"
                      alt="Video thumbnail"
                      fill
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                      priority
                    />

                    {/* Cinematic vignette over thumbnail */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
                      }}
                    />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        className="relative"
                      >
                        {/* Soft halo */}
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl scale-[2] group-hover:scale-[2.4] transition-transform duration-500" />
                        {/* Circle */}
                        <div className="relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.15)] group-hover:bg-white transition-colors duration-300">
                          <Play className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-motif-deep fill-motif-deep ml-1 drop-shadow" />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* YouTube player — shown after click */}
                {hasClicked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 youtube-embed-wrapper"
                  >
                    <div className="relative w-full h-full overflow-hidden youtube-mask-container">
                      <iframe
                        ref={iframeRef}
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&fs=1&playsinline=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                        className="absolute inset-0 w-full h-full"
                        style={{ border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title="Wedding Video"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Subtle cream reflection beneath the card */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-motif-cream/15 blur-xl" />
          </motion.div>
        </div>

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative z-10 text-center mt-8 sm:mt-10"
        >
          <p className="text-[0.65rem] sm:text-xs md:text-sm text-motif-cream/60 font-light italic max-w-xs mx-auto px-4">
            A glimpse into the moments that made our hearts one
          </p>
        </motion.div>
      </Section>
    </>
  )
}

