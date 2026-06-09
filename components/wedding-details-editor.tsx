"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  Church,
  Utensils,
  Phone,
  Mail,
  Users,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Edit2,
  Trash2,
  X,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WeddingDetails {
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
  theme: string
  hashtag: string
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
  details: {
    rsvp: {
      deadline: string
    }
  }
  contact: {
    bridePhone: string
    groomPhone: string
    email: string
  }
}

const defaultWeddingDetails: WeddingDetails = {
  couple: {
    bride: "",
    brideNickname: "",
    groom: "",
    groomNickname: "",
  },
  wedding: {
    date: "",
    venue: "",
    tagline: "",
  },
  theme: "",
  hashtag: "",
  ceremony: {
    venue: "",
    address: "",
    time: "",
    googleMapsUrl: "",
  },
  reception: {
    venue: "",
    address: "",
    time: "",
    googleMapsUrl: "",
  },
  narratives: {
    bride: "",
    groom: "",
    shared: "",
  },
  dressCode: {
    theme: "",
    note: "",
  },
  details: {
    rsvp: {
      deadline: "",
    },
  },
  contact: {
    bridePhone: "",
    groomPhone: "",
    email: "",
  },
}

export function WeddingDetailsEditor() {
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails>(defaultWeddingDetails)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    fetchWeddingDetails()
  }, [])

  const fetchWeddingDetails = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/wedding-details")
      if (!response.ok) {
        throw new Error("Failed to fetch wedding details")
      }
      const data = await response.json()
      
      // Check if API returned an error
      if (data.error) {
        throw new Error(data.error)
      }

      const raw = (data.weddingDetails ?? data) as typeof data
      const cleanData: WeddingDetails = {
        couple: {
          bride: raw.couple?.bride || "",
          brideNickname: raw.couple?.brideNickname || "",
          groom: raw.couple?.groom || "",
          groomNickname: raw.couple?.groomNickname || "",
        },
        wedding: {
          date: raw.wedding?.date || "",
          venue: raw.wedding?.venue || "",
          tagline: raw.wedding?.tagline || "",
        },
        theme: raw.theme || "",
        hashtag: raw.hashtag || "",
        ceremony: {
          venue: raw.ceremony?.venue || "",
          address: raw.ceremony?.address || "",
          time: raw.ceremony?.time || "",
          googleMapsUrl: raw.ceremony?.googleMapsUrl || "",
        },
        reception: {
          venue: raw.reception?.venue || "",
          address: raw.reception?.address || "",
          time: raw.reception?.time || "",
          googleMapsUrl: raw.reception?.googleMapsUrl || "",
        },
        narratives: {
          bride: raw.narratives?.bride || "",
          groom: raw.narratives?.groom || "",
          shared: raw.narratives?.shared || "",
        },
        dressCode: {
          theme: raw.dressCode?.theme || "",
          note: raw.dressCode?.note || "",
        },
        details: {
          rsvp: {
            deadline: raw.details?.rsvp?.deadline || "",
          },
        },
        contact: {
          bridePhone: raw.contact?.bridePhone || "",
          groomPhone: raw.contact?.groomPhone || "",
          email: raw.contact?.email || "",
        },
      }

      setWeddingDetails(cleanData)
      setHasChanges(false)
    } catch (err: any) {
      console.error("Error fetching wedding details:", err)
      setError(err.message || "Failed to load wedding details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)
    try {
      const response = await fetch("/api/wedding-details", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(weddingDetails),
      })

      if (!response.ok) {
        throw new Error("Failed to save wedding details")
      }

      setSuccessMessage("Wedding details saved successfully!")
      setHasChanges(false)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      console.error("Error saving wedding details:", err)
      setError(err.message || "Failed to save wedding details")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    setSuccessMessage(null)
    try {
      const response = await fetch("/api/wedding-details", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to clear wedding details")
      }

      setWeddingDetails(defaultWeddingDetails)
      setHasChanges(false)
      setShowDeleteConfirm(false)
      setSuccessMessage("Wedding details cleared successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      console.error("Error clearing wedding details:", err)
      setError(err.message || "Failed to clear wedding details")
    } finally {
      setIsDeleting(false)
    }
  }

  const updateField = (path: string, value: string) => {
    setWeddingDetails((prev) => {
      const updated = { ...prev }
      const keys = path.split(".")
      let current: any = updated
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return updated
    })
    setHasChanges(true)
  }

  const clearField = (path: string) => {
    updateField(path, "")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-[#6B7280]">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading wedding details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Wedding Details Editor</h2>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage your wedding information displayed on the website
            {hasChanges && <span className="ml-2 text-amber-600 font-medium">• Unsaved changes</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={fetchWeddingDetails}
            variant="outline"
            size="sm"
            disabled={isLoading || isSaving || isDeleting}
            className="border-[#E5E7EB] text-[#6B7280] hover:text-[#6B4423] hover:border-[#A67C52]"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="outline"
            size="sm"
            disabled={isLoading || isSaving || isDeleting}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading || isDeleting || !hasChanges}
            size="sm"
            className="bg-gradient-to-r from-[#8B6F47] to-[#6B5335] hover:from-[#6B5335] hover:to-[#8B6F47] text-white disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#111827]">Clear All Wedding Details?</h3>
                <p className="text-sm text-[#6B7280] mt-2">
                  This will remove all wedding information from your database. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                size="sm"
                disabled={isDeleting}
                className="border-[#E5E7EB] text-[#6B7280]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Yes, Clear All
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs for Different Sections */}
      <Tabs defaultValue="couple" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full">
          <TabsTrigger value="couple">Couple</TabsTrigger>
          <TabsTrigger value="wedding">Wedding</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="narratives">Stories</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Couple Information */}
        <TabsContent value="couple" className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFF8F0] rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-[#8B6F47]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">Couple Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Groom Full Name
                  </label>
                  <div className="relative">
                    <Input
                      value={weddingDetails.couple.groom}
                      onChange={(e) => updateField("couple.groom", e.target.value)}
                      placeholder="Enter groom's full name"
                      className="border-[#E5E7EB] focus:ring-[#A67C52] pr-10"
                    />
                    {weddingDetails.couple.groom && (
                      <button
                        onClick={() => clearField("couple.groom")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title="Clear field"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Groom Nickname
                  </label>
                  <div className="relative">
                    <Input
                      value={weddingDetails.couple.groomNickname}
                      onChange={(e) => updateField("couple.groomNickname", e.target.value)}
                      placeholder="Enter nickname"
                      className="border-[#E5E7EB] focus:ring-[#A67C52] pr-10"
                    />
                    {weddingDetails.couple.groomNickname && (
                      <button
                        onClick={() => clearField("couple.groomNickname")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title="Clear field"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Bride Full Name
                  </label>
                  <div className="relative">
                    <Input
                      value={weddingDetails.couple.bride}
                      onChange={(e) => updateField("couple.bride", e.target.value)}
                      placeholder="Enter bride's full name"
                      className="border-[#E5E7EB] focus:ring-[#A67C52] pr-10"
                    />
                    {weddingDetails.couple.bride && (
                      <button
                        onClick={() => clearField("couple.bride")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title="Clear field"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Bride Nickname
                  </label>
                  <div className="relative">
                    <Input
                      value={weddingDetails.couple.brideNickname}
                      onChange={(e) => updateField("couple.brideNickname", e.target.value)}
                      placeholder="Enter nickname"
                      className="border-[#E5E7EB] focus:ring-[#A67C52] pr-10"
                    />
                    {weddingDetails.couple.brideNickname && (
                      <button
                        onClick={() => clearField("couple.brideNickname")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title="Clear field"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Wedding Information */}
        <TabsContent value="wedding" className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFF8F0] rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-[#8B6F47]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">Wedding Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Wedding Date
                </label>
                <div className="relative">
                  <Input
                    value={weddingDetails.wedding.date}
                    onChange={(e) => updateField("wedding.date", e.target.value)}
                    placeholder="e.g., December 28, 2025"
                    className="border-[#E5E7EB] focus:ring-[#A67C52] pr-10"
                  />
                  {weddingDetails.wedding.date && (
                    <button
                      onClick={() => clearField("wedding.date")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      title="Clear field"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Wedding Venue
                </label>
                <div className="relative">
                  <Input
                    value={weddingDetails.wedding.venue}
                    onChange={(e) => updateField("wedding.venue", e.target.value)}
                    placeholder="Enter main venue name"
                    className="border-[#E5E7EB] focus:ring-[#A67C52] pr-10"
                  />
                  {weddingDetails.wedding.venue && (
                    <button
                      onClick={() => clearField("wedding.venue")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      title="Clear field"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Wedding Tagline
                </label>
                <div className="relative">
                  <Input
                    value={weddingDetails.wedding.tagline}
                    onChange={(e) => updateField("wedding.tagline", e.target.value)}
                    placeholder="Enter a memorable tagline"
                    className="border-[#E5E7EB] focus:ring-[#A67C52] pr-10"
                  />
                  {weddingDetails.wedding.tagline && (
                    <button
                      onClick={() => clearField("wedding.tagline")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      title="Clear field"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Theme</label>
                  <div className="relative">
                    <Input
                      value={weddingDetails.theme}
                      onChange={(e) => updateField("theme", e.target.value)}
                      placeholder="e.g., Classic Elegance"
                      className="border-[#E5E7EB] focus:ring-[#A67C52] pr-10"
                    />
                    {weddingDetails.theme && (
                      <button
                        onClick={() => clearField("theme")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title="Clear field"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Hashtag
                  </label>
                  <div className="relative">
                    <Input
                      value={weddingDetails.hashtag}
                      onChange={(e) => updateField("hashtag", e.target.value)}
                      placeholder="e.g., #YourHashtag2025"
                      className="border-[#E5E7EB] focus:ring-[#A67C52] pr-10"
                    />
                    {weddingDetails.hashtag && (
                      <button
                        onClick={() => clearField("hashtag")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title="Clear field"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Venues */}
        <TabsContent value="venues" className="space-y-6">
          {/* Ceremony */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Church className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">Ceremony Venue</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Venue Name
                </label>
                <Input
                  value={weddingDetails.ceremony.venue}
                  onChange={(e) => updateField("ceremony.venue", e.target.value)}
                  placeholder="Minglanilla Church"
                  className="border-[#E5E7EB] focus:ring-[#A67C52]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Address</label>
                <Input
                  value={weddingDetails.ceremony.address}
                  onChange={(e) => updateField("ceremony.address", e.target.value)}
                  placeholder="Minglanilla, Cebu"
                  className="border-[#E5E7EB] focus:ring-[#A67C52]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Time</label>
                  <Input
                    value={weddingDetails.ceremony.time}
                    onChange={(e) => updateField("ceremony.time", e.target.value)}
                    placeholder="2:00 PM"
                    className="border-[#E5E7EB] focus:ring-[#A67C52]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Google Maps URL
                  </label>
                  <Input
                    value={weddingDetails.ceremony.googleMapsUrl}
                    onChange={(e) => updateField("ceremony.googleMapsUrl", e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="border-[#E5E7EB] focus:ring-[#A67C52]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reception */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Utensils className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">Reception Venue</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Venue Name
                </label>
                <Input
                  value={weddingDetails.reception.venue}
                  onChange={(e) => updateField("reception.venue", e.target.value)}
                  placeholder="Minglanilla Sports Complex"
                  className="border-[#E5E7EB] focus:ring-[#A67C52]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Address</label>
                <Input
                  value={weddingDetails.reception.address}
                  onChange={(e) => updateField("reception.address", e.target.value)}
                  placeholder="Minglanilla, Cebu"
                  className="border-[#E5E7EB] focus:ring-[#A67C52]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Time</label>
                  <Input
                    value={weddingDetails.reception.time}
                    onChange={(e) => updateField("reception.time", e.target.value)}
                    placeholder="5:00 PM"
                    className="border-[#E5E7EB] focus:ring-[#A67C52]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Google Maps URL
                  </label>
                  <Input
                    value={weddingDetails.reception.googleMapsUrl}
                    onChange={(e) => updateField("reception.googleMapsUrl", e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="border-[#E5E7EB] focus:ring-[#A67C52]"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Narratives */}
        <TabsContent value="narratives" className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFF8F0] rounded-lg flex items-center justify-center">
                <Edit2 className="h-5 w-5 text-[#8B6F47]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">Love Stories & Narratives</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  About the Bride
                </label>
                <Textarea
                  value={weddingDetails.narratives.bride}
                  onChange={(e) => updateField("narratives.bride", e.target.value)}
                  placeholder="Tell us about the bride..."
                  rows={4}
                  className="border-[#E5E7EB] focus:ring-[#A67C52]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  About the Groom
                </label>
                <Textarea
                  value={weddingDetails.narratives.groom}
                  onChange={(e) => updateField("narratives.groom", e.target.value)}
                  placeholder="Tell us about the groom..."
                  rows={4}
                  className="border-[#E5E7EB] focus:ring-[#A67C52]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Shared Love Story
                </label>
                <Textarea
                  value={weddingDetails.narratives.shared}
                  onChange={(e) => updateField("narratives.shared", e.target.value)}
                  placeholder="Tell us your love story..."
                  rows={6}
                  className="border-[#E5E7EB] focus:ring-[#A67C52]"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Details */}
        <TabsContent value="details" className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFF8F0] rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-[#8B6F47]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">Additional Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Dress Code Theme
                </label>
                <Input
                  value={weddingDetails.dressCode.theme}
                  onChange={(e) => updateField("dressCode.theme", e.target.value)}
                  placeholder="Formal Attire"
                  className="border-[#E5E7EB] focus:ring-[#A67C52]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Dress Code Note
                </label>
                <Textarea
                  value={weddingDetails.dressCode.note}
                  onChange={(e) => updateField("dressCode.note", e.target.value)}
                  placeholder="Please wear formal attire in shades of cream, beige, or earth tones."
                  rows={3}
                  className="border-[#E5E7EB] focus:ring-[#A67C52]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  RSVP Deadline
                </label>
                <Input
                  value={weddingDetails.details.rsvp.deadline}
                  onChange={(e) => updateField("details.rsvp.deadline", e.target.value)}
                  placeholder="December 15, 2025"
                  className="border-[#E5E7EB] focus:ring-[#A67C52]"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Contact */}
        <TabsContent value="contact" className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">Contact Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Bride's Phone
                </label>
                <div className="relative">
                  <Input
                    value={weddingDetails.contact.bridePhone}
                    onChange={(e) => updateField("contact.bridePhone", e.target.value)}
                    placeholder="+63 123 456 7890"
                    className="border-[#E5E7EB] focus:ring-[#A67C52] pr-10"
                  />
                  {weddingDetails.contact.bridePhone && (
                    <button
                      onClick={() => clearField("contact.bridePhone")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      title="Clear field"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Groom's Phone
                </label>
                <div className="relative">
                  <Input
                    value={weddingDetails.contact.groomPhone}
                    onChange={(e) => updateField("contact.groomPhone", e.target.value)}
                    placeholder="+63 123 456 7890"
                    className="border-[#E5E7EB] focus:ring-[#A67C52] pr-10"
                  />
                  {weddingDetails.contact.groomPhone && (
                    <button
                      onClick={() => clearField("contact.groomPhone")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      title="Clear field"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Contact Email
                </label>
                <div className="relative">
                  <Input
                    value={weddingDetails.contact.email}
                    onChange={(e) => updateField("contact.email", e.target.value)}
                    placeholder="wedding@example.com"
                    type="email"
                    className="border-[#E5E7EB] focus:ring-[#A67C52] pr-10"
                  />
                  {weddingDetails.contact.email && (
                    <button
                      onClick={() => clearField("contact.email")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      title="Clear field"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
