"use client"

import NextImage, { type ImageProps } from "next/image"
import { cloudinaryLoader } from "@/lib/cloudinary"
import { useState } from "react"

/**
 * Drop-in replacement for Next.js <Image> that serves every image through Cloudinary.
 * Automatically applies f_auto (WebP/AVIF), q_auto, and responsive widths.
 *
 * Falls back to the original local /public path if the Cloudinary URL fails (e.g. image
 * not yet uploaded), so the site never shows broken images during the migration.
 */
export function CloudinaryImage({ src, ...props }: ImageProps) {
  const [useFallback, setUseFallback] = useState(false)

  if (useFallback) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <NextImage src={src} {...props} />
  }

  return (
    <NextImage
      loader={cloudinaryLoader}
      src={src}
      {...props}
      onError={() => setUseFallback(true)}
    />
  )
}
