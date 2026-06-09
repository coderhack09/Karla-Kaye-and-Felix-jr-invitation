import { siteConfig } from "@/content/site"
import { type NextRequest, NextResponse } from "next/server"

// You'll need to replace this with your GuestWish Google Apps Script URL
const GUEST_WISH_SCRIPT_URL = siteConfig.googleAPI.guestRequest

// Guest Request interface for WishGuest sheet
export interface GuestRequest {
  Name: string
  Email: string
  Phone: string
  RSVP: string
  Guest: string
  Message: string
}

// GET: Fetch all guest requests
export async function GET() {
  try {
    console.log('Fetching guest requests from:', GUEST_WISH_SCRIPT_URL)
    
    const response = await fetch(GUEST_WISH_SCRIPT_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch from Google Script:', response.status, response.statusText)
      throw new Error('Failed to fetch guest requests')
    }

    const data = await response.json()
    console.log('Raw data from Google Script:', data)

    // Helper to safely coerce any value to a trimmed string
    const safeString = (value: any): string => {
      if (value === null || value === undefined) return ''
      if (typeof value === 'number') return String(value)
      if (typeof value === 'string') return value.trim()
      return String(value).trim()
    }

    // Normalize data - ensure consistent keys and Guest is preserved (including numbers)
    const normalizedData = Array.isArray(data)
      ? data.map((request: any) => {
          const guestRaw = request?.Guest ?? request?.guest ?? ''
          return {
            Name: safeString(request?.Name ?? request?.name),
            Email: safeString(request?.Email ?? request?.email),
            Phone: safeString(request?.Phone ?? request?.phone),
            RSVP: safeString(request?.RSVP ?? request?.rsvp),
            Guest: safeString(guestRaw),
            Message: safeString(request?.Message ?? request?.message),
          } as GuestRequest
        })
      : []
    
    console.log('Normalized guest requests:', normalizedData)
    return NextResponse.json(normalizedData, { status: 200 })
  } catch (error) {
    console.error('Error fetching guest requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guest requests', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST: Add a new guest request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { Name, Email, Phone, RSVP, Guest, Message } = body

    // Validation
    if (!Name || typeof Name !== 'string' || !Name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Email is optional, but if provided, validate format
    const emailTrimmed = Email?.trim() || ''
    if (emailTrimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const requestData = {
      Name: Name.trim(),
      Email: emailTrimmed || 'Pending', // Default to 'Pending' if not provided
      Phone: Phone?.trim() || '',
      RSVP: RSVP?.trim() || '',
      Guest: Guest?.trim() || '',
      Message: Message?.trim() || '',
    }

    const response = await fetch(GUEST_WISH_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error('Failed to submit guest request')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error adding guest request:', error)
    return NextResponse.json(
      { error: 'Failed to submit guest request' },
      { status: 500 }
    )
  }
}

// PUT: Update an existing guest request
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { Name, Email, Phone, RSVP, Guest, Message } = body

    // Validation
    if (!Name || typeof Name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const updateData = {
      action: 'update',
      Name: Name.trim(),
      Email: Email?.trim() || 'Pending',
      Phone: Phone?.trim() || '',
      RSVP: RSVP?.trim() || '',
      Guest: Guest?.trim() || '',
      Message: Message?.trim() || '',
    }

    const response = await fetch(GUEST_WISH_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error('Failed to update guest request')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error updating guest request:', error)
    return NextResponse.json(
      { error: 'Failed to update guest request' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a guest request
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

    const response = await fetch(GUEST_WISH_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deleteData),
    })

    if (!response.ok) {
      throw new Error('Failed to delete guest request')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error deleting guest request:', error)
    return NextResponse.json(
      { error: 'Failed to delete guest request' },
      { status: 500 }
    )
  }
}