'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Cinzel, Cormorant_Garamond } from 'next/font/google'
import { X } from 'lucide-react'
import Image from 'next/image'

import { PhotoFlipbook, type FlipbookPageLayout, type FlipbookPhoto } from './PhotoFlipbook'
import { TornPaperEdge } from './TornPaperEdge'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: '400',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

interface StorySectionProps {
  /** Primary photo; defaults to the first entry in `images` when omitted */
  imageSrc?: string
  /** One photo per flipbook page for this section */
  images?: FlipbookPhoto[]
  title?: string
  text: React.ReactNode
  layout: 'image-left' | 'image-right'
  theme: 'dark' | 'light'
  /** Reserved for section sequencing / future use */
  isFirst?: boolean
  isLast?: boolean
  /** Optional override when you know orientation (layout before load). */
  imageAspect?: 'auto' | 'portrait' | 'landscape' | 'square'
}

const fallbackAspect = { w: 3, h: 4 }

function ratioFromVariant(
  variant: StorySectionProps['imageAspect'],
): { w: number; h: number } {
  switch (variant) {
    case 'landscape':
      return { w: 4, h: 3 }
    case 'square':
      return { w: 1, h: 1 }
    case 'portrait':
      return { w: 3, h: 4 }
    case 'auto':
    default:
      return fallbackAspect
  }
}

function scaledIntrinsic(r: { w: number; h: number }) {
  const k = 512
  return { w: Math.max(1, Math.round(r.w * k)), h: Math.max(1, Math.round(r.h * k)) }
}

/** Square and landscape → full-width + text below on desktop; portrait → side-by-side. */
function isLandscapeLike(w: number, h: number) {
  return w >= h
}

export const StorySection: React.FC<StorySectionProps> = ({
  imageSrc,
  images,
  title,
  text,
  layout,
  theme,
  imageAspect = 'auto',
}: StorySectionProps) => {
  const isDark = theme === 'dark'
  const [loadedSize, setLoadedSize] = useState<{ w: number; h: number } | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<FlipbookPhoto | null>(null)
  const [lightboxSize, setLightboxSize] = useState<{ w: number; h: number } | null>(null)
  const [sectionPhotoSizes, setSectionPhotoSizes] = useState<Map<string, { w: number; h: number }>>(
    new Map(),
  )

  const primarySrc = imageSrc ?? images?.[0]?.src ?? ''

  const flipbookPhotos = useMemo<FlipbookPhoto[]>(
    () =>
      images && images.length > 0
        ? images
        : primarySrc
          ? [{ src: primarySrc, alt: title ? `Story: ${title}` : 'Story moment' }]
          : [],
    [primarySrc, images, title],
  )

  useEffect(() => {
    if (!primarySrc) return
    setLoadedSize(null)
    const probe = new window.Image()
    probe.onload = () => {
      setLoadedSize({ w: probe.naturalWidth, h: probe.naturalHeight })
    }
    probe.src = primarySrc
  }, [primarySrc, images])

  useEffect(() => {
    if (flipbookPhotos.length === 0) return

    flipbookPhotos.forEach((photo) => {
      if (!photo.src) return
      const probe = new window.Image()
      probe.onload = () => {
        setSectionPhotoSizes((prev) => {
          if (prev.has(photo.src)) return prev
          const next = new Map(prev)
          next.set(photo.src, { w: probe.naturalWidth, h: probe.naturalHeight })
          return next
        })
      }
      probe.src = photo.src
    })
  }, [flipbookPhotos])

  const flipbookLayout = useMemo<FlipbookPageLayout>(() => {
    if (imageAspect === 'landscape' || imageAspect === 'square') return 'single'
    if (imageAspect === 'portrait') return 'adaptive'
    if (flipbookPhotos.length === 0) return 'adaptive'

    const probed = flipbookPhotos.filter((photo) => sectionPhotoSizes.has(photo.src))
    if (probed.length === 0) return 'single'

    const allProbedLandscape = probed.every((photo) => {
      const size = sectionPhotoSizes.get(photo.src)!
      return isLandscapeLike(size.w, size.h)
    })

    if (allProbedLandscape) return 'single'

    return 'adaptive'
  }, [flipbookPhotos, imageAspect, sectionPhotoSizes])

  useEffect(() => {
    if (!lightboxOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [lightboxOpen])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen])

  const intrinsic =
    loadedSize ??
    (imageAspect !== 'auto'
      ? scaledIntrinsic(ratioFromVariant(imageAspect))
      : scaledIntrinsic(fallbackAspect))

  const layoutKnown = imageAspect !== 'auto' || loadedSize !== null

  const landscapeLike =
    imageAspect === 'landscape' || imageAspect === 'square'
      ? true
      : imageAspect === 'portrait'
        ? false
        : loadedSize
          ? isLandscapeLike(loadedSize.w, loadedSize.h)
          : false

  /** Desktop: side-by-side only when we know it's portrait-like; `auto` before load stays stacked to avoid wrong crop. */
  const usePortraitSplitDesktop = layoutKnown && !landscapeLike

  const bgColor = isDark ? 'bg-motif-deep' : 'bg-motif-cream relative z-10'
  const textColor = isDark ? 'text-motif-cream' : 'text-motif-deep'

  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const rotation =
    layout === 'image-left' ? 'rotate-1 md:rotate-2' : '-rotate-1 md:-rotate-2'

  const flexDirectionRow = layout === 'image-left' ? 'md:flex-row' : 'md:flex-row-reverse'
  const textAlignment = layout === 'image-left' ? 'text-left' : 'text-left md:text-right'

  const sizesInline =
    '(max-width: 767px) 100vw, ' +
    (usePortraitSplitDesktop ? '(max-width: 1024px) 55vw, 42vw' : '(max-width: 1024px) 90vw, min(1200px, 85vw)')

  const spreadSizesInline =
    '(max-width: 767px) 46vw, ' +
    (usePortraitSplitDesktop ? '(max-width: 1024px) 28vw, 21vw' : '(max-width: 1024px) 45vw, 40vw')

  const imageClassName =
    'object-contain object-center transition-[transform,opacity] duration-500 ease-out group-hover/image:scale-[1.03] group-hover/image:opacity-[0.97]'

  const spreadImageClassName =
    'object-cover object-center transition-[transform,opacity] duration-500 ease-out group-hover/image:scale-[1.02] group-hover/image:opacity-[0.97]'

  const isLandscapeFlipbook = flipbookLayout === 'single' && !usePortraitSplitDesktop

  const containerClassName = usePortraitSplitDesktop
    ? 'min-h-[14rem] sm:min-h-[18rem] md:min-h-[22rem] lg:min-h-[26rem] md:max-h-[min(90vh,40rem)] lg:max-h-[min(92vh,44rem)]'
    : isLandscapeFlipbook
      ? 'min-h-[11rem] sm:min-h-[14rem] md:min-h-[18rem] lg:min-h-[22rem] aspect-[16/10] sm:aspect-[16/9] max-h-[min(72vh,40rem)] md:max-h-[min(78vh,48rem)] lg:max-h-[min(82vh,56rem)]'
      : 'min-h-[12rem] sm:min-h-[16rem] md:min-h-[20rem] lg:min-h-[24rem] md:max-h-[min(82vh,48rem)] lg:max-h-[min(85vh,56rem)] xl:max-h-[min(88vh,60rem)]'

  const spreadContainerClassName = usePortraitSplitDesktop
    ? 'min-h-[16rem] sm:min-h-[20rem] md:min-h-[24rem] lg:min-h-[30rem] md:max-h-[min(92vh,44rem)] lg:max-h-[min(94vh,48rem)]'
    : 'min-h-[14rem] sm:min-h-[18rem] md:min-h-[22rem] lg:min-h-[28rem] md:max-h-[min(88vh,52rem)]'

  const openLightbox = (photo: FlipbookPhoto) => {
    setLightboxPhoto(photo)
    setLightboxSize(null)
    setLightboxOpen(true)

    const probe = new window.Image()
    probe.onload = () => {
      setLightboxSize({ w: probe.naturalWidth, h: probe.naturalHeight })
    }
    probe.src = photo.src
  }

  const lightboxSrc = lightboxPhoto?.src ?? primarySrc
  const lightboxIntrinsic =
    lightboxSize ??
    (lightboxPhoto?.src === primarySrc ? intrinsic : scaledIntrinsic(fallbackAspect))

  const textBlock = (
    <div
      className={`${textColor} w-full ${usePortraitSplitDesktop ? `md:w-5/12 ${textAlignment}` : 'max-w-3xl mx-auto text-center md:px-4'}`}
    >
      {title && (
        <h2
          className={`${cinzel.className} text-2xl sm:text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-6 tracking-wide leading-tight transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } ${isDark ? 'text-motif-cream' : 'text-motif-deep'}`}
        >
          {title}
        </h2>
      )}

      <div
        className={`${cormorant.className} text-[15px] leading-relaxed sm:text-base md:text-xl md:leading-relaxed lg:text-2xl space-y-3 md:space-y-6 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } ${theme === 'light' ? 'italic font-normal' : 'font-light'}`}
      >
        {text}
      </div>
    </div>
  )

  return (
    <div className={`${bgColor} relative`}>
      {!isDark && (
        <>
          <div className="absolute top-0 left-0 w-full -mt-[8px] md:-mt-[20px] z-20 text-motif-cream pointer-events-none">
            <TornPaperEdge flipped={true} />
          </div>
          <div className="absolute bottom-0 left-0 w-full -mb-[8px] md:-mb-[20px] z-20 text-motif-cream pointer-events-none">
            <TornPaperEdge flipped={false} />
          </div>
        </>
      )}

      <div
        ref={sectionRef}
        className={`container mx-auto px-3 sm:px-4 md:px-12 py-12 md:py-24 lg:py-32 relative z-10 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}
      >
        <div
          className={`flex flex-col gap-6 sm:gap-8 md:gap-10 ${
            usePortraitSplitDesktop ? `${flexDirectionRow} md:items-start md:justify-between` : ''
          }`}
        >
          <div
            className={`group/image w-full transition-all duration-1000 delay-300 ease-out ${
              isVisible ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-0'
            } ${usePortraitSplitDesktop ? 'md:w-7/12 md:shrink-0' : ''}`}
          >
            <PhotoFlipbook
              photos={flipbookPhotos}
              variant="story"
              pageLayout={flipbookLayout}
              isDark={isDark}
              rotation={usePortraitSplitDesktop ? rotation : 'md:rotate-0'}
              imageSizes={sizesInline}
              spreadImageSizes={spreadSizesInline}
              imageClassName={
                isLandscapeFlipbook
                  ? 'object-contain object-center transition-[transform,opacity] duration-500 ease-out group-hover/image:scale-[1.02] group-hover/image:opacity-[0.97]'
                  : imageClassName
              }
              spreadImageClassName={spreadImageClassName}
              containerClassName={containerClassName}
              spreadContainerClassName={spreadContainerClassName}
              onPhotoClick={(photo) => openLightbox(photo)}
              clickLabel={title ? `Enlarge photo: ${title}` : 'Enlarge story photo'}
              focusRingOffsetClass={
                isDark ? 'focus-visible:ring-offset-motif-deep' : 'focus-visible:ring-offset-motif-cream'
              }
            />
          </div>

          {textBlock}
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 backdrop-blur-sm p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Full size photo"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 z-10 rounded-full border border-white/25 bg-black/50 p-2.5 text-white transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-label="Close preview"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxOpen(false)
            }}
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
          </button>
          <div
            className="relative flex max-h-[min(92vh,900px)] w-full max-w-6xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxSrc}
              alt={lightboxPhoto?.alt ?? (title ? `Full size: ${title}` : 'Story moment full size')}
              width={lightboxIntrinsic.w}
              height={lightboxIntrinsic.h}
              sizes="100vw"
              className="max-h-[min(92vh,900px)] w-auto max-w-full object-contain"
              quality={95}
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}
