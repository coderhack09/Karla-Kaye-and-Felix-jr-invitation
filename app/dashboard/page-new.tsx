"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Lock,
  Users,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  Plus,
  AlertCircle,
  Bell,
  UserCheck,
  Crown,
  UserPlus,
  LogOut,
  X,
} from "lucide-react"
import { siteConfig } from "@/content/site"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"

interface Guest {
  Name: string
  Email: string
  RSVP: string
  Guest: string
  Message: string
}

interface GuestRequest {
  Name: string
  Email: string
  Phone: string
  RSVP: string
  Guest: string
  Message: string
}

interface Entourage {
  Name: string
  RoleCategory: string
  RoleTitle: string
  Email: string
}

interface PrincipalSponsor {
  MalePrincipalSponsor: string
  FemalePrincipalSponsor: string
}

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAddGuestModal, setShowAddGuestModal] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"dashboard" | "guests" | "requests" | "messages" | "entourage" | "details">("dashboard")
  
  // Guest Request state
  const [guestRequests, setGuestRequests] = useState<GuestRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<GuestRequest[]>([])
  const [searchRequestQuery, setSearchRequestQuery] = useState("")
  const [editingRequest, setEditingRequest] = useState<GuestRequest | null>(null)
  const [showAddToGuestListModal, setShowAddToGuestListModal] = useState(false)
  const [requestToAdd, setRequestToAdd] = useState<GuestRequest | null>(null)

  // Entourage state
  const [entourage, setEntourage] = useState<Entourage[]>([])
  const [filteredEntourage, setFilteredEntourage] = useState<Entourage[]>([])
  const [searchEntourageQuery, setSearchEntourageQuery] = useState("")
  const [editingEntourage, setEditingEntourage] = useState<Entourage | null>(null)
  const [showEntourageForm, setShowEntourageForm] = useState(false)
  const [showEntourageModal, setShowEntourageModal] = useState(false)

  // Shared confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState<string>("")
  const [confirmMessage, setConfirmMessage] = useState<string>("")
  const confirmActionRef = useRef<null | (() => Promise<void> | void)>(null)

  // PrincipalSponsor state
  const [principalSponsors, setPrincipalSponsors] = useState<PrincipalSponsor[]>([])
  const [filteredPrincipalSponsors, setFilteredPrincipalSponsors] = useState<PrincipalSponsor[]>([])
  const [searchPrincipalSponsorQuery, setSearchPrincipalSponsorQuery] = useState("")
  const [editingPrincipalSponsor, setEditingPrincipalSponsor] = useState<PrincipalSponsor | null>(null)
  const [showPrincipalSponsorForm, setShowPrincipalSponsorForm] = useState(false)
  const [showPrincipalSponsorModal, setShowPrincipalSponsorModal] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    RSVP: "",
    Guest: "",
    Message: "",
  })
  
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Request form state
  const [requestFormData, setRequestFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    RSVP: "",
    Guest: "",
    Message: "",
  })

  // Entourage form state
  const [entourageFormData, setEntourageFormData] = useState({
    Name: "",
    RoleCategory: "",
    RoleTitle: "",
    Email: "",
  })

  // PrincipalSponsor form state
  const [principalSponsorFormData, setPrincipalSponsorFormData] = useState({
    MalePrincipalSponsor: "",
    FemalePrincipalSponsor: "",
  })

  // Password - you can change this!
  const DASHBOARD_PASSWORD = "2026" // Change this to your preferred password

  // Check if already authenticated
  useEffect(() => {
    const authStatus = sessionStorage.getItem("dashboardAuth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      fetchGuests()
      fetchGuestRequests()
      fetchEntourage()
      fetchPrincipalSponsors()
    }
  }, [])

  // Filter guests based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGuests(guests)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = guests.filter((guest) =>
      guest.Name.toLowerCase().includes(query) ||
      (guest.Email && guest.Email.toLowerCase().includes(query))
    )

    setFilteredGuests(filtered)
  }, [searchQuery, guests])

  // Filter guest requests based on search
  useEffect(() => {
    if (!searchRequestQuery.trim()) {
      setFilteredRequests(guestRequests)
      return
    }

    const query = searchRequestQuery.toLowerCase()
    const filtered = guestRequests.filter((request) =>
      request.Name.toLowerCase().includes(query) ||
      (request.Email && request.Email.toLowerCase().includes(query))
    )

    setFilteredRequests(filtered)
  }, [searchRequestQuery, guestRequests])

  // Filter entourage based on search
  useEffect(() => {
    if (!searchEntourageQuery.trim()) {
      setFilteredEntourage(entourage)
      return
    }

    const query = searchEntourageQuery.toLowerCase()
    const filtered = entourage.filter((member) =>
      member.Name.toLowerCase().includes(query) ||
      member.RoleTitle.toLowerCase().includes(query) ||
      member.RoleCategory.toLowerCase().includes(query) ||
      (member.Email && member.Email.toLowerCase().includes(query))
    )

    setFilteredEntourage(filtered)
  }, [searchEntourageQuery, entourage])

  // Filter principal sponsors based on search
  useEffect(() => {
    if (!searchPrincipalSponsorQuery.trim()) {
      setFilteredPrincipalSponsors(principalSponsors)
      return
    }

    const query = searchPrincipalSponsorQuery.toLowerCase()
    const filtered = principalSponsors.filter((sponsor) =>
      sponsor.MalePrincipalSponsor.toLowerCase().includes(query) ||
      sponsor.FemalePrincipalSponsor.toLowerCase().includes(query)
    )

    setFilteredPrincipalSponsors(filtered)
  }, [searchPrincipalSponsorQuery, principalSponsors])

  const fetchGuests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/guests")
      if (!response.ok) {
        throw new Error("Failed to fetch guests")
      }
      const data = await response.json()
      
      // Ensure Guest field exists for all guests
      const normalizedGuests = Array.isArray(data) ? data.map((guest: Guest) => ({
        ...guest,
        Guest: guest.Guest || '1', // Default to 1 if missing
      })) : []
      
      setGuests(normalizedGuests)
      setFilteredGuests(normalizedGuests)
    } catch (error) {
      console.error("Error fetching guests:", error)
      setError("Failed to load guest list")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGuestRequests = async () => {
    try {
      const response = await fetch("/api/guest-requests")
      if (!response.ok) {
        throw new Error("Failed to fetch guest requests")
      }
      const data = await response.json()
      setGuestRequests(data)
      setFilteredRequests(data)
    } catch (error) {
      console.error("Error fetching guest requests:", error)
    }
  }

  const fetchEntourage = async () => {
    try {
      const response = await fetch("/api/entourage")
      if (!response.ok) {
        throw new Error("Failed to fetch entourage")
      }
      const data = await response.json()
      setEntourage(data)
      setFilteredEntourage(data)
    } catch (error) {
      console.error("Error fetching entourage:", error)
    }
  }

  const fetchPrincipalSponsors = async () => {
    try {
      const response = await fetch("/api/principal-sponsors")
      if (!response.ok) {
        throw new Error("Failed to fetch principal sponsors")
      }
      const data = await response.json()
      setPrincipalSponsors(data)
      setFilteredPrincipalSponsors(data)
    } catch (error) {
      console.error("Error fetching principal sponsors:", error)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === DASHBOARD_PASSWORD) {
      setIsAuthenticated(true)
      setError(null)
      sessionStorage.setItem("dashboardAuth", "true")
      fetchGuests()
      fetchGuestRequests()
      fetchEntourage()
      fetchPrincipalSponsors()
    } else {
      setError("Incorrect password. Please try again.")
      setPassword("")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("dashboardAuth")
    setPassword("")
    setGuests([])
    setFilteredGuests([])
  }

  const handleSyncSpreadsheet = () => {
    fetchGuests()
    fetchGuestRequests()
    fetchEntourage()
    fetchPrincipalSponsors()
  }

  const getRSVPStats = () => {
    const attending = guests.filter((g) => g.RSVP === "Yes").length
    const notAttending = guests.filter((g) => g.RSVP === "No").length
    const pending = guests.filter((g) => !g.RSVP || g.RSVP.trim() === "").length
    // Calculate total guests by summing the Guest column (number of guests per entry)
    const totalGuests = guests.reduce((sum, guest) => {
      const guestCount = parseInt(guest.Guest) || 1 // Default to 1 if empty or invalid
      return sum + guestCount
    }, 0)
    return { attending, notAttending, pending, total: guests.length, totalGuests }
  }

  const stats = getRSVPStats()

  // Count messages (guests with messages)
  const messageCount = guests.filter(g => g.Message && g.Message.trim()).length

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5F5F0] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#E5E7EB]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8B6F47] to-[#6B5335] rounded-2xl mb-4 shadow-lg">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <div className="mb-2">
                <span className="font-serif text-sm text-[#A67C52]">♥</span>
                <span className="font-serif text-2xl font-bold text-[#6B4423] mx-2">Wedding Invitation</span>
                <span className="font-serif text-sm text-[#A67C52]">♥</span>
              </div>
              <h1 className="text-2xl font-bold text-[#111827] mb-2">
                Admin Dashboard
              </h1>
              <p className="text-[#6B7280] text-sm">
                Enter password to access the wedding management panel
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

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8B6F47] to-[#6B5335] hover:from-[#6B5335] hover:to-[#8B6F47] text-white py-6 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                Access Dashboard
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Main Dashboard Layout
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        guestRequestCount={guestRequests.length}
        messageCount={messageCount}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm text-[#6B7280] font-medium">Welcome back,</h2>
              <h1 className="text-xl font-bold text-[#111827]">
                {siteConfig.couple.groomNickname} & {siteConfig.couple.brideNickname}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSyncSpreadsheet}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="border-[#E5E7EB] text-[#6B7280] hover:text-[#6B4423] hover:border-[#A67C52]"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
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

        {/* Content Area */}
        <div className="p-8">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage(null)} className="ml-auto">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "dashboard" && (
            <DashboardOverview
              stats={{
                guestGroups: stats.total,
                confirmedPax: stats.totalGuests,
                pendingRSVP: stats.pending,
                joinRequests: guestRequests.length,
              }}
            />
          )}

          {activeTab === "guests" && (
            <div>
              <h2 className="text-2xl font-bold text-[#111827] mb-6">Guest List Management</h2>
              <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                <p className="text-[#6B7280]">Guest list management interface will be displayed here.</p>
                <p className="text-sm text-[#9CA3AF] mt-2">Total Guests: {stats.total} | Confirmed: {stats.attending} | Pending: {stats.pending}</p>
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div>
              <h2 className="text-2xl font-bold text-[#111827] mb-6">Join Requests</h2>
              <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                <p className="text-[#6B7280]">Guest join requests will be displayed here.</p>
                <p className="text-sm text-[#9CA3AF] mt-2">Total Requests: {guestRequests.length}</p>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <h2 className="text-2xl font-bold text-[#111827] mb-6">Guest Messages</h2>
              <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                <p className="text-[#6B7280]">Guest messages will be displayed here.</p>
                <p className="text-sm text-[#9CA3AF] mt-2">Total Messages: {messageCount}</p>
              </div>
            </div>
          )}

          {activeTab === "entourage" && (
            <div>
              <h2 className="text-2xl font-bold text-[#111827] mb-6">Entourage & Sponsors</h2>
              <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                <p className="text-[#6B7280]">Entourage and principal sponsors management will be displayed here.</p>
                <p className="text-sm text-[#9CA3AF] mt-2">Entourage: {entourage.length} | Principal Sponsors: {principalSponsors.length}</p>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div>
              <h2 className="text-2xl font-bold text-[#111827] mb-6">Wedding Details</h2>
              <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                <p className="text-[#6B7280]">Wedding details and configuration will be displayed here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

