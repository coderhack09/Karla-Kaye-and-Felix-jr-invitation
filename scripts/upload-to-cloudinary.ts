/**
 * Enhanced Cloudinary upload script with per-project folder organisation.
 *
 * Each project gets its own top-level folder inside `wedding-projects/` and the
 * full subfolder structure from the local source directory is mirrored exactly.
 *
 * Usage:
 *   pnpm upload:cloudinary --project "Vince and Era"
 *   pnpm upload:cloudinary --project "Vince and Era" --source public
 *   pnpm upload:cloudinary --project "Vince and Era" --overwrite
 *   pnpm upload:cloudinary --project "Vince and Era" --dry-run
 *   pnpm upload:cloudinary --project "Vince and Era" --json-out uploads.json
 *
 * Environment variables required in .env.local:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
 *   CLOUDINARY_API_KEY=...
 *   CLOUDINARY_API_SECRET=...
 */

import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
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
// Types
// ---------------------------------------------------------------------------

interface UploadResult {
  filePath: string
  publicId: string
  url: string
  folder: string
  status: "uploaded" | "skipped" | "failed"
  error?: string
}

/** { "mobile-background": ["https://..."], "Details": ["https://..."] } */
type FolderMap = Record<string, string[]>

interface CliOptions {
  project: string
  sourceDir: string
  overwrite: boolean
  dryRun: boolean
  jsonOut: string | null
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROOT_NAMESPACE = "wedding-projects"

const IMAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg",
  ".JPG", ".JPEG", ".PNG", ".WEBP",
])

/** Folders inside /public that should never be uploaded */
const SKIP_FOLDERS = new Set(["favicon_io", "background_music"])

// Concurrent uploads per batch — keep low to respect Cloudinary rate limits
const BATCH_SIZE = 5

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalises a human-readable project name into a URL-safe slug.
 *
 * "Vince and Era" → "vince-and-era"
 * "John & Jane's Wedding!" → "john-janes-wedding"
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special characters
    .trim()
    .replace(/\s+/g, "-")           // spaces → hyphens
    .replace(/-+/g, "-")            // collapse repeated hyphens
}

/**
 * Returns every image file under `dir` (recursive), skipping SKIP_FOLDERS.
 */
function collectImageFiles(dir: string): string[] {
  const results: string[] = []

  function walk(current: string): void {
    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (!SKIP_FOLDERS.has(entry.name)) walk(fullPath)
      } else if (entry.isFile()) {
        if (IMAGE_EXTENSIONS.has(path.extname(entry.name))) {
          results.push(fullPath)
        }
      }
    }
  }

  walk(dir)
  return results
}

/**
 * Builds the full Cloudinary public_id for a file:
 *   wedding-projects/{projectSlug}/{relativePathWithoutExt}
 *
 * Example:
 *   /public/mobile-background/couple (1).jpg
 *   → "wedding-projects/vince-and-era/mobile-background/couple (1)"
 */
function buildPublicId(filePath: string, sourceDir: string, projectSlug: string): string {
  const rel = path.relative(sourceDir, filePath)
  const withoutExt = rel.replace(/\.[^/.]+$/, "")
  const forwardSlash = withoutExt.split(path.sep).join("/")
  return `${ROOT_NAMESPACE}/${projectSlug}/${forwardSlash}`
}

/**
 * Extracts the immediate subfolder name from the public_id so results can be
 * bucketed by folder in the output JSON.
 *
 * "wedding-projects/vince-and-era/mobile-background/couple (1)"
 * → "mobile-background"
 */
function extractFolder(publicId: string, projectSlug: string): string {
  const prefix = `${ROOT_NAMESPACE}/${projectSlug}/`
  const rel = publicId.startsWith(prefix) ? publicId.slice(prefix.length) : publicId
  return rel.split("/")[0] ?? "root"
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(argv: string[]): CliOptions {
  const args = argv.slice(2)
  let project = ""
  let sourceDir = path.resolve(process.cwd(), "public")
  let overwrite = false
  let dryRun = false
  let jsonOut: string | null = null

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--project":
        project = args[++i] ?? ""
        break
      case "--source":
        sourceDir = path.resolve(process.cwd(), args[++i] ?? "public")
        break
      case "--overwrite":
        overwrite = true
        break
      case "--dry-run":
        dryRun = true
        break
      case "--json-out":
        jsonOut = args[++i] ?? null
        break
      default:
        // Allow positional first arg as project name for convenience
        if (!project && !args[i].startsWith("--")) {
          project = args[i]
        }
    }
  }

  return { project, sourceDir, overwrite, dryRun, jsonOut }
}

// ---------------------------------------------------------------------------
// Upload logic
// ---------------------------------------------------------------------------

async function resourceExists(publicId: string): Promise<boolean> {
  try {
    await cloudinary.api.resource(publicId)
    return true
  } catch {
    return false
  }
}

async function uploadFile(
  filePath: string,
  publicId: string,
  options: { overwrite: boolean; dryRun: boolean }
): Promise<UploadResult> {
  const folder = path.dirname(publicId)

  if (options.dryRun) {
    return { filePath, publicId, url: "(dry-run)", folder, status: "uploaded" }
  }

  if (!options.overwrite) {
    const exists = await resourceExists(publicId)
    if (exists) {
      console.log(`  ✓ skip    — ${publicId}`)
      return { filePath, publicId, url: "", folder, status: "skipped" }
    }
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: options.overwrite,
      use_filename: false,
      unique_filename: false,
    })
    console.log(`  ↑ upload  — ${result.secure_url}`)
    return { filePath, publicId, url: result.secure_url, folder, status: "uploaded" }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`  ✗ failed  — ${publicId}: ${message}`)
    return { filePath, publicId, url: "", folder, status: "failed", error: message }
  }
}

// ---------------------------------------------------------------------------
// Result serialisation
// ---------------------------------------------------------------------------

function buildFolderMap(results: UploadResult[], projectSlug: string): FolderMap {
  const map: FolderMap = {}
  for (const r of results) {
    if (r.status !== "uploaded" || !r.url) continue
    const folder = extractFolder(r.publicId, projectSlug)
    if (!map[folder]) map[folder] = []
    map[folder].push(r.url)
  }
  return map
}

function printSummary(results: UploadResult[], projectSlug: string): void {
  const uploaded = results.filter((r) => r.status === "uploaded")
  const skipped = results.filter((r) => r.status === "skipped")
  const failed = results.filter((r) => r.status === "failed")

  console.log("\n─────────────────────────────────────────")
  console.log(`  Project : ${projectSlug}`)
  console.log(`  Uploaded: ${uploaded.length}`)
  console.log(`  Skipped : ${skipped.length}`)
  console.log(`  Failed  : ${failed.length}`)
  console.log("─────────────────────────────────────────\n")
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const opts = parseArgs(process.argv)

  // Validate credentials
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

  // Validate project name
  if (!opts.project) {
    console.error(
      "❌  No project name supplied.\n" +
        '    Usage: pnpm upload:cloudinary --project "Ken and Ely"'
    )
    process.exit(1)
  }

  const projectSlug = slugify(opts.project)

  // Validate source directory
  if (!fs.existsSync(opts.sourceDir)) {
    console.error(`❌  Source directory not found: ${opts.sourceDir}`)
    process.exit(1)
  }

  const files = collectImageFiles(opts.sourceDir)

  console.log(`\n☁️  Cloudinary upload`)
  console.log(`   Project  : "${opts.project}" → ${ROOT_NAMESPACE}/${projectSlug}`)
  console.log(`   Source   : ${opts.sourceDir}`)
  console.log(`   Images   : ${files.length}`)
  console.log(`   Overwrite: ${opts.overwrite}`)
  console.log(`   Dry-run  : ${opts.dryRun}\n`)

  if (files.length === 0) {
    console.log("⚠️  No image files found. Nothing to upload.")
    return
  }

  const allResults: UploadResult[] = []

  // Process in batches to stay within Cloudinary rate limits
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE)
    const batchResults = await Promise.all(
      batch.map((filePath) => {
        const publicId = buildPublicId(filePath, opts.sourceDir, projectSlug)
        return uploadFile(filePath, publicId, opts)
      })
    )
    allResults.push(...batchResults)
  }

  printSummary(allResults, projectSlug)

  // Build and output the folder → URL map
  const folderMap = buildFolderMap(allResults, projectSlug)

  if (Object.keys(folderMap).length > 0) {
    console.log("📁  Folder map:")
    console.log(JSON.stringify(folderMap, null, 2))
  }

  // Optionally persist the map to disk
  if (opts.jsonOut) {
    const outPath = path.resolve(process.cwd(), opts.jsonOut)
    fs.writeFileSync(outPath, JSON.stringify(folderMap, null, 2))
    console.log(`\n💾  Saved to ${outPath}`)
  }

  const hasFailed = allResults.some((r) => r.status === "failed")
  if (hasFailed) process.exit(1)
}

main()
