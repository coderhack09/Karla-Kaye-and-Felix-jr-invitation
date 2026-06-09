import { type NextRequest, NextResponse } from "next/server"
import { siteConfig } from "@/content/site"
import { getProposalRoleById } from "@/lib/proposal-roles"
import type { ProposalResponse, ProposalSubmitPayload } from "@/lib/proposal-types"

const PROPOSAL_SCRIPT_URL = siteConfig.googleAPI.proposalResponses
const ENTOURAGE_SCRIPT_URL = siteConfig.googleAPI.entourage
const SPONSORS_SCRIPT_URL = siteConfig.googleAPI.sponsors

function normalizeResponse(row: Record<string, unknown>): ProposalResponse | null {
  const r = row as Record<string, string | undefined>
  const role = r.role ?? r.Role ?? ""
  const name = r.name ?? r.Name ?? ""
  const status = (r.status ?? r.Status ?? "") as ProposalResponse["status"]
  const submittedAt = r.submittedAt ?? r.SubmittedAt ?? r.timestamp ?? r.Timestamp ?? ""
  const category =
    r.category ?? r.Category ?? r.roleCategory ?? r.RoleCategory ?? ""
  const id = r.id ?? r.Id ?? `${role}-${submittedAt}-${name}`

  if (!role && !category && !name) return null
  if (status !== "Confirmed" && status !== "Declined") return null

  return {
    id,
    role,
    name,
    status,
    submittedAt,
    category,
  }
}

async function syncConfirmedToSheet(payload: ProposalSubmitPayload) {
  const roleDef = getProposalRoleById(payload.role)
  if (!roleDef || payload.status !== "Confirmed") return

  if (roleDef.type === "entourage") {
    await fetch(ENTOURAGE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Name: payload.name.trim(),
        RoleCategory: roleDef.roleCategory,
        Email: "",
      }),
    })
    return
  }

  if (roleDef.type === "sponsor-ninong") {
    await fetch(SPONSORS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        MalePrincipalSponsor: payload.name.trim(),
        FemalePrincipalSponsor: "",
      }),
    })
    return
  }

  if (roleDef.type === "sponsor-ninang") {
    await fetch(SPONSORS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        MalePrincipalSponsor: "",
        FemalePrincipalSponsor: payload.name.trim(),
      }),
    })
  }
}

export async function GET() {
  try {
    const response = await fetch(`${PROPOSAL_SCRIPT_URL}?action=proposals`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch proposal responses")
    }

    const data = await response.json()

    if (Array.isArray(data)) {
      const parsed = data
        .map((row) => normalizeResponse(row as Record<string, unknown>))
        .filter((row): row is ProposalResponse => row !== null)
      return NextResponse.json(parsed, { status: 200 })
    }

    const rows = (data?.proposals ?? data?.GoogleSheetData ?? []) as Record<string, unknown>[]
    if (Array.isArray(rows)) {
      const parsed = rows
        .map((row) => normalizeResponse(row))
        .filter((row): row is ProposalResponse => row !== null)
      return NextResponse.json(parsed, { status: 200 })
    }

    return NextResponse.json([], { status: 200 })
  } catch (error) {
    console.error("Error fetching proposal responses:", error)
    return NextResponse.json(
      { error: "Failed to fetch proposal responses" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProposalSubmitPayload
    const { role, name, status, submittedAt } = body

    if (!role || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (status !== "Confirmed" && status !== "Declined") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const roleDef = getProposalRoleById(role)
    if (!roleDef) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const payload: ProposalSubmitPayload = {
      role,
      name: name?.trim() || (status === "Declined" ? "Declined Entourage Offer" : ""),
      status,
      submittedAt: submittedAt || new Date().toISOString(),
    }

    let logSaved = false
    try {
      const response = await fetch(PROPOSAL_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "proposal",
          role: payload.role,
          name: payload.name,
          status: payload.status,
          submittedAt: payload.submittedAt,
          category: roleDef.roleCategory,
          id: `${role}-${Date.now()}`,
        }),
      })
      logSaved = response.ok
    } catch {
      logSaved = false
    }

    if (status === "Confirmed" && payload.name) {
      await syncConfirmedToSheet(payload)
    }

    if (!logSaved && status === "Declined") {
      throw new Error("Failed to save proposal response")
    }

    return NextResponse.json(
      {
        success: true,
        logSaved,
        synced: status === "Confirmed" && Boolean(payload.name),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error saving proposal response:", error)
    return NextResponse.json(
      { error: "Failed to save proposal response" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const response = await fetch(PROPOSAL_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete-proposal",
        id: id.trim(),
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to delete proposal response")
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error deleting proposal response:", error)
    return NextResponse.json(
      { error: "Failed to delete proposal response" },
      { status: 500 }
    )
  }
}
