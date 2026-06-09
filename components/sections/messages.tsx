"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { MessageCircle, Heart, Sparkles, Send } from "lucide-react"
import { Section } from "@/components/section"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import MessageWallDisplay from "./message-wall-display"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { useSiteConfig } from "@/hooks/use-site-config"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

const textColor = "color-mix(in srgb, var(--color-motif-cream) 50%, white)"
const cardTextColor = "var(--color-motif-soft)"
const accentColor = "var(--color-motif-accent)"
const DECO_FILTER =
  "brightness(0) saturate(100%) invert(100%) drop-shadow(0 8px 20px color-mix(in srgb, var(--color-motif-soft) 55%, transparent))"

const primaryBtnClass =
  "cursor-pointer rounded-full border border-motif-soft bg-motif-soft px-5 py-3 text-[9px] font-bold tracking-[0.16em] uppercase shadow-[0_8px_24px_rgba(15,28,63,0.18)] transition-all duration-300 hover:bg-[color-mix(in_srgb,var(--color-motif-soft)_85%,black)] hover:border-[color-mix(in_srgb,var(--color-motif-soft)_85%,black)] hover:shadow-xl hover:-translate-y-0.5 sm:px-7 sm:py-3.5 sm:text-[10px] sm:tracking-[0.18em] md:px-8 md:py-4 md:text-[11px]"

function MotifDivider() {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="h-px w-10 rounded-full bg-motif-accent/60 sm:w-14" />
      <div className="flex gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-80" />
        <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-50" />
        <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-80" />
      </div>
      <span className="h-px w-10 rounded-full bg-motif-accent/60 sm:w-14" />
    </div>
  )
}

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageFormProps {
  onSuccess?: () => void
  onMessageSent?: () => void
}

function MessageForm({ onSuccess, onMessageSent }: MessageFormProps) {
  const siteConfig = useSiteConfig()
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`

  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [messageValue, setMessageValue] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const message = formData.get("message") as string

    const googleFormData = new FormData()
    googleFormData.append("entry.405401269", name)
    googleFormData.append("entry.893740636", message)

    try {
      await fetch(
        siteConfig.googleAPI.messageForm,
        {
          method: "POST",
          mode: "no-cors",
          body: googleFormData,
        }
      )

      toast({
        title: "Message Sent! 💌",
        description: "Your heartfelt wishes have been delivered",
        duration: 3000,
      })

      setIsSubmitted(true)
      setNameValue("")
      setMessageValue("")
      formRef.current?.reset()
      
      // Reset submitted state after animation
      setTimeout(() => setIsSubmitted(false), 1000)
      
      if (onSuccess) onSuccess()
      if (onMessageSent) onMessageSent()
    } catch (error) {
      toast({
        title: "Unable to send message",
        description: "Please try again in a moment",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto px-3 sm:px-0">
      {/* Style to override placeholder color */}
      <style>{`
        .message-form-input::placeholder {
          color: #9CA3AF !important;
          opacity: 1 !important;
        }
        .message-form-textarea::placeholder {
          color: #9CA3AF !important;
          opacity: 1 !important;
        }
      `}</style>
      
      {/* Decorative background elements */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-motif-accent/20 blur-sm animate-pulse-slow" />
      <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-motif-accent/20 blur-md animate-pulse-slow" />
      
      <Card className={`relative w-full border border-motif-accent/25 bg-[color-mix(in_srgb,var(--color-motif-cream)_18%,white)] backdrop-blur-md transition-all duration-500 group overflow-hidden rounded-2xl ${
        isFocused ? 'scale-[1.01] border-motif-accent/50' : 'hover:border-motif-accent/40'
      } ${isSubmitted ? 'animate-bounce' : ''}`}
        style={{ boxShadow: '0 12px 30px color-mix(in srgb, var(--color-motif-soft) 15%, transparent)' }}
      >
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-motif-accent/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Success animation overlay */}
        {isSubmitted && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-[color-mix(in_srgb,var(--color-motif-cream)_90%,white)]">
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-motif-soft">
                <Sparkles className="h-8 w-8" style={{ color: textColor }} />
              </div>
              <p className="font-semibold text-lg" style={{ color: cardTextColor }}>Sent!</p>
            </div>
          </div>
        )}
        
        <CardContent className="relative p-3 sm:p-5 md:p-6 lg:p-8 xl:p-10">
          {/* Header with icon */}
          <div className="text-center mb-3 sm:mb-4 md:mb-5 lg:mb-6">
            <div className="relative inline-block mb-2 sm:mb-3 md:mb-4">
              <div className="absolute inset-0 rounded-full bg-motif-accent/30 blur-lg scale-150" />
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto shadow-lg bg-motif-soft">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" style={{ color: textColor }} />
              </div>
            </div>
            <h3 className={`${cinzel.className} text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2`} style={{ color: cardTextColor }}>
              Share Your Love
            </h3>
            <p className={`${cormorant.className} text-[10px] sm:text-xs md:text-sm`} style={{ color: cardTextColor, opacity: 0.85 }}>
              Your words will be part of {coupleDisplayName}&apos;s keepsake for years to come.
            </p>
          </div>

          <form 
            ref={formRef} 
            onSubmit={handleSubmit} 
            className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            {/* Name Field */}
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <label className={`${cormorant.className} block text-xs sm:text-sm md:text-base font-medium flex items-center gap-1.5 sm:gap-2`} style={{ color: cardTextColor }}>
                <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-all duration-300 ${focusedField === 'name' ? 'scale-110' : ''}`} style={{ backgroundColor: 'color-mix(in srgb, var(--color-motif-accent) 18%, transparent)' }}>
                  <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" style={{ color: accentColor }} />
                </div>
                Your Name
              </label>
              <div className="relative">
                <Input
                  name="name"
                  required
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Full Name"
                  className={`${cormorant.className} message-form-input w-full border-2 rounded-xl py-2 sm:py-2.5 md:py-3 lg:py-3.5 px-3 sm:px-4 md:px-5 text-xs sm:text-sm md:text-base placeholder:italic transition-all duration-300 bg-white shadow-sm hover:shadow-md focus:shadow-lg ${
                    focusedField === 'name' 
                      ? 'border-motif-soft focus:border-motif-soft focus:ring-4 focus:ring-motif-accent/25 shadow-lg' 
                      : 'border-motif-accent/40 hover:border-motif-accent/50'
                  }`}
                  style={{ color: cardTextColor }}
                />
                {nameValue && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <label className={`${cormorant.className} block text-xs sm:text-sm md:text-base font-medium flex items-center gap-1.5 sm:gap-2`} style={{ color: cardTextColor }}>
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-all duration-300 ${focusedField === 'message' ? 'scale-110' : ''}`} style={{ backgroundColor: 'color-mix(in srgb, var(--color-motif-accent) 18%, transparent)' }}>
                    <MessageCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" style={{ color: accentColor }} />
                  </div>
                  Your Message
                </label>
                {messageValue && (
                  <span className={`${cormorant.className} text-[10px] sm:text-xs transition-colors ${messageValue.length > 500 ? 'text-red-500' : ''}`} style={messageValue.length <= 500 ? { color: cardTextColor, opacity: 0.6 } : undefined}>
                    {messageValue.length}/500
                  </span>
                )}
              </div>
              <div className="relative">
                <Textarea
                  name="message"
                  required
                  value={messageValue}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setMessageValue(e.target.value)
                    }
                  }}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  placeholder={`Write a heartfelt message for ${coupleDisplayName}... share your wishes, memories, or words of love that will be treasured forever 💕`}
                  className={`${cormorant.className} message-form-textarea w-full border-2 rounded-xl min-h-[80px] sm:min-h-[100px] md:min-h-[120px] text-xs sm:text-sm md:text-base placeholder:italic placeholder:leading-relaxed transition-all duration-300 resize-none bg-white shadow-sm hover:shadow-md focus:shadow-lg py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 ${
                    focusedField === 'message' 
                      ? 'border-motif-soft focus:border-motif-soft focus:ring-4 focus:ring-motif-accent/25 shadow-lg' 
                      : 'border-motif-accent/40 hover:border-motif-accent/50'
                  }`}
                  style={{ color: cardTextColor }}
                />
                {messageValue && (
                  <div className="absolute right-3 top-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !nameValue.trim() || !messageValue.trim()}
              className={`${cormorant.className} ${primaryBtnClass} w-full rounded-xl py-2 sm:py-2.5 md:py-3 lg:py-3.5 px-4 sm:px-5 md:px-6 lg:px-7 text-xs sm:text-sm md:text-base font-semibold hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group`}
              style={{ backgroundColor: 'var(--color-motif-soft)', color: '#FFFFFF' }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#FFFFFF' }} />
                  Send Message
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function Messages() {
  const siteConfig = useSiteConfig()
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMessages = useCallback(() => {
    setLoading(true)
    fetch("/api/messages", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.warn("Unexpected messages response; expected an array", data)
          setMessages([])
          setLoading(false)
          return
        }
        
        const parsed = data
          .filter((m) => m.name || m.message || m.timestamp)
          .reverse()
        setMessages(parsed)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch messages:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return (
    <Section
      id="messages"
      className="relative overflow-hidden"
    >
      {/* Corner floral decoration - white (same as welcome/countdown) */}
      {/* <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-60 scale-y-[-1]" priority={false} style={{ filter: DECO_FILTER }} />
      </div> */}
      {/* <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-60 scale-x-[-1] scale-y-[-1]" priority={false} style={{ filter: DECO_FILTER }} />
      </div> */}
      {/* <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <Image src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-60" priority={false} style={{ filter: DECO_FILTER }} />
      </div> */}
      {/* <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <Image src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-60 scale-x-[-1]" priority={false} style={{ filter: DECO_FILTER }} />
      </div> */}

      <div className="relative z-10 max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <div className="space-y-2 sm:space-y-2.5">
            <p
              className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm uppercase tracking-[0.28em]`}
              style={{ color: textColor }}
            >
              Messages for {coupleDisplayName}
            </p>
            <MotifDivider />
            <h2
              className={`${cinzel.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl`}
              style={{ color: textColor }}
            >
              Love notes &amp; prayers
            </h2>
          </div>
          <p
            className={`${cormorant.className} text-xs sm:text-sm md:text-base font-light max-w-3xl mx-auto leading-relaxed px-2 sm:px-4 mt-2`}
            style={{ color: textColor }}
          >
            Leave a short note for {coupleDisplayName}. Every wish and prayer becomes part of their forever story.
          </p>
        </div>

        {/* Form Section */}
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <div className="relative max-w-xl w-full">
            {/* Card halo */}
            {/* <div className="absolute -inset-3 bg-gradient-to-br from-[#B28383]/25 via-[#EDD6AC]/20 to-transparent rounded-3xl blur-2xl opacity-70" />
            <div className="absolute -inset-1 bg-gradient-to-br from-[#A78256]/15 via-transparent to-transparent rounded-3xl blur-md opacity-80" /> */}
            <MessageForm onMessageSent={fetchMessages} />
            {/* Corner sparkles */}
            {/* <div className="pointer-events-none">
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#BB8A3D] rounded-full blur-[2px] opacity-80" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#CDAC77] rounded-full blur-[2px] opacity-80" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#CDAC77] rounded-full blur-[2px] opacity-70" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#BB8A3D] rounded-full blur-[2px] opacity-70" />
            </div> */}
          </div>
        </div>

        {/* Messages Display Section */}
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <div className="relative inline-block mb-3 sm:mb-4 md:mb-6">
              <div className="absolute inset-0 rounded-full bg-motif-accent/30 blur-xl scale-150 animate-pulse-slow" />
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform duration-300 bg-motif-soft">
                <MessageCircle className="h-4 w-4 sm:h-6 sm:h-6 md:h-8 md:w-8" style={{ color: textColor }} />
              </div>
              <div className="absolute -inset-2 rounded-full bg-motif-accent/20 blur-md opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h3
              className={`${cinzel.className} text-lg sm:text-xl md:text-2xl font-bold mb-1.5 sm:mb-2 md:mb-3`}
              style={{ color: textColor }}
            >
              Messages from Loved Ones
            </h3>
            <p
              className={`${cormorant.className} text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-2 sm:px-4`}
              style={{ color: textColor }}
            >
              Read the beautiful messages shared by family and friends
            </p>
          </div>
          
          <MessageWallDisplay messages={messages} loading={loading} />
        </div>

      </div>
    </Section>
  )
}
