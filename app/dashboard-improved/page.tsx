"use client"

/**
 * Example Dashboard Page with Improved Guest List
 * 
 * This is a complete example showing how to integrate the ImprovedGuestList component
 * into your wedding website dashboard.
 * 
 * To use this:
 * 1. Set up the Google Apps Script (see GUEST_MANAGEMENT_SETUP.md)
 * 2. Update the API_URL below with your deployment URL
 * 3. Navigate to /dashboard-improved to see it in action
 */

import { useState, useEffect } from "react"
import { ImprovedGuestList, Guest } from "@/components/improved-guest-list"
import { Button } from "@/components/ui/button"
import {
  Lock,
  LogOut,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  Download,
  Upload,
} from "lucide-react"

// ⚠️ IMPORTANT: Replace this with your actual Google Apps Script Web App URL
const API_URL = process.env.NEXT_PUBLIC_GUEST_API_URL || 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'

export default function ImprovedDashboardPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState<string | null>(null)

  // Guest data state
  const [guests, setGuests] = useState<Guest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Dashboard password - CHANGE THIS!
  const DASHBOARD_PASSWORD = "wedding2025" // ⚠️ Change this to your preferred password

  // Check if already authenticated
  useEffect(() => {
    const authStatus = sessionStorage.getItem("dashboardAuth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      fetchGuests()
    }
  }, [])

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null)
        setSuccessMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, successMessage])

  /**
   * Fetch all guests from the API
   */
  const fetchGuests = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Handle error response from Google Apps Script
      if (data.error) {
        throw new Error(data.error)
      }

      setGuests(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error("Error fetching guests:", err)
      setError(`Failed to load guests: ${err.message}`)
      
      // Show helpful message if API_URL is not configured
      if (API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        setError('Please configure your Google Apps Script URL in the API_URL constant')
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Add a new guest
   */
  const handleAddGuest = async (guestData: Omit<Guest, 'id'>) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          ...guestData,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setSuccessMessage(`✓ ${guestData.name} added successfully!`)
      await fetchGuests() // Refresh the list
    } catch (err: any) {
      console.error("Error adding guest:", err)
      setError(`Failed to add guest: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Update an existing guest
   */
  const handleUpdateGuest = async (guest: Guest) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          ...guest,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setSuccessMessage(`✓ ${guest.name} updated successfully!`)
      await fetchGuests() // Refresh the list
    } catch (err: any) {
      console.error("Error updating guest:", err)
      setError(`Failed to update guest: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Delete a guest
   */
  const handleDeleteGuest = async (id: string) => {
    const guestToDelete = guests.find(g => g.id === id)
    
    if (!confirm(`Are you sure you want to delete ${guestToDelete?.name || 'this guest'}?`)) {
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          id: id,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setSuccessMessage(`✓ Guest deleted successfully!`)
      await fetchGuests() // Refresh the list
    } catch (err: any) {
      console.error("Error deleting guest:", err)
      setError(`Failed to delete guest: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle login
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === DASHBOARD_PASSWORD) {
      setIsAuthenticated(true)
      setAuthError(null)
      sessionStorage.setItem("dashboardAuth", "true")
      fetchGuests()
    } else {
      setAuthError("Incorrect password. Please try again.")
      setPassword("")
    }
  }

  /**
   * Handle logout
   */
  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("dashboardAuth")
    setPassword("")
    setGuests([])
  }

  /**
   * Handle bulk import from CSV
   */
  const handleBulkImport = async (file: File) => {
    // This is a placeholder - implement CSV parsing as needed
    setError("Bulk import feature coming soon!")
  }

  // ========================================
  // LOGIN SCREEN
  // ========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5F5F0] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#E5E7EB]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8B6F47] to-[#6B5335] rounded-2xl mb-4 shadow-lg">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#111827] mb-2">
                Guest Management Dashboard
              </h1>
              <p className="text-[#6B7280] text-sm">
                Enter password to access the improved guest list
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#A67C52] focus:border-transparent outline-none transition-all"
                  placeholder="Enter password"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8B6F47] to-[#6B5335] hover:from-[#6B5335] hover:to-[#8B6F47] text-white py-6 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                Access Dashboard
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> This is the improved guest management system with companion tracking and VIP features.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ========================================
  // MAIN DASHBOARD
  // ========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5F5F0]">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#6E4C3A]">
                Guest Management Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Improved system with companion tracking and VIP features
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={fetchGuests}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="border-[#E5E7EB] text-[#6B7280] hover:text-[#6B4423] hover:border-[#A67C52]"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleLogout}
                size="sm"
                variant="outline"
                className="border-[#E5E7EB] text-[#6B7280] hover:text-red-600 hover:border-red-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 animate-in slide-in-from-top-2">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="hover:opacity-70">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="hover:opacity-70">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* API Configuration Warning */}
        {API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' && (
          <div className="mb-6 p-6 bg-amber-50 border-2 border-amber-300 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-900 mb-2">Configuration Required</h3>
                <p className="text-sm text-amber-800 mb-3">
                  Please update the <code className="bg-amber-100 px-2 py-1 rounded">API_URL</code> constant 
                  in this file with your Google Apps Script Web App URL.
                </p>
                <ol className="text-sm text-amber-800 space-y-1 ml-4 list-decimal">
                  <li>Deploy the Google Apps Script (see GUEST_MANAGEMENT_SETUP.md)</li>
                  <li>Copy the Web App URL from the deployment</li>
                  <li>Replace the API_URL in this file</li>
                  <li>Refresh the page</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Guest List Component */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E5DACE] p-6">
          {isLoading && guests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="h-12 w-12 text-[#8C6B4F] animate-spin mb-4" />
              <p className="text-gray-500">Loading guests...</p>
            </div>
          ) : (
            <ImprovedGuestList
              guests={guests}
              onAddGuest={handleAddGuest}
              onUpdateGuest={handleUpdateGuest}
              onDeleteGuest={handleDeleteGuest}
            />
          )}
        </div>
      </div>
    </div>
  )
}


