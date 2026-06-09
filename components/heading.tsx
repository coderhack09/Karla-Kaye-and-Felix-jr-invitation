"use client"

import type { ReactNode } from "react"

interface HeadingProps {
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  children: ReactNode
  className?: string
}

export function Heading({ level, children, className = "" }: HeadingProps) {
  const baseStyles = "font-playfair font-bold text-ink"
  
  const levelStyles = {
    h1: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
    h2: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
    h3: "text-xl sm:text-2xl md:text-3xl",
    h4: "text-lg sm:text-xl md:text-2xl",
    h5: "text-base sm:text-lg md:text-xl",
    h6: "text-sm sm:text-base md:text-lg",
  }

  const Component = level

  return (
    <Component className={`${baseStyles} ${levelStyles[level]} ${className}`}>
      {children}
    </Component>
  )
}
