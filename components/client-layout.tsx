"use client"

import { AudioProvider } from "@/contexts/audio-context"
import { SiteConfigProvider } from "@/contexts/site-config-context"
import BackgroundMusic from "@/components/background-music"

/**
 * Wraps the entire app so AudioProvider + the audio element
 * live in the root layout and are never unmounted during
 * client-side navigation (e.g. main page → /gallery → back).
 * This keeps background music playing across route changes.
 */
export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteConfigProvider>
      <AudioProvider>
        <BackgroundMusic />
        {children}
      </AudioProvider>
    </SiteConfigProvider>
  )
}