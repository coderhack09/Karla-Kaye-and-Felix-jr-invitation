/**
 * Deletes images from Cloudinary that have been removed from the local public/ folder.
 *
 * Called automatically by the git pre-commit hook when image files are staged for deletion.
 * Can also be run manually to clean up specific files.
 *
 * Usage:
 *   pnpm delete:cloudinary public/mobile-background/couple.jpg
 *   pnpm delete:cloudinary public/Details/photo.webp public/frontboxes/box-2.jpg
 *   pnpm delete:cloudinary --dry-run public/mobile-background/couple.jpg
 *
 * Environment variables required in .env.local:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
 *   CLOUDINARY_API_KEY=...
 *   CLOUDINARY_API_SECRET=...
 */

import { v2 as cloudinary } from "cloudinary"
import path from "path"
import dotenv from "dotenv"

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROOT_NAMESPACE = "wedding-projects"

/** Default project slug — matches upload-to-cloudinary.ts */
const DEFAULT_PROJECT = "Ken and Ely"

const IMAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg",
  ".JPG", ".JPEG", ".PNG", ".WEBP",
])

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

/**
 * Converts a local file path to a Cloudinary public ID.
 *
 * "public/mobile-background/couple (1).jpg"
 *   → "wedding-projects/vince-and-era/mobile-background/couple (1)"
 */
function toPublicId(filePath: string, projectSlug: string): string {
  const normalized = filePath.replace(/\\/g, "/")
  // Strip leading "public/" or "/public/"
  const rel = normalized.replace(/^\/?public\//, "")
  // Strip file extension
  const withoutExt = rel.replace(/\.[^/.]+$/, "")
  return `${ROOT_NAMESPACE}/${projectSlug}/${withoutExt}`
}

function isImageFile(filePath: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(filePath))
}

// ---------------------------------------------------------------------------
// Delete logic
// ---------------------------------------------------------------------------

async function deleteAsset(publicId: string, dryRun: boolean): Promise<"deleted" | "not_found" | "dry_run" | "failed"> {
  if (dryRun) {
    console.log(`  🔍 dry-run  — ${publicId}`)
    return "dry_run"
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId)
    if (result.result === "ok") {
      console.log(`  🗑  deleted  — ${publicId}`)
      return "deleted"
    } else if (result.result === "not found") {
      console.log(`  ⚠️  not found — ${publicId}`)
      return "not_found"
    } else {
      console.error(`  ✗  failed   — ${publicId}: ${result.result}`)
      return "failed"
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`  ✗  error    — ${publicId}: ${message}`)
    return "failed"
  }
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

interface CliOptions {
  project: string
  dryRun: boolean
  filePaths: string[]
}

function parseArgs(argv: string[]): CliOptions {
  const args = argv.slice(2)
  let project = DEFAULT_PROJECT
  let dryRun = false
  const filePaths: string[] = []

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--project") {
      project = args[++i] ?? project
    } else if (args[i] === "--dry-run") {
      dryRun = true
    } else {
      filePaths.push(args[i])
    }
  }

  return { project, dryRun, filePaths }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const { NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env

  if (!NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error(
      "❌  Missing Cloudinary credentials.\n" +
        "    Ensure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and\n" +
        "    CLOUDINARY_API_SECRET are set in .env.local"
    )
    process.exit(1)
  }

  const opts = parseArgs(process.argv)

  // Filter to image files only (hook may pass mixed file types)
  const imageFiles = opts.filePaths.filter(isImageFile)

  if (imageFiles.length === 0) {
    console.log("ℹ️  No image files to delete from Cloudinary.")
    process.exit(0)
  }

  const projectSlug = slugify(opts.project)

  console.log(`\n🗑️  Cloudinary delete`)
  console.log(`   Project : "${opts.project}" → ${ROOT_NAMESPACE}/${projectSlug}`)
  console.log(`   Files   : ${imageFiles.length}`)
  console.log(`   Dry-run : ${opts.dryRun}\n`)

  let deleted = 0, notFound = 0, failed = 0

  for (const filePath of imageFiles) {
    const publicId = toPublicId(filePath, projectSlug)
    const status = await deleteAsset(publicId, opts.dryRun)
    if (status === "deleted" || status === "dry_run") deleted++
    else if (status === "not_found") notFound++
    else failed++
  }

  console.log("\n─────────────────────────────────────────")
  console.log(`  Project   : ${projectSlug}`)
  console.log(`  Deleted   : ${deleted}`)
  console.log(`  Not found : ${notFound}`)
  console.log(`  Failed    : ${failed}`)
  console.log("─────────────────────────────────────────\n")

  if (failed > 0) process.exit(1)
}

main()
