"use client"

import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Hide the navbar on dashboard
    const navbar = document.querySelector('nav')
    if (navbar) {
      navbar.style.display = 'none'
    }
    
    return () => {
      // Restore navbar when leaving dashboard
      if (navbar) {
        navbar.style.display = ''
      }
    }
  }, [])

  return <>{children}</>
}

