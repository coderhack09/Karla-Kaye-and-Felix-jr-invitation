"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { siteConfig as defaultSiteConfig } from "@/content/site"
import type { SiteConfig } from "@/lib/site-config"

interface SiteConfigContextValue {
  siteConfig: SiteConfig
  isLoading: boolean
  error: string | null
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null)

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadSiteConfig() {
      try {
        const response = await fetch("/api/wedding-details")
        if (!response.ok) {
          throw new Error("Failed to fetch site config")
        }

        const data = await response.json()
        if (!cancelled && data.siteConfig) {
          setSiteConfig(data.siteConfig)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load site config")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadSiteConfig()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <SiteConfigContext.Provider value={{ siteConfig, isLoading, error }}>
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig(): SiteConfig {
  const context = useContext(SiteConfigContext)
  if (!context) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider")
  }
  return context.siteConfig
}

export function useSiteConfigState(): SiteConfigContextValue {
  const context = useContext(SiteConfigContext)
  if (!context) {
    throw new Error("useSiteConfigState must be used within a SiteConfigProvider")
  }
  return context
}
