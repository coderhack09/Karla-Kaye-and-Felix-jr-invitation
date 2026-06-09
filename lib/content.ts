import { getSiteConfig } from "@/lib/site-config"

export async function getSiteContent() {
  const siteConfig = await getSiteConfig()

  return {
    siteConfig,
    details: {
      rsvp: {
        deadline: siteConfig.details.rsvp.deadline,
      },
    },
  }
}

/** @deprecated Use getSiteContent() for dashboard-driven values */
export const siteContent = {
  details: {
    rsvp: {
      deadline: "September 30, 2026",
    },
  },
}
