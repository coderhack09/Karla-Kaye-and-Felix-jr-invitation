import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for RSVPs
const rsvps: Array<{
  id: string
  fullName: string
  email: string
  phone: string
  attending: string
  guests: string
  mealPreference: string
  message: string
  timestamp: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, phone, attending, guests, mealPreference, message } = body

    // Validation
    if (!fullName || !email || !attending) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const newRSVP = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      attending,
      guests,
      mealPreference,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    }

    rsvps.push(newRSVP)

    return NextResponse.json(newRSVP, { status: 201 })
  } catch (error) {
    console.error("Error processing RSVP:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(rsvps)
}
