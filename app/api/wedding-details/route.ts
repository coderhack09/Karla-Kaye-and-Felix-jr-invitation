import { type NextRequest, NextResponse } from "next/server"
import { siteConfig } from "@/content/site"
import { mergeWeddingDetailsIntoSiteConfig } from "@/lib/site-config"
import {
  type WeddingDetails,
  emptyWeddingDetails,
} from "@/lib/wedding-details-types"

const GOOGLE_SCRIPT_URL = siteConfig.googleAPI.weddingDetails

export type { WeddingDetails } from "@/lib/wedding-details-types"

async function fetchWeddingDetailsFromGoogle(): Promise<WeddingDetails> {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    console.error("Google Apps Script returned error status:", response.status)
    return emptyWeddingDetails
  }

  const data = await response.json()

  if (data.error) {
    console.error("Google Apps Script returned error:", data.error)
    return emptyWeddingDetails
  }

  return data as WeddingDetails
}

function buildResponse(details: WeddingDetails) {
  const siteConfigMerged = mergeWeddingDetailsIntoSiteConfig(details)

  return {
    ...details,
    weddingDetails: details,
    siteConfig: siteConfigMerged,
  }
}

// GET: Fetch wedding details from Google Sheets (includes merged siteConfig)
export async function GET() {
  try {
    const details = await fetchWeddingDetailsFromGoogle()
    return NextResponse.json(buildResponse(details), { status: 200 })
  } catch (error) {
    console.error("Error fetching wedding details:", error)
    return NextResponse.json(buildResponse(emptyWeddingDetails), { status: 200 })
  }
}

// PUT: Update wedding details
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const updateData = {
      action: "update",
      ...body,
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    const responseText = await response.text()

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError)
      console.error("Response text:", responseText.substring(0, 500))

      if (!response.ok) {
        return NextResponse.json(
          {
            error: `Google Apps Script returned an error. Status: ${response.status}. The script may need to be updated or redeployed.`,
            details: responseText.substring(0, 200),
          },
          { status: response.status || 500 }
        )
      }

      data = { status: "ok", message: "Wedding details updated successfully" }
    }

    if (data.error) {
      console.error("Error in response data:", data.error)
      return NextResponse.json({ error: data.error }, { status: 400 })
    }

    if (!response.ok) {
      const errorMessage =
        data.error ||
        `Failed to update wedding details. Google Apps Script returned status ${response.status}`
      return NextResponse.json({ error: errorMessage }, { status: response.status || 500 })
    }

    const mergedSiteConfig = mergeWeddingDetailsIntoSiteConfig(body as WeddingDetails)

    return NextResponse.json(
      {
        ...data,
        siteConfig: mergedSiteConfig,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error("Error updating wedding details:", error)
    const message = error instanceof Error ? error.message : "Failed to update wedding details"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE: Clear all wedding details
export async function DELETE() {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "delete" }),
    })

    if (!response.ok) {
      throw new Error("Failed to clear wedding details")
    }

    const data = await response.json()
    return NextResponse.json(
      {
        ...data,
        siteConfig: siteConfig,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error("Error clearing wedding details:", error)
    const message = error instanceof Error ? error.message : "Failed to clear wedding details"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST: Initialize wedding details with defaults (legacy support)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.action === "initialize") {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "initialize" }),
      })

      if (!response.ok) {
        throw new Error("Failed to initialize wedding details")
      }

      const data = await response.json()
      return NextResponse.json(data, { status: 200 })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error initializing wedding details:", error)
    return NextResponse.json(
      { error: "Failed to initialize wedding details" },
      { status: 500 }
    )
  }
}
