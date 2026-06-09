import { siteConfig } from "@/content/site"

// Champagne Gold + Beige + Soft Brown
// creates a luxury, elegant, and warm aesthetic
const palette = {
  deep: "var(--color-motif-deep)",            // deep brown
  softBrown: "var(--color-motif-medium)",       // soft brown
  background: "var(--color-motif-cream)",      // beige background
  champagneGold: "var(--color-motif-silver)",   // champagne
  champagneLight: "var(--color-motif-cream)",  // light champagne / paper
} as const

export function Footer() {
  return (
    <footer
      className="mt-20 border-t relative overflow-hidden"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-motif-cream) 94%, transparent)',
        borderColor: 'color-mix(in srgb, var(--color-motif-silver) 25%, transparent)',
      }}
    >
      {/* Subtle champagne gradient + glow, echoing details/gallery */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            background: `linear-gradient(165deg, var(--color-motif-cream) 0%, color-mix(in srgb, var(--color-motif-silver) 13%, transparent) 35%, color-mix(in srgb, var(--color-motif-medium) 6%, transparent) 70%, color-mix(in srgb, var(--color-motif-deep) 3%, transparent) 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            background: `radial-gradient(circle at 50% 0%, var(--color-motif-silver) 0%, transparent 55%)`,
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3
              className="font-serif font-bold text-lg mb-2 tracking-[0.12em] uppercase"
              style={{ color: 'var(--color-motif-deep)' }}
            >
              {siteConfig.couple.bride} & {siteConfig.couple.groom}
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-motif-medium)' }}>
              {siteConfig.wedding.date}
            </p>
          </div>
          <div>
            <h4
              className="font-semibold mb-2 tracking-[0.16em] uppercase text-xs"
              style={{ color: 'var(--color-motif-deep)' }}
            >
              Ceremony
            </h4>
            <p className="text-sm" style={{ color: 'var(--color-motif-medium)' }}>
              {siteConfig.ceremony.location}
            </p>
          </div>
          <div>
            <h4
              className="font-semibold mb-2 tracking-[0.16em] uppercase text-xs"
              style={{ color: palette.deep }}
            >
              Reception
            </h4>
            <p className="text-sm" style={{ color: 'var(--color-motif-medium)' }}>
              {siteConfig.reception.location}
            </p>
          </div>
        </div>
        <div
          className="mt-8 pt-8 text-center text-sm border-t"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-motif-silver) 25%, transparent)',
            color: palette.softBrown,
          }}
        >
          <p>With love and gratitude • {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}
