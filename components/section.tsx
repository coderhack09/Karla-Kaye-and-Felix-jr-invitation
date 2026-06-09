import type { ReactNode } from "react"

interface SectionProps {
  id: string
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
  bgColor?: string
}

export function Section({ id, title, subtitle, children, className = "", bgColor }: SectionProps) {
  const bgColorClass = bgColor ? `bg-${bgColor}` : ""
  
  return (
    <section id={id} className={`py-12 sm:py-16 md:py-20 lg:py-24 ${bgColorClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        {(title || subtitle) && (
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            {title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-3 sm:mb-4 md:mb-6 text-balance">{title}</h2>
            )}
            {subtitle && <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto text-pretty px-4">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
