import { siteConfig } from "@/content/site"
import { type NextRequest, NextResponse } from "next/server"

// ⚠️ IMPORTANT: Replace this with your NEW Google Apps Script deployment URL
// This should be the URL from deploying google-apps-script/guest-management.js
const GOOGLE_SCRIPT_URL = siteConfig.googleAPI.guestList

// New Guest interface matching the improved system
export interface Guest {
  id: string | number  // Support both UUID strings and numeric IDs
  name: string
  role: string
  email?: string
  contact?: string
  message?: string
  allowedGuests: number
  companions: { name: string; relationship: string }[]
  tableNumber: string
  isVip: boolean
  status: 'pending' | 'confirmed' | 'declined' | 'request'
  addedBy?: string
  createdAt?: string
  updatedAt?: string
}

// Legacy interface for backward compatibility
export interface LegacyGuest {
  Name: string
  Email: string
  RSVP: string
  Guest: string
  Message: string
}

// GET: Fetch all guests from Google Sheets
export async function GET() {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch guests')
    }

    const data = await response.json()
    
    // Handle error response from Google Apps Script
    if (data.error) {
      throw new Error(data.error)
    }

    // Normalize guest data to ensure consistent format
    const normalizedData = Array.isArray(data) ? data.map((guest: any) => ({
      ...guest,
      id: String(guest.id), // Convert numeric IDs to strings for consistency
      role: guest.role || 'Guest',
      email: guest.email || '',
      contact: guest.contact || '',
      message: guest.message || '',
      allowedGuests: parseInt(guest.allowedGuests) || 1,
      companions: Array.isArray(guest.companions) ? guest.companions : [],
      tableNumber: guest.tableNumber || '',
      isVip: guest.isVip === true || guest.isVip === 'TRUE',
      status: guest.status || 'pending',
      addedBy: guest.addedBy || '',
      createdAt: guest.createdAt || new Date().toISOString(),
      updatedAt: guest.updatedAt || new Date().toISOString(),
    })) : []

    return NextResponse.json(normalizedData, { status: 200 })
  } catch (error) {
    console.error('Error fetching guests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    )
  }
}

// POST: Add a new guest
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation - Only Full Name and Attendance/RSVP Status are required
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Full Name is required' },
        { status: 400 }
      )
    }

    if (!body.status || typeof body.status !== 'string') {
      return NextResponse.json(
        { error: 'Attendance/RSVP Status is required' },
        { status: 400 }
      )
    }

    // Validate status is one of the allowed values
    const validStatuses = ['pending', 'confirmed', 'declined', 'request'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid RSVP status. Must be one of: pending, confirmed, declined, request' },
        { status: 400 }
      )
    }

    const guestData = {
      action: 'create',
      name: body.name.trim(),
      role: body.role?.trim() || 'Guest', // Optional - defaults to 'Guest'
      email: body.email?.trim() || '',
      contact: body.contact?.trim() || '',
      message: body.message?.trim() || '',
      allowedGuests: parseInt(body.allowedGuests) || 1,
      companions: body.companions || [],
      tableNumber: body.tableNumber?.trim() || '',
      isVip: body.isVip === true,
      status: body.status, // Required field
      addedBy: body.addedBy?.trim() || '',
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guestData),
    })

    if (!response.ok) {
      throw new Error('Failed to add guest')
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error adding guest:', error)
    return NextResponse.json(
      { error: 'Failed to add guest' },
      { status: 500 }
    )
  }
}

// PUT: Update an existing guest
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    if (!body.id || typeof body.id !== 'string') {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      )
    }

    const updateData = {
      action: 'update',
      id: body.id,
      ...body
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error('Failed to update guest')
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error('Error updating guest:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update guest' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a guest
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    if (!body.id || typeof body.id !== 'string') {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      )
    }

    const deleteData = {
      action: 'delete',
      id: body.id,
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deleteData),
    })

    if (!response.ok) {
      throw new Error('Failed to delete guest')
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error deleting guest:', error)
    return NextResponse.json(
      { error: 'Failed to delete guest' },
      { status: 500 }
    )
  }
}

