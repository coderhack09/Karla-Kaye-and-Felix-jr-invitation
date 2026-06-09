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
} from "lucide-react"
import { siteConfig } from "@/content/site"

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
  const [activeTab, setActiveTab] = useState<"guests" | "requests" | "entourage" | "principalsponsor">("guests")
  
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
  const DASHBOARD_PASSWORD = "2025" // Change this to your preferred password

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

  const handleAddGuest = async () => {
    if (!formData.Name || !formData.Name.trim()) {
      setError("Name is required")
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: formData.Name.trim(),
          Email: "", // Empty - guest will fill this in
          RSVP: "", // Empty - guest will fill this in
          Guest: "", // Empty - guest will fill this in
          Message: "", // Empty - guest will fill this in
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add guest")
      }

      setSuccessMessage("Guest added successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      setFormData({ Name: "", Email: "", RSVP: "", Guest: "", Message: "" })
      setShowAddGuestModal(false)
      await fetchGuests()
    } catch (error) {
      console.error("Error adding guest:", error)
      setError("Failed to add guest")
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateGuest = async () => {
    if (!editingGuest || !formData.Name) {
      setError("Name is required")
      setTimeout(() => setError(null), 3000)
      return
    }
    if (!formData.RSVP) {
      setError("RSVP status is required")
      setTimeout(() => setError(null), 3000)
      return
    }
    if (!formData.Guest || parseInt(formData.Guest) < 1) {
      setError("Number of guests must be at least 1")
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Use the original guest name for lookup in Google Sheets
      // The Google Apps Script searches by originalName (if provided) or Name
      const originalName = String(editingGuest.Name || '').trim()
      const newName = String(formData.Name || '').trim()
      const nameChanged = originalName !== newName

      // Safely convert all values to strings
      const updatePayload = {
        originalName: originalName, // Original name for lookup
        Name: newName, // New name to update to (if changed)
        Email: String(formData.Email || '').trim() || "Pending",
        RSVP: String(formData.RSVP || '').trim(),
        Guest: String(formData.Guest || '').trim() || "1",
        Message: String(formData.Message || '').trim(),
      }

      const response = await fetch("/api/guests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      })

      // Get response text first to handle both JSON and non-JSON responses
      const responseText = await response.text()
      let data
      
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse response:", parseError)
        console.error("Response text:", responseText)
        throw new Error(`Server returned an invalid response. Status: ${response.status}`)
      }

      // Check if response indicates an error
      if (!response.ok || data.error) {
        const errorMessage = data.error || data.details || `Failed to update guest. Status: ${response.status}`
        console.error("Update error response:", data, "Status:", response.status)
        throw new Error(errorMessage)
      }

      // Show appropriate success message
      if (nameChanged) {
        setSuccessMessage(`Guest updated successfully! Name changed from "${originalName}" to "${newName}".`)
      } else {
        setSuccessMessage("Guest updated successfully!")
      }
      
      setTimeout(() => setSuccessMessage(null), 5000)
      setEditingGuest(null)
      setEditModalOpen(false)
      setFormData({ Name: "", Email: "", RSVP: "", Guest: "", Message: "" })
      await fetchGuests()
    } catch (error: any) {
      console.error("Error updating guest:", error)
      const errorMessage = error?.message || "Failed to update guest. Please check the console for details."
      setError(errorMessage)
      setTimeout(() => setError(null), 7000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGuest = async (guestName: string) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/guests", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Name: guestName }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete guest")
      }

      setSuccessMessage("Guest deleted successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      await fetchGuests()
    } catch (error) {
      console.error("Error deleting guest:", error)
      setError("Failed to delete guest")
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (guest: Guest) => {
    setEditingGuest(guest)
    setFormData({
      Name: guest.Name,
      Email: guest.Email && guest.Email !== "Pending" ? guest.Email : "",
      RSVP: guest.RSVP || "",
      Guest: guest.Guest || "1",
      Message: guest.Message || "",
    })
    setShowAddForm(false)
    setEditModalOpen(true)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setShowAddGuestModal(false)
    setEditingGuest(null)
    setEditModalOpen(false)
    setFormData({ Name: "", Email: "", RSVP: "", Guest: "", Message: "" })
  }

  const handleAddRequestToGuestListClick = (request: GuestRequest) => {
    setRequestToAdd(request)
    setShowAddToGuestListModal(true)
  }

  const handleConfirmAddToGuestList = async () => {
    if (!requestToAdd) return

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
    setShowAddToGuestListModal(false)

    try {
      // Add to guest list with Message empty and RSVP empty (pending)
      const addResponse = await fetch("/api/guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: requestToAdd.Name,
          Email: requestToAdd.Email,
          RSVP: "", // Pending
          Guest: requestToAdd.Guest || "1",
          Message: "", // Reset message to empty
        }),
      })

      if (!addResponse.ok) {
        throw new Error("Failed to add to guest list")
      }

      // Delete from requests
      const deleteResponse = await fetch("/api/guest-requests", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Name: requestToAdd.Name }),
      })

      if (!deleteResponse.ok) {
        throw new Error("Failed to remove from requests")
      }

      setSuccessMessage(`${requestToAdd.Name} added to guest list!`)
      setTimeout(() => setSuccessMessage(null), 3000)
      setRequestToAdd(null)
      await fetchGuests()
      await fetchGuestRequests()
    } catch (error) {
      console.error("Error adding request to guest list:", error)
      setError("Failed to add request to guest list")
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelAddToGuestList = () => {
    setShowAddToGuestListModal(false)
    setRequestToAdd(null)
  }

  const handleEditRequestClick = (request: GuestRequest) => {
    setEditingRequest(request)
    setRequestFormData({
      Name: request.Name,
      Email: request.Email && request.Email !== "Pending" ? request.Email : "",
      Phone: request.Phone || "",
      RSVP: request.RSVP || "",
      Guest: request.Guest || "1",
      Message: request.Message || "",
    })
  }

  const handleUpdateRequest = async () => {
    if (!editingRequest || !requestFormData.Name) {
      setError("Name is required")
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/guest-requests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: requestFormData.Name,
          Email: requestFormData.Email,
          Phone: requestFormData.Phone,
          RSVP: requestFormData.RSVP,
          Guest: requestFormData.Guest,
          Message: requestFormData.Message,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update request")
      }

      setSuccessMessage("Request updated successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      setEditingRequest(null)
      setRequestFormData({ Name: "", Email: "", Phone: "", RSVP: "", Guest: "", Message: "" })
      await fetchGuestRequests()
    } catch (error) {
      console.error("Error updating request:", error)
      setError("Failed to update request")
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEditRequest = () => {
    setEditingRequest(null)
    setRequestFormData({ Name: "", Email: "", Phone: "", RSVP: "", Guest: "", Message: "" })
  }

  const handleDeleteRequest = async (requestName: string) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/guest-requests", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Name: requestName }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete request")
      }

      setSuccessMessage("Request deleted successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      await fetchGuestRequests()
    } catch (error) {
      console.error("Error deleting request:", error)
      setError("Failed to delete request")
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }


  // Entourage CRUD handlers
  const handleAddEntourage = async () => {
    if (!entourageFormData.Name) {
      setError("Name is required")
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/entourage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: entourageFormData.Name,
          RoleCategory: entourageFormData.RoleCategory,
          RoleTitle: entourageFormData.RoleTitle,
          Email: entourageFormData.Email,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add entourage member")
      }

      setSuccessMessage("Entourage member added successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      setShowEntourageForm(false)
      setShowEntourageModal(false)
      setEntourageFormData({ Name: "", RoleCategory: "", RoleTitle: "", Email: "" })
      await fetchEntourage()
      window.dispatchEvent(new Event("entourageUpdated"))
    } catch (error) {
      console.error("Error adding entourage member:", error)
      setError("Failed to add entourage member")
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateEntourage = async () => {
    if (!editingEntourage || !entourageFormData.Name) {
      setError("Name is required")
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/entourage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update",
          originalName: editingEntourage.Name, // Original name for lookup
          Name: entourageFormData.Name,
          RoleCategory: entourageFormData.RoleCategory,
          RoleTitle: entourageFormData.RoleTitle,
          Email: entourageFormData.Email,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update entourage member")
      }

      setSuccessMessage("Entourage member updated successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      setShowEntourageForm(false)
      setShowEntourageModal(false)
      setEditingEntourage(null)
      setEntourageFormData({ Name: "", RoleCategory: "", RoleTitle: "", Email: "" })
      await fetchEntourage()
      window.dispatchEvent(new Event("entourageUpdated"))
    } catch (error) {
      console.error("Error updating entourage member:", error)
      setError("Failed to update entourage member")
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEntourage = async (memberName: string) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/entourage", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Name: memberName }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete entourage member")
      }

      setSuccessMessage("Entourage member deleted successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      await fetchEntourage()
      window.dispatchEvent(new Event("entourageUpdated"))
    } catch (error) {
      console.error("Error deleting entourage member:", error)
      setError("Failed to delete entourage member")
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditEntourageClick = (member: Entourage) => {
    setEditingEntourage(member)
    setEntourageFormData({
      Name: member.Name,
      RoleCategory: member.RoleCategory || "",
      RoleTitle: member.RoleTitle || "",
      Email: member.Email && member.Email !== "Pending" ? member.Email : "",
    })
    setShowEntourageModal(true)
  }

  const handleCancelEntourage = () => {
    setShowEntourageForm(false)
    setShowEntourageModal(false)
    setEditingEntourage(null)
    setEntourageFormData({ Name: "", RoleCategory: "", RoleTitle: "", Email: "" })
  }

  // PrincipalSponsor functions
  const fetchPrincipalSponsors = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/principal-sponsor")
      if (!response.ok) {
        throw new Error("Failed to fetch principal sponsors")
      }
      const data = await response.json()
      setPrincipalSponsors(data)
    } catch (error) {
      console.error("Error fetching principal sponsors:", error)
      setError("Failed to fetch principal sponsors")
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPrincipalSponsor = async () => {
    if (!principalSponsorFormData.MalePrincipalSponsor) {
      setError("Male Principal Sponsor is required")
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/principal-sponsor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(principalSponsorFormData),
      })

      if (!response.ok) {
        throw new Error("Failed to add principal sponsor")
      }

      setSuccessMessage("Principal sponsor added successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      setShowPrincipalSponsorModal(false)
      setShowPrincipalSponsorForm(false)
      setPrincipalSponsorFormData({ MalePrincipalSponsor: "", FemalePrincipalSponsor: "" })
      await fetchPrincipalSponsors()
    } catch (error) {
      console.error("Error adding principal sponsor:", error)
      setError("Failed to add principal sponsor")
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePrincipalSponsor = async () => {
    if (!editingPrincipalSponsor || !principalSponsorFormData.MalePrincipalSponsor) {
      setError("Male Principal Sponsor is required")
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/principal-sponsor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalName: editingPrincipalSponsor.MalePrincipalSponsor,
          MalePrincipalSponsor: principalSponsorFormData.MalePrincipalSponsor,
          FemalePrincipalSponsor: principalSponsorFormData.FemalePrincipalSponsor,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update principal sponsor")
      }

      setSuccessMessage("Principal sponsor updated successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      setShowPrincipalSponsorModal(false)
      setShowPrincipalSponsorForm(false)
      setEditingPrincipalSponsor(null)
      setPrincipalSponsorFormData({ MalePrincipalSponsor: "", FemalePrincipalSponsor: "" })
      await fetchPrincipalSponsors()
    } catch (error) {
      console.error("Error updating principal sponsor:", error)
      setError("Failed to update principal sponsor")
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePrincipalSponsor = async (maleName: string) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/principal-sponsor", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ MalePrincipalSponsor: maleName }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete principal sponsor")
      }

      setSuccessMessage("Principal sponsor deleted successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      await fetchPrincipalSponsors()
    } catch (error) {
      console.error("Error deleting principal sponsor:", error)
      setError("Failed to delete principal sponsor")
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditPrincipalSponsorClick = (sponsor: PrincipalSponsor) => {
    setEditingPrincipalSponsor(sponsor)
    setPrincipalSponsorFormData({
      MalePrincipalSponsor: sponsor.MalePrincipalSponsor,
      FemalePrincipalSponsor: sponsor.FemalePrincipalSponsor || "",
    })
    setShowPrincipalSponsorModal(true)
  }

  const handleCancelPrincipalSponsor = () => {
    setShowPrincipalSponsorModal(false)
    setShowPrincipalSponsorForm(false)
    setEditingPrincipalSponsor(null)
    setPrincipalSponsorFormData({ MalePrincipalSponsor: "", FemalePrincipalSponsor: "" })
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F2F5F0] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#CFE2D2]/60">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#4A7C59] rounded-full mb-3 shadow-lg">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <div className="text-xs tracking-[0.2em] uppercase font-semibold text-[#8FB99A] mb-2">
                welcome {siteConfig.couple.groomNickname} and {siteConfig.couple.brideNickname}
</div>
              <h1 className="text-3xl font-serif font-bold text-[#4A7C59] mb-2">
                Wedding Dashboard
              </h1>
              <p className="text-[#4A7C59]/70 font-sans">
                Enter password to access
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4A7C59] mb-2 font-sans">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter dashboard password"
                  className="w-full px-4 py-3 border-2 border-[#CFE2D2]/60 focus:border-[#8FB99A] rounded-xl font-sans text-black placeholder:text-[#4A7C59]/40 transition-all duration-300 focus:ring-4 focus:ring-[#8FB99A]/20 bg-white"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-[#EAF2EA] border-2 border-[#CFE2D2] rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#4A7C59]" />
                  <span className="text-[#2F3724] font-semibold text-sm">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#8FB99A] hover:bg-[#4A7C59] text-white py-3 rounded-xl font-semibold transition-colors border border-[#EAF2EA]/60 shadow-md"
              >
                Access Dashboard
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F5F0]">
      {/* Header */}
      <div className="bg-[#4A7C59] shadow-xl border-b border-[#8FB99A]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-white">Wedding Dashboard</h1>
              <p className="text-white/90 text-sm">Manage your guest list and RSVPs</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => {
                  fetchGuests()
                  fetchGuestRequests()
                  fetchEntourage()
                  fetchPrincipalSponsors()
                }}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="bg-[#8FB99A] border-[#EAF2EA]/60 text-black hover:bg-[#4A7C59]"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleLogout}
                size="sm"
                variant="outline"
                className="bg-[#8FB99A] border-[#EAF2EA]/60 text-black hover:bg-[#4A7C59]"
              >
                <Lock className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#CFE2D2]/60">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-[#4A7C59]" />
              <span className="text-2xl sm:text-3xl font-bold text-[#4A7C59]">{stats.totalGuests}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4A7C59]/80 font-sans">Total Guests</p>
            <p className="text-xs text-[#4A7C59]/60 font-sans mt-1">{stats.total} entries</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#CFE2D2]/60">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-[#4A7C59]" />
              <span className="text-2xl sm:text-3xl font-bold text-[#4A7C59]">{stats.attending}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4A7C59]/80 font-sans">Attending</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#CFE2D2]/60">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-[#8FB99A]" />
              <span className="text-2xl sm:text-3xl font-bold text-[#4A7C59]">{stats.notAttending}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4A7C59]/80 font-sans">Not Attending</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#CFE2D2]/60">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-[#C7DCCE]" />
              <span className="text-2xl sm:text-3xl font-bold text-[#4A7C59]">{stats.pending}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4A7C59]/80 font-sans">Pending</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#CFE2D2]/60">
            <div className="flex items-center justify-between mb-2">
              <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-[#8FB99A]" />
              <span className="text-2xl sm:text-3xl font-bold text-[#4A7C59]">{guestRequests.length}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4A7C59]/80 font-sans">Requests</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#CFE2D2]/60">
            <div className="flex items-center justify-between mb-2">
              <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-[#4A7C59]" />
              <span className="text-2xl sm:text-3xl font-bold text-[#4A7C59]">{entourage.length}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4A7C59]/80 font-sans">Entourage</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#CFE2D2]/60">
            <div className="flex items-center justify-between mb-2">
              <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-[#4A7C59]" />
              <span className="text-2xl sm:text-3xl font-bold text-[#4A7C59]">{principalSponsors.length}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4A7C59]/80 font-sans">Principal Sponsors</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-1 sm:p-2 shadow-md border border-[#CFE2D2]/60 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("guests")}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeTab === "guests"
                  ? "bg-[#4A7C59] text-white shadow-lg"
                  : "text-[#4A7C59] hover:bg-[#EAF2EA]"
              }`}
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Guest List
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 relative ${
                activeTab === "requests"
                  ? "bg-[#4A7C59] text-white shadow-lg"
                  : "text-[#4A7C59] hover:bg-[#EAF2EA]"
              }`}
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              Guest Requests
              {guestRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#CFE2D2] text-[#2F3724] text-[10px] sm:text-xs font-bold rounded-full min-w-[18px] h-4 sm:min-w-[20px] sm:h-5 px-1 flex items-center justify-center">
                  {guestRequests.length > 99 ? '99+' : guestRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("entourage")}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeTab === "entourage"
                  ? "bg-[#4A7C59] text-white shadow-lg"
                  : "text-[#4A7C59] hover:bg-[#EAF2EA]"
              }`}
            >
              <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
              Entourage
            </button>
            <button
              onClick={() => setActiveTab("principalsponsor")}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeTab === "principalsponsor"
                  ? "bg-[#4A7C59] text-white shadow-lg"
                  : "text-[#4A7C59] hover:bg-[#EAF2EA]"
              }`}
            >
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
              Principal Sponsors
            </button>
          </div>
        </div>

        {/* Guest List Tab Content */}
        {activeTab === "guests" && (
          <>
        {/* Search and Add Guest */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#CFE2D2]/60 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#4A7C59]/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guests by name or email..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-[#CFE2D2]/70 focus:border-[#8FB99A] rounded-xl font-sans text-black placeholder:text-[#4A7C59]/40 transition-all duration-300 focus:ring-4 focus:ring-[#8FB99A]/20 bg-white"
                />
              </div>
            </div>
            <Button
              onClick={() => {
                setShowAddGuestModal(true)
                setEditingGuest(null)
                setEditModalOpen(false)
                setFormData({ Name: "", Email: "", RSVP: "", Guest: "", Message: "" })
              }}
              className="bg-[#8FB99A] hover:bg-[#4A7C59] text-white transition-colors border border-[#EAF2EA]/60"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Guest
            </Button>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="bg-[#EAF2EA] border-2 border-[#CFE2D2] rounded-xl p-3 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#4A7C59]" />
              <span className="text-[#2F3724] font-semibold text-sm">{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="bg-[#EAF2EA] border-2 border-[#CFE2D2] rounded-xl p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#8FB99A]" />
              <span className="text-[#2F3724] font-semibold text-sm">{error}</span>
            </div>
          )}

        </div>

        {/* Guest List */}
        <div className="bg-[#F0F0EE] rounded-2xl shadow-md border border-[#F7E6CA]/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7E6CA]/60">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Email</th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">RSVP</th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-[#2F3724] font-sans whitespace-nowrap">
                    <span className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4" />
                      Guests
                    </span>
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Message</th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7E6CA]/40">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#2F3724]/60 font-sans">
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          <span>Loading guests...</span>
                        </div>
                      ) : (
                        "No guests found"
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest, index) => (
                    <tr key={index} className="hover:bg-[#F7E6CA]/20 transition-colors bg-[#FDF7EF]">
                      <td className="px-6 py-4 font-medium text-[#2F3724] font-sans">{guest.Name}</td>
                      <td className="px-6 py-4 text-[#2F3724]/70 font-sans">
                        {guest.Email && guest.Email !== "Pending" ? guest.Email : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {guest.RSVP === "Yes" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#EAF2EA] text-[#1F2418] rounded-full text-sm font-semibold border border-[#8FB99A]/70">
                            <CheckCircle className="h-4 w-4" />
                            Attending
                          </span>
                        )}
                        {guest.RSVP === "No" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F2D1C8]/60 text-[#3D2A25] rounded-full text-sm font-semibold border border-[#DBA490]/70">
                            <XCircle className="h-4 w-4" />
                            Not Attending
                          </span>
                        )}
                        {guest.RSVP === "Maybe" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#EAF2EA] text-[#2F3724] rounded-full text-sm font-semibold border border-[#CFE2D2]/80">
                            <AlertCircle className="h-4 w-4" />
                            Maybe
                          </span>
                        )}
                        {!guest.RSVP || guest.RSVP.trim() === "" ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold border border-gray-200">
                            Pending
                          </span>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#EAF2EA] text-[#2F3724] rounded-full text-sm font-bold min-w-[3.5rem] border border-[#CFE2D2]/70">
                          {guest?.Guest !== undefined && guest?.Guest !== null && guest?.Guest !== '' 
                            ? (parseInt(String(guest.Guest)) || 1) 
                            : 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#2F3724]/70 font-sans max-w-xs truncate" title={guest.Message || ""}>
                        {guest.Message || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(guest)}
                            className="p-2 text-[#3D5033] hover:bg-[#F7E6CA]/30 rounded-lg transition-colors"
                            title="Edit guest"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmTitle("Delete Guest")
                              setConfirmMessage(`Are you sure you want to delete ${guest.Name}?`)
                              confirmActionRef.current = () => handleDeleteGuest(guest.Name)
                              setConfirmOpen(true)
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete guest"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}

        {/* Guest Requests Tab Content */}
        {activeTab === "requests" && (
          <>
            {/* Search Section */}
            <div className="bg-[#F0F0EE] rounded-2xl p-6 shadow-md border border-[#F7E6CA]/60 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#2F3724]/40" />
                    <input
                      type="text"
                      value={searchRequestQuery}
                      onChange={(e) => setSearchRequestQuery(e.target.value)}
                      placeholder="Search requests by name or email..."
                      className="w-full pl-10 pr-4 py-2 border-2 border-[#F7E6CA]/50 focus:border-[#E9D5C3] rounded-xl font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Success/Error Messages */}
              {successMessage && (
                <div className="bg-[#E9D5C3]/15 border-2 border-[#E9D5C3]/60 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#3D5033]" />
                  <span className="text-[#2F3724] font-semibold text-sm">{successMessage}</span>
                </div>
              )}

              {error && (
                <div className="bg-[#E9D5C3]/15 border-2 border-[#E9D5C3]/60 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#3D5033]" />
                  <span className="text-[#2F3724] font-semibold text-sm">{error}</span>
                </div>
              )}

            </div>

            {/* Requests List */}
            <div className="bg-[#F0F0EE] rounded-2xl shadow-md border border-[#F7E6CA]/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F7E6CA]/60">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Name</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Email</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Phone</th>
                      <th className="text-center px-6 py-4 text-sm font-bold text-[#2F3724] font-sans whitespace-nowrap">
                        <span className="flex items-center justify-center gap-1">
                          <Users className="h-4 w-4" />
                          Guests
                        </span>
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Message</th>
                      <th className="text-center px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7E6CA]/40">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[#2F3724]/60 font-sans">
                          {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <RefreshCw className="h-5 w-5 animate-spin" />
                              <span>Loading requests...</span>
                            </div>
                          ) : (
                            "No guest requests found"
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((request, index) => (
                        <tr key={index} className="hover:bg-[#F7E6CA]/20 transition-colors bg-[#FDF7EF]">
                          <td className="px-6 py-4 font-medium text-[#2F3724] font-sans">{request.Name}</td>
                          <td className="px-6 py-4 text-[#2F3724]/70 font-sans">
                            {request.Email && request.Email !== "Pending" ? request.Email : "-"}
                          </td>
                          <td className="px-6 py-4 text-[#2F3724]/70 font-sans">
                            {request.Phone || "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#F7E6CA]/70 text-[#2F3724] rounded-full text-sm font-bold min-w-[3.5rem] border border-[#E9D5C3]/70">
                              {request?.Guest !== undefined && request?.Guest !== null && request?.Guest !== '' 
                                ? (parseInt(String(request.Guest)) || 1) 
                                : 1}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#2F3724]/70 font-sans max-w-xs truncate">
                            {request.Message || "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditRequestClick(request)}
                                className="p-2 text-[#3D5033] hover:bg-[#F7E6CA]/30 rounded-lg transition-colors"
                                title="Edit request"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleAddRequestToGuestListClick(request)}
                                className="px-4 py-2 bg-[#E0B4B1] hover:bg-[#A5B4A3] text-black rounded-lg transition-colors font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg border border-[#F0F0EE]/60"
                                title="Add to guest list"
                              >
                                <UserCheck className="h-4 w-4" />
                                Add to Guest List
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmTitle("Delete Request")
                                  setConfirmMessage(`Are you sure you want to delete the request from ${request.Name}?`)
                                  confirmActionRef.current = () => handleDeleteRequest(request.Name)
                                  setConfirmOpen(true)
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete request"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Entourage Tab Content */}
        {activeTab === "entourage" && (
          <>
            {/* Search Section */}
            <div className="bg-[#F0F0EE] rounded-2xl p-6 shadow-md border border-[#F7E6CA]/60 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#2F3724]/40" />
                    <input
                      type="text"
                      value={searchEntourageQuery}
                      onChange={(e) => setSearchEntourageQuery(e.target.value)}
                      placeholder="Search entourage by name, role, or email..."
                      className="w-full pl-10 pr-4 py-2 border-2 border-[#F7E6CA]/50 focus:border-[#E9D5C3] rounded-xl font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setShowEntourageForm(false)
                    setEditingEntourage(null)
                    setEntourageFormData({ Name: "", RoleCategory: "", RoleTitle: "", Email: "" })
                    setShowEntourageModal(true)
                  }}
                className="bg-[#E0B4B1] hover:bg-[#A5B4A3] text-black transition-colors border border-[#F0F0EE]/60"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>

              {/* Success/Error Messages */}
              {successMessage && (
                <div className="bg-[#E9D5C3]/15 border-2 border-[#E9D5C3]/60 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#3D5033]" />
                  <span className="text-[#2F3724] font-semibold text-sm">{successMessage}</span>
                </div>
              )}

              {error && (
                <div className="bg-[#E9D5C3]/15 border-2 border-[#E9D5C3]/60 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#3D5033]" />
                  <span className="text-[#2F3724] font-semibold text-sm">{error}</span>
                </div>
              )}

              {/* Add/Edit Entourage Modal handled below */}
            </div>

            {/* Entourage List */}
            <div className="bg-[#F0F0EE] rounded-2xl shadow-md border border-[#F7E6CA]/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F7E6CA]/60">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Name</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Role Category</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Role Title</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Email</th>
                      <th className="text-center px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7E6CA]/40">
                    {filteredEntourage.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-[#2F3724]/60 font-sans">
                          {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <RefreshCw className="h-5 w-5 animate-spin" />
                              <span>Loading entourage...</span>
                            </div>
                          ) : (
                            "No entourage members found"
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredEntourage.map((member, index) => (
                        <tr key={index} className="hover:bg-[#F7E6CA]/20 transition-colors bg-[#FDF7EF]">
                          <td className="px-6 py-4 font-medium text-[#2F3724] font-sans">{member.Name}</td>
                          <td className="px-6 py-4 text-[#2F3724]/70 font-sans">
                            {member.RoleCategory || "-"}
                          </td>
                          <td className="px-6 py-4 text-[#2F3724]/70 font-sans">
                            {member.RoleTitle || "-"}
                          </td>
                          <td className="px-6 py-4 text-[#2F3724]/70 font-sans">
                            {member.Email && member.Email !== "Pending" ? member.Email : "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditEntourageClick(member)}
                                className="p-2 text-[#3D5033] hover:bg-[#F7E6CA]/30 rounded-lg transition-colors"
                                title="Edit member"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmTitle("Delete Member")
                                  setConfirmMessage(`Are you sure you want to delete ${member.Name}?`)
                                  confirmActionRef.current = () => handleDeleteEntourage(member.Name)
                                  setConfirmOpen(true)
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete member"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* PrincipalSponsor Tab Content */}
        {activeTab === "principalsponsor" && (
          <>
            {/* Search Section */}
            <div className="bg-[#F0F0EE] rounded-2xl p-6 shadow-md border border-[#F7E6CA]/60 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#2F3724]/40" />
                    <input
                      type="text"
                      value={searchPrincipalSponsorQuery}
                      onChange={(e) => setSearchPrincipalSponsorQuery(e.target.value)}
                      placeholder="Search by name..."
                      className="w-full pl-10 pr-4 py-2 border-2 border-[#F7E6CA]/50 focus:border-[#E9D5C3] rounded-xl font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setEditingPrincipalSponsor(null)
                    setPrincipalSponsorFormData({ MalePrincipalSponsor: "", FemalePrincipalSponsor: "" })
                    setShowPrincipalSponsorModal(true)
                  }}
                className="bg-[#E0B4B1] hover:bg-[#A5B4A3] text-black transition-colors border border-[#F0F0EE]/60"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sponsors
                </Button>
              </div>

              {/* Success/Error Messages */}
              {successMessage && (
                <div className="bg-[#E9D5C3]/15 border-2 border-[#E9D5C3]/60 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#3D5033]" />
                  <span className="text-[#2F3724] font-semibold text-sm">{successMessage}</span>
                </div>
              )}

              {error && (
                <div className="bg-[#E9D5C3]/15 border-2 border-[#E9D5C3]/60 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#3D5033]" />
                  <span className="text-[#2F3724] font-semibold text-sm">{error}</span>
                </div>
              )}

            </div>

            {/* PrincipalSponsor List */}
            <div className="bg-[#F0F0EE] rounded-2xl shadow-md border border-[#F7E6CA]/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F7E6CA]/60">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Male Principal Sponsor</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Female Principal Sponsor</th>
                      <th className="text-center px-6 py-4 text-sm font-bold text-[#2F3724] font-sans">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7E6CA]/40">
                    {filteredPrincipalSponsors.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-[#2F3724]/60 font-sans">
                          {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <RefreshCw className="h-5 w-5 animate-spin" />
                              <span>Loading sponsors...</span>
                            </div>
                          ) : (
                            "No principal sponsors found"
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredPrincipalSponsors.map((sponsor, index) => (
                        <tr key={index} className="hover:bg-[#F7E6CA]/20 transition-colors bg-[#FDF7EF]">
                          <td className="px-6 py-4 font-medium text-[#2F3724] font-sans">{sponsor.MalePrincipalSponsor}</td>
                          <td className="px-6 py-4 text-[#2F3724]/70 font-sans">
                            {sponsor.FemalePrincipalSponsor || "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditPrincipalSponsorClick(sponsor)}
                                className="p-2 text-[#3D5033] hover:bg-[#F7E6CA]/30 rounded-lg transition-colors"
                                title="Edit sponsors"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmTitle("Delete Sponsors")
                                  setConfirmMessage(`Are you sure you want to delete ${sponsor.MalePrincipalSponsor}?`)
                                  confirmActionRef.current = () => handleDeletePrincipalSponsor(sponsor.MalePrincipalSponsor)
                                  setConfirmOpen(true)
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete sponsors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Add Guest Modal */}
      <AddGuestModal
        open={showAddGuestModal}
        formData={formData}
        setFormData={setFormData}
        isLoading={isLoading}
        onClose={() => {
          setShowAddGuestModal(false)
          setFormData({ Name: "", Email: "", RSVP: "", Guest: "", Message: "" })
        }}
        onSave={handleAddGuest}
      />

      {/* Edit Guest Modal */}
      <EditGuestModal
        open={editModalOpen}
        guest={editingGuest}
        formData={formData}
        setFormData={setFormData}
        isLoading={isLoading}
        onClose={() => {
          setEditModalOpen(false)
          setEditingGuest(null)
          setFormData({ Name: "", Email: "", RSVP: "", Guest: "", Message: "" })
        }}
        onSave={handleUpdateGuest}
      />

      {/* Entourage Add/Edit Modal */}
      <EntourageModal
        open={showEntourageModal}
        editing={!!editingEntourage}
        editingMember={editingEntourage}
        formData={entourageFormData}
        setFormData={setEntourageFormData}
        isLoading={isLoading}
        entourage={entourage}
        onClose={handleCancelEntourage}
        onSave={editingEntourage ? handleUpdateEntourage : handleAddEntourage}
      />

      {/* Principal Sponsor Add/Edit Modal */}
      <PrincipalSponsorModal
        open={showPrincipalSponsorModal}
        editing={!!editingPrincipalSponsor}
        editingSponsor={editingPrincipalSponsor}
        formData={principalSponsorFormData}
        setFormData={setPrincipalSponsorFormData}
        isLoading={isLoading}
        onClose={handleCancelPrincipalSponsor}
        onSave={editingPrincipalSponsor ? handleUpdatePrincipalSponsor : handleAddPrincipalSponsor}
      />

      {/* Edit Request Modal */}
      <EditRequestModal
        open={!!editingRequest}
        request={editingRequest}
        formData={requestFormData}
        setFormData={setRequestFormData}
        isLoading={isLoading}
        onClose={handleCancelEditRequest}
        onSave={handleUpdateRequest}
      />

      {/* Add to Guest List Confirmation Modal */}
      <AddToGuestListModal
        open={showAddToGuestListModal}
        request={requestToAdd}
        isLoading={isLoading}
        onCancel={handleCancelAddToGuestList}
        onConfirm={handleConfirmAddToGuestList}
      />

      {/* Global Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false)
          if (confirmActionRef.current) confirmActionRef.current()
        }}
      />
    </div>
  )
}

// Edit Request Modal Component
function EditRequestModal({
  open,
  request,
  formData,
  setFormData,
  isLoading,
  onClose,
  onSave,
}: {
  open: boolean
  request: GuestRequest | null
  formData: { Name: string; Email: string; Phone: string; RSVP: string; Guest: string; Message: string }
  setFormData: (data: { Name: string; Email: string; Phone: string; RSVP: string; Guest: string; Message: string }) => void
  isLoading: boolean
  onClose: () => void
  onSave: () => void
}) {
  if (!open || !request) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#F0F0EE] rounded-2xl shadow-2xl border border-[#F7E6CA]/70 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#F7E6CA]/70 px-6 py-4 border-b border-[#E9D5C3]/70 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#2F3724] font-sans">Edit Guest Request</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#E9D5C3]/40 rounded-lg transition-colors text-[#2F3724]/70 hover:text-[#2F3724]"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                Name *
              </label>
              <input
                type="text"
                value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                Email
              </label>
              <input
                type="email"
                value={formData.Email}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                Phone
              </label>
              <input
                type="tel"
                value={formData.Phone}
                onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                RSVP Status
              </label>
              <select
                value={formData.RSVP}
                onChange={(e) => setFormData({ ...formData, RSVP: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black bg-white transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20"
              >
                <option value="">Select status</option>
                <option value="Yes">Attending</option>
                <option value="No">Not Attending</option>
                <option value="Maybe">Maybe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                Number of Guests
              </label>
              <input
                type="number"
                min="1"
                value={formData.Guest || "1"}
                onChange={(e) => setFormData({ ...formData, Guest: e.target.value || "1" })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                placeholder="1"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                Message
              </label>
              <textarea
                value={formData.Message}
                onChange={(e) => setFormData({ ...formData, Message: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                rows={3}
                placeholder="Any special message or notes..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onSave}
              disabled={isLoading}
              className="flex-1 bg-[#E0B4B1] hover:bg-[#A5B4A3] text-black transition-colors border border-[#2F3724]/40"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button onClick={onClose} variant="outline" className="px-6">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add to Guest List Confirmation Modal Component
function AddToGuestListModal({
  open,
  request,
  isLoading,
  onCancel,
  onConfirm,
}: {
  open: boolean
  request: GuestRequest | null
  isLoading: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  if (!open || !request) return null

  const guestCount = request.Guest && request.Guest !== '' ? (parseInt(String(request.Guest)) || 1) : 1

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#F0F0EE] rounded-2xl shadow-2xl border border-[#F7E6CA]/70">
        <div className="sticky top-0 bg-[#F7E6CA]/70 px-6 py-4 border-b border-[#E9D5C3]/70 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#2F3724] font-sans">Add to Guest List</h3>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-[#E9D5C3]/40 rounded-lg transition-colors text-[#2F3724]/70 hover:text-[#2F3724]"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <p className="text-base text-[#2F3724] font-sans leading-relaxed">
              <span className="font-bold text-lg">{request.Name}</span> is requesting to join your wedding with a total of{' '}
              <span className="font-bold text-lg text-[#3D5033]">{guestCount}</span>{' '}
              {guestCount === 1 ? 'guest' : 'guests'}.
            </p>
          </div>
          
          <div className="bg-[#F5F0ED] rounded-xl p-4 mb-6 border border-[#F7E6CA]/70">
            <p className="text-sm font-semibold text-[#2F3724] mb-2 font-sans">Request Details:</p>
            <div className="space-y-2 text-sm text-[#2F3724]/80 font-sans">
              <div><span className="font-medium">Email:</span> {request.Email || "-"}</div>
              {request.Phone && <div><span className="font-medium">Phone:</span> {request.Phone}</div>}
              <div><span className="font-medium">Guests:</span> {guestCount}</div>
              {request.Message && (
                <div className="mt-2 pt-2 border-t border-[#E9D5C3]/60">
                  <span className="font-medium">Message:</span>
                  <p className="italic mt-1">{request.Message}</p>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-[#2F3724]/70 mb-6 font-sans">
            Do you want to include this to guest list?
          </p>

          <div className="flex gap-3">
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-[#E0B4B1] hover:bg-[#A5B4A3] text-black disabled:opacity-50 transition-colors border border-[#2F3724]/40"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Yes, Add to Guest List
                </>
              )}
            </Button>
            <Button onClick={onCancel} variant="outline" className="px-6" disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Entourage Modal Component (Add/Edit)
function EntourageModal({
  open,
  editing,
  editingMember,
  formData,
  setFormData,
  isLoading,
  entourage,
  onClose,
  onSave,
}: {
  open: boolean
  editing: boolean
  editingMember: Entourage | null
  formData: { Name: string; RoleCategory: string; RoleTitle: string; Email: string }
  setFormData: (data: { Name: string; RoleCategory: string; RoleTitle: string; Email: string }) => void
  isLoading: boolean
  entourage: Entourage[]
  onClose: () => void
  onSave: () => void
}) {
  if (!open) return null

  // Extract unique Role Categories from existing entourage
  const uniqueRoleCategories = Array.from(
    new Set(
      entourage
        .map((member) => member.RoleCategory?.trim())
        .filter((category) => category && category !== "")
    )
  ).sort()

  // Extract unique Role Titles based on selected Role Category
  const uniqueRoleTitles = formData.RoleCategory
    ? Array.from(
        new Set(
          entourage
            .filter((member) => member.RoleCategory?.trim() === formData.RoleCategory.trim())
            .map((member) => member.RoleTitle?.trim())
            .filter((title) => title && title !== "")
        )
      ).sort()
    : []

  // Count members with the same Role Category (excluding current member if editing)
  const currentRoleCategoryCount = formData.RoleCategory
    ? entourage.filter((member) => {
        const memberCategory = member.RoleCategory?.trim().toLowerCase() || ""
        const formCategory = formData.RoleCategory.trim().toLowerCase()
        // When editing, exclude the original member being edited
        if (editing && editingMember && member.Name === editingMember.Name) return false
        return memberCategory === formCategory && memberCategory !== ""
      }).length
    : 0

  // Count members with the same Role Title (excluding current member if editing)
  const currentRoleTitleCount = formData.RoleTitle
    ? entourage.filter((member) => {
        const memberTitle = member.RoleTitle?.trim().toLowerCase() || ""
        const formTitle = formData.RoleTitle.trim().toLowerCase()
        // When editing, exclude the original member being edited
        if (editing && editingMember && member.Name === editingMember.Name) return false
        return memberTitle === formTitle && memberTitle !== ""
      }).length
    : 0

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#F0F0EE] rounded-2xl shadow-2xl border border-[#F7E6CA]/70 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#F7E6CA]/70 px-6 py-4 border-b border-[#E9D5C3]/70 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#2F3724] font-sans">
              {editing ? 'Edit Entourage Member' : 'Add New Entourage Member'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#E9D5C3]/40 rounded-lg transition-colors text-[#2F3724]/70 hover:text-[#2F3724]"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">Name *</label>
              <input
                type="text"
                value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                Role Category
                {currentRoleCategoryCount > 0 && (
                  <span className="text-xs text-gray-500 font-normal ml-2">({currentRoleCategoryCount} existing)</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="role-category-options"
                  value={formData.RoleCategory}
                  onChange={(e) => setFormData({ ...formData, RoleCategory: e.target.value, RoleTitle: "" })}
                  placeholder="e.g., Wedding Party, Family"
                  className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                />
                <datalist id="role-category-options">
                  {uniqueRoleCategories.map((category, index) => (
                    <option key={index} value={category} />
                  ))}
                </datalist>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                Role Title
                {currentRoleTitleCount > 0 && (
                  <span className="text-xs text-gray-500 font-normal ml-2">({currentRoleTitleCount} existing)</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="role-title-options"
                  value={formData.RoleTitle}
                  onChange={(e) => setFormData({ ...formData, RoleTitle: e.target.value })}
                  placeholder="e.g., Best Man, Matron of Honor"
                  className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                />
                {formData.RoleCategory && uniqueRoleTitles.length > 0 && (
                  <datalist id="role-title-options">
                    {uniqueRoleTitles.map((title, index) => (
                      <option key={index} value={title} />
                    ))}
                  </datalist>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">Email</label>
              <input
                type="email"
                value={formData.Email}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onSave}
              disabled={isLoading}
              className="flex-1 bg-[#E0B4B1] hover:bg-[#A5B4A3] text-black transition-colors border border-[#2F3724]/40"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                editing ? 'Update' : 'Add'
              )}
            </Button>
            <Button onClick={onClose} variant="outline" className="px-6">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Principal Sponsor Modal Component (Add/Edit)
function PrincipalSponsorModal({
  open,
  editing,
  editingSponsor,
  formData,
  setFormData,
  isLoading,
  onClose,
  onSave,
}: {
  open: boolean
  editing: boolean
  editingSponsor: PrincipalSponsor | null
  formData: { MalePrincipalSponsor: string; FemalePrincipalSponsor: string }
  setFormData: (data: { MalePrincipalSponsor: string; FemalePrincipalSponsor: string }) => void
  isLoading: boolean
  onClose: () => void
  onSave: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#F0F0EE] rounded-2xl shadow-2xl border border-[#F7E6CA]/70 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#F7E6CA]/70 px-6 py-4 border-b border-[#E9D5C3]/70 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#2F3724] font-sans">
              {editing ? "Edit Principal Sponsors" : "Add New Principal Sponsors"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#E9D5C3]/40 rounded-lg transition-colors text-[#2F3724]/70 hover:text-[#2F3724]"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                Male Principal Sponsor *
              </label>
              <input
                type="text"
                value={formData.MalePrincipalSponsor}
                onChange={(e) => setFormData({ ...formData, MalePrincipalSponsor: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                placeholder="Enter male principal sponsor name"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                Female Principal Sponsor
              </label>
              <input
                type="text"
                value={formData.FemalePrincipalSponsor}
                onChange={(e) => setFormData({ ...formData, FemalePrincipalSponsor: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                placeholder="Enter female principal sponsor name (optional)"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onSave}
              disabled={isLoading || !formData.MalePrincipalSponsor.trim()}
              className="flex-1 bg-[#E0B4B1] hover:bg-[#A5B4A3] text-black disabled:opacity-50 transition-colors border border-[#2F3724]/40"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                editing ? "Update" : "Add"
              )}
            </Button>
            <Button onClick={onClose} variant="outline" className="px-6" disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add Guest Modal Component - Only Name Input
function AddGuestModal({
  open,
  formData,
  setFormData,
  isLoading,
  onClose,
  onSave,
}: {
  open: boolean
  formData: { Name: string; Email: string; RSVP: string; Guest: string; Message: string }
  setFormData: (data: { Name: string; Email: string; RSVP: string; Guest: string; Message: string }) => void
  isLoading: boolean
  onClose: () => void
  onSave: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#F0F0EE] rounded-2xl shadow-2xl border border-[#F7E6CA]/70">
        <div className="sticky top-0 bg-[#F7E6CA]/70 px-6 py-4 border-b border-[#E9D5C3]/70 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#2F3724] font-sans">Add New Guest</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#E9D5C3]/40 rounded-lg transition-colors text-[#2F3724]/70 hover:text-[#2F3724]"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-[#2F3724]/70 mb-4 font-sans leading-relaxed">
            Just type in your guest's name to add them to your guest list. After they are added, they'll be able to visit your wedding website, search for their name, and complete their RSVP — including their contact details, attendance confirmation, and the number of guests they'll be bringing.
          </p>
          <div>
            <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
              Guest Name *
            </label>
            <input
              type="text"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
              placeholder="Enter guest name"
              required
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && formData.Name.trim()) {
                  onSave()
                }
              }}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onSave}
              disabled={isLoading || !formData.Name.trim()}
              className="flex-1 bg-[#E0B4B1] hover:bg-[#A5B4A3] text-black disabled:opacity-50 transition-colors border border-[#2F3724]/40"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Guest"
              )}
            </Button>
            <Button onClick={onClose} variant="outline" className="px-6">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Edit Guest Modal Component
function EditGuestModal({
  open,
  guest,
  formData,
  setFormData,
  isLoading,
  onClose,
  onSave,
}: {
  open: boolean
  guest: Guest | null
  formData: { Name: string; Email: string; RSVP: string; Guest: string; Message: string }
  setFormData: (data: { Name: string; Email: string; RSVP: string; Guest: string; Message: string }) => void
  isLoading: boolean
  onClose: () => void
  onSave: () => void
}) {
  if (!open || !guest) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#F0F0EE] rounded-2xl shadow-2xl border border-[#F7E6CA]/70 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#F7E6CA]/70 px-6 py-4 border-b border-[#E9D5C3]/70 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#2F3724] font-sans">Edit Guest</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#E9D5C3]/40 rounded-lg transition-colors text-[#2F3724]/70 hover:text-[#2F3724]"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                Name *
              </label>
              <input
                type="text"
                value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                Email
              </label>
              <input
                type="email"
                value={formData.Email}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                RSVP Status *
              </label>
              <select
                value={formData.RSVP}
                onChange={(e) => setFormData({ ...formData, RSVP: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black bg-white transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20"
                required
              >
                <option value="">Select status</option>
                <option value="Yes">Attending</option>
                <option value="No">Not Attending</option>
                <option value="Maybe">Maybe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                Number of Guests *
              </label>
              <input
                type="number"
                min="1"
                value={formData.Guest || "1"}
                onChange={(e) => setFormData({ ...formData, Guest: e.target.value || "1" })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                placeholder="1"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#2F3724] mb-2 font-sans">
                Message
              </label>
              <textarea
                value={formData.Message}
                onChange={(e) => setFormData({ ...formData, Message: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#F7E6CA]/70 focus:border-[#E9D5C3] rounded-xl text-sm font-sans text-black placeholder:text-[#2F3724]/40 transition-all duration-300 focus:ring-4 focus:ring-[#E9D5C3]/20 bg-white"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onSave}
              disabled={isLoading}
              className="flex-1 bg-[#E0B4B1] hover:bg-[#A5B4A3] text-black transition-colors border border-[#2F3724]/40"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button onClick={onClose} variant="outline" className="px-6">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Confirm Modal Component (inline for simplicity)
function ConfirmModal({ open, title, message, onCancel, onConfirm }: { open: boolean; title: string; message: string; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#F0F0EE] rounded-2xl shadow-2xl border border-[#F7E6CA]/70">
        <div className="px-5 py-4 border-b border-[#E9D5C3]/70">
          <h3 className="text-base sm:text-lg font-bold text-[#2F3724]">{title}</h3>
        </div>
        <div className="px-5 py-4 text-sm sm:text-base text-[#2F3724]/80">
          {message}
        </div>
        <div className="px-5 py-4 flex justify-end gap-2 border-t border-[#E9D5C3]/70">
          <button onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-[#F7E6CA]/70 text-[#2F3724] hover:bg-[#E9D5C3]/40 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm rounded-lg bg-[#E0B4B1] text-black hover:bg-[#A5B4A3] transition-colors border border-[#2F3724]/40">Delete</button>
        </div>
      </div>
    </div>
  )
}