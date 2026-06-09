import { type NextRequest, NextResponse } from "next/server"
import { siteConfig } from "@/content/site"

// Replace this with your Entourage Google Apps Script URL
const ENTOURAGE_SCRIPT_URL = siteConfig.googleAPI.entourage

// Entourage interface
export interface Entourage {
  Name: string
  RoleCategory: string
  RoleTitle: string
  Email: string
}

// GET: Fetch all entourage
export async function GET() {
  try {
    const response = await fetch(ENTOURAGE_SCRIPT_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch entourage')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching entourage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entourage' },
      { status: 500 }
    )
  }
}

// POST: Add a new entourage member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { Name, RoleCategory, RoleTitle, Email } = body

    // Validation
    if (!Name || typeof Name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const entourageData: Record<string, string> = {
      Name: Name.trim(),
      RoleCategory: RoleCategory?.trim() || '',
      Email: Email?.trim() || '',
    }
    if (RoleTitle?.trim()) {
      entourageData.RoleTitle = RoleTitle.trim()
    }

    const response = await fetch(ENTOURAGE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entourageData),
    })

    if (!response.ok) {
      throw new Error('Failed to add entourage member')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error adding entourage member:', error)
    return NextResponse.json(
      { error: 'Failed to add entourage member' },
      { status: 500 }
    )
  }
}

// PUT: Update an existing entourage member
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { Name, RoleCategory, RoleTitle, Email, originalName } = body

    // Validation
    if (!Name || typeof Name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const updateData = {
      action: 'update',
      originalName: originalName || Name, // Use originalName for lookup, Name for update
      Name: Name.trim(),
      RoleCategory: RoleCategory?.trim() || '',
      RoleTitle: RoleTitle?.trim() || '',
      Email: Email?.trim() || '',
    }

    const response = await fetch(ENTOURAGE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error('Failed to update entourage member')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error updating entourage member:', error)
    return NextResponse.json(
      { error: 'Failed to update entourage member' },
      { status: 500 }
    )
  }
}

// DELETE: Delete an entourage member
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { Name } = body

    // Validation
    if (!Name || typeof Name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const deleteData = {
      action: 'delete',
      Name: Name.trim(),
    }

    const response = await fetch(ENTOURAGE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deleteData),
    })

    if (!response.ok) {
      throw new Error('Failed to delete entourage member')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error deleting entourage member:', error)
    return NextResponse.json(
      { error: 'Failed to delete entourage member' },
      { status: 500 }
    )
  }
}