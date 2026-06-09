"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Users,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Search,
  Plus,
  AlertCircle,
  X,
} from "lucide-react"

interface Guest {
  Name: string
  Email: string
  RSVP: string
  Guest: string
  Message: string
}

interface GuestListManagementProps {
  guests: Guest[]
  onRefresh: () => void
  isLoading: boolean
}

export function GuestListManagement({ guests, onRefresh, isLoading }: GuestListManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    RSVP: "",
    Guest: "",
    Message: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const filteredGuests = guests.filter((guest) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      guest.Name.toLowerCase().includes(query) ||
      (guest.Email && guest.Email.toLowerCase().includes(query))
    )
  })

  const handleEditClick = (guest: Guest) => {
    setEditingGuest(guest)
    setFormData({
      Name: guest.Name,
      Email: guest.Email && guest.Email !== "Pending" ? guest.Email : "",
      RSVP: guest.RSVP || "",
      Guest: guest.Guest || "1",
      Message: guest.Message || "",
    })
  }

  const handleAddGuest = async () => {
    if (!formData.Name) {
      setError("Name is required")
      setTimeout(() => setError(null), 3000)
      return
    }

    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: formData.Name,
          Email: formData.Email,
          RSVP: formData.RSVP,
          Guest: formData.Guest,
          Message: formData.Message,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add guest")
      }

      setSuccessMessage("Guest added successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      setShowAddModal(false)
      setFormData({ Name: "", Email: "", RSVP: "", Guest: "", Message: "" })
      onRefresh()
    } catch (error) {
      console.error("Error adding guest:", error)
      setError("Failed to add guest")
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleUpdateGuest = async () => {
    if (!editingGuest || !formData.Name) {
      setError("Name is required")
      setTimeout(() => setError(null), 3000)
      return
    }

    try {
      const response = await fetch("/api/guests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalName: editingGuest.Name,
          Name: formData.Name,
          Email: formData.Email,
          RSVP: formData.RSVP,
          Guest: formData.Guest,
          Message: formData.Message,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update guest")
      }

      setSuccessMessage("Guest updated successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      setEditingGuest(null)
      setFormData({ Name: "", Email: "", RSVP: "", Guest: "", Message: "" })
      onRefresh()
    } catch (error) {
      console.error("Error updating guest:", error)
      setError("Failed to update guest")
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleDeleteGuest = async (guestName: string) => {
    if (!confirm(`Are you sure you want to delete ${guestName}?`)) {
      return
    }

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
      onRefresh()
    } catch (error) {
      console.error("Error deleting guest:", error)
      setError("Failed to delete guest")
      setTimeout(() => setError(null), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#111827]">Guest List Management</h2>
        <div className="text-sm text-[#6B7280]">
          {filteredGuests.length} of {guests.length} guests
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="ml-auto">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search and Add */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guests by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#A67C52] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <Button
            onClick={() => {
              setShowAddModal(true)
              setEditingGuest(null)
              setFormData({ Name: "", Email: "", RSVP: "", Guest: "1", Message: "" })
            }}
            className="bg-gradient-to-r from-[#8B6F47] to-[#6B5335] hover:from-[#6B5335] hover:to-[#8B6F47] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Guest
          </Button>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#111827]">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#111827]">Email</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#111827]">RSVP</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#111827]">
                  <span className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4" />
                    Guests
                  </span>
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#111827]">Message</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#111827]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6B7280]">
                    {isLoading ? "Loading guests..." : "No guests found"}
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest, index) => (
                  <tr key={index} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#111827]">{guest.Name}</td>
                    <td className="px-6 py-4 text-[#6B7280]">
                      {guest.Email && guest.Email !== "Pending" ? guest.Email : "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {guest.RSVP === "Yes" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                          <CheckCircle className="h-4 w-4" />
                          Attending
                        </span>
                      )}
                      {guest.RSVP === "No" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200">
                          <XCircle className="h-4 w-4" />
                          Not Attending
                        </span>
                      )}
                      {guest.RSVP === "Maybe" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium border border-yellow-200">
                          <AlertCircle className="h-4 w-4" />
                          Maybe
                        </span>
                      )}
                      {!guest.RSVP || guest.RSVP.trim() === "" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                          Pending
                        </span>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#F9FAFB] text-[#111827] rounded-full text-sm font-semibold min-w-[3.5rem] border border-[#E5E7EB]">
                        {guest?.Guest !== undefined && guest?.Guest !== null && guest?.Guest !== ""
                          ? parseInt(String(guest.Guest)) || 1
                          : 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#6B7280] max-w-xs truncate" title={guest.Message || ""}>
                      {guest.Message || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(guest)}
                          className="p-2 text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#6B4423] rounded-lg transition-colors"
                          title="Edit guest"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(guest.Name)}
                          className="p-2 text-[#6B7280] hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
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

      {/* Add/Edit Guest Modal */}
      {(showAddModal || editingGuest) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#111827]">
                {editingGuest ? "Edit Guest" : "Add New Guest"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingGuest(null)
                  setFormData({ Name: "", Email: "", RSVP: "", Guest: "", Message: "" })
                }}
                className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-[#6B7280]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#A67C52] focus:border-transparent outline-none"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Email</label>
                <input
                  type="email"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#A67C52] focus:border-transparent outline-none"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">RSVP Status</label>
                <select
                  value={formData.RSVP}
                  onChange={(e) => setFormData({ ...formData, RSVP: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#A67C52] focus:border-transparent outline-none"
                >
                  <option value="">Pending</option>
                  <option value="Yes">Attending</option>
                  <option value="No">Not Attending</option>
                  <option value="Maybe">Maybe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  value={formData.Guest}
                  onChange={(e) => setFormData({ ...formData, Guest: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#A67C52] focus:border-transparent outline-none"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Message</label>
                <textarea
                  value={formData.Message}
                  onChange={(e) => setFormData({ ...formData, Message: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#A67C52] focus:border-transparent outline-none"
                  placeholder="Enter message"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingGuest(null)
                  setFormData({ Name: "", Email: "", RSVP: "", Guest: "", Message: "" })
                }}
                variant="outline"
                className="flex-1 border-[#E5E7EB] text-[#6B7280]"
              >
                Cancel
              </Button>
              <Button
                onClick={editingGuest ? handleUpdateGuest : handleAddGuest}
                className="flex-1 bg-gradient-to-r from-[#8B6F47] to-[#6B5335] hover:from-[#6B5335] hover:to-[#8B6F47] text-white"
              >
                {editingGuest ? "Update" : "Add"} Guest
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


