/**
 * Wedding Details API Client
 * Interfaces with Google Apps Script for wedding details management
 */

const API_URL = process.env.NEXT_PUBLIC_WEDDING_API_URL || ''

export interface WeddingDetailsData {
  couple: {
    bride: string
    brideNickname: string
    groom: string
    groomNickname: string
  }
  wedding: {
    date: string
    venue: string
    tagline: string
  }
  ceremony: {
    venue: string
    address: string
    time: string
    googleMapsUrl: string
  }
  reception: {
    venue: string
    address: string
    time: string
    googleMapsUrl: string
  }
  narratives: {
    bride: string
    groom: string
    shared: string
  }
  dressCode: {
    theme: string
    note: string
  }
  contact: {
    bridePhone: string
    groomPhone: string
    email: string
  }
  details: {
    rsvp: {
      deadline: string
    }
  }
  theme: string
  hashtag: string
}

/**
 * Get all wedding details from Google Sheets
 */
export async function getWeddingDetails(): Promise<WeddingDetailsData> {
  try {
    const response = await fetch(`${API_URL}?action=get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch wedding details')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching wedding details:', error)
    throw error
  }
}

/**
 * Get a specific wedding detail by key
 */
export async function getWeddingDetail(key: string): Promise<{
  key: string
  value: string
  lastUpdated: string
} | null> {
  try {
    const response = await fetch(`${API_URL}?action=getDetail&key=${encodeURIComponent(key)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch wedding detail')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching wedding detail:', error)
    throw error
  }
}

/**
 * Update wedding details in Google Sheets
 */
export async function updateWeddingDetails(
  updates: Partial<WeddingDetailsData>
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update',
        updates,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update wedding details')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error updating wedding details:', error)
    throw error
  }
}

/**
 * Initialize wedding details with default values
 */
export async function initializeWeddingDetails(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_URL}?action=initialize`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to initialize wedding details')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error initializing wedding details:', error)
    throw error
  }
}

/**
 * Check if API is configured
 */
export function isAPIConfigured(): boolean {
  return !!API_URL && API_URL !== ''
}

/**
 * Get API URL (for debugging)
 */
export function getAPIUrl(): string {
  return API_URL
}


