import { PROJECT_PREFIX } from "@/lib/cloudinary"
import { galleryFallbackImages } from "@/content/gallery-images"

const GALLERY_FOLDERS = ["gallery", "desktop-background"] as const

function publicIdToLocalPath(publicId: string): string {
  const relative = publicId.startsWith(`${PROJECT_PREFIX}/`)
    ? publicId.slice(PROJECT_PREFIX.length + 1)
    : publicId

  return `/${relative}.webp`
}

function sortByNumericSuffix(paths: string[]): string[] {
  return [...paths].sort((a, b) => {
    const numA = parseInt(a.match(/\((\d+)\)/)?.[1] || "0", 10)
    const numB = parseInt(b.match(/\((\d+)\)/)?.[1] || "0", 10)
    return numA - numB
  })
}

async function listCloudinaryFolder(folder: string): Promise<string[]> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return []
  }

  const prefix = `${PROJECT_PREFIX}/${folder}`
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")
  const images: string[] = []
  let nextCursor: string | undefined

  do {
    const params = new URLSearchParams({
      type: "upload",
      prefix,
      max_results: "500",
    })
    if (nextCursor) params.set("next_cursor", nextCursor)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?${params}`,
      {
        headers: { Authorization: `Basic ${auth}` },
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      console.error(`Cloudinary list failed for ${prefix}:`, response.status)
      break
    }

    const data = (await response.json()) as {
      resources?: { public_id: string }[]
      next_cursor?: string
    }

    for (const resource of data.resources ?? []) {
      images.push(publicIdToLocalPath(resource.public_id))
    }

    nextCursor = data.next_cursor
  } while (nextCursor)

  return images
}

/** Loads gallery images from Cloudinary (no local filesystem reads). */
export async function fetchGalleryImages(): Promise<string[]> {
  for (const folder of GALLERY_FOLDERS) {
    const images = sortByNumericSuffix(await listCloudinaryFolder(folder))
    if (images.length > 0) {
      return images
    }
  }

  return sortByNumericSuffix(galleryFallbackImages)
}
