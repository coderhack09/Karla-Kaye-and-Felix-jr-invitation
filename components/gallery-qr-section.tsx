"use client"

import { CloudinaryImage } from "@/components/ui/cloudinary-image"

export function GalleryQRSection() {
  return (
    <div className="mt-8 sm:mt-12 md:mt-16 text-center max-w-2xl mx-auto">
      <div className="bg-[#EDD6AC]/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-[#A78256]/30 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="relative">
          {/* Corner accents - hidden on mobile */}
          <div className="hidden sm:block absolute -top-7 -left-7 w-4 h-4 border-t-2 border-l-2 border-[#A78256] rounded-tl-lg" />
          <div className="hidden sm:block absolute -top-7 -right-7 w-4 h-4 border-t-2 border-r-2 border-[#A78256] rounded-tr-lg" />
          <div className="hidden sm:block absolute -bottom-7 -left-7 w-4 h-4 border-b-2 border-l-2 border-[#A78256] rounded-bl-lg" />
          <div className="hidden sm:block absolute -bottom-7 -right-7 w-4 h-4 border-b-2 border-r-2 border-[#A78256] rounded-br-lg" />

          {/* Capture the Love Image */}
          <div className="relative w-full rounded-xl overflow-hidden shadow-lg">
            <CloudinaryImage
              src="/Couple_img/Capture the Love.png"
              alt="Capture the Love"
              width={800}
              height={533}
              className="w-full h-auto object-contain"
              priority={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

