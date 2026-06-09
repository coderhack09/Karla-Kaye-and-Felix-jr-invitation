'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSiteConfig } from '@/hooks/use-site-config';
import Image from 'next/image';

interface HeroProps {
  onOpen: () => void;
  visible: boolean;
}

const palette = {
  cream: 'var(--color-motif-cream)',
  soft: 'var(--color-motif-soft)',
};

const textColor = 'color-mix(in srgb, var(--color-motif-cream) 50%, white)';


const BACKGROUND_VIDEO = '/background_music/backgroundLoop.mp4';

export const Hero: React.FC<HeroProps> = ({ onOpen, visible }) => {
  const siteConfig = useSiteConfig();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const play = () => {
      void video.play().catch(() => {});
    };

    play();
    video.addEventListener('loadeddata', play);
    return () => video.removeEventListener('loadeddata', play);
  }, [visible]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setContentVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      setContentVisible(false);
    }
  }, [visible]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gentleFloat {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-8px);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
      <div className={`fixed inset-0 z-30 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${visible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          src={BACKGROUND_VIDEO}
          aria-hidden
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 w-full max-w-md mx-auto h-full">
        
        {/* Top Logo/Monogram */}
        <div 
          className={`mb-auto mt-8 transition-all duration-1000 ease-out ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
            {/* Monogram Image with subtle animation */}
            <div 
              className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 transition-transform duration-700 ease-out hover:scale-105"
              style={{
                animation: contentVisible ? 'gentleFloat 3s ease-in-out infinite' : 'none'
              }}
            >
              <Image
                src={siteConfig.couple.monogram}
                alt="Monogram"
                fill
                className="object-contain"
                priority
                style={{
                  filter: 'brightness(0) saturate(100%) invert(100%) drop-shadow(0 8px 20px color-mix(in srgb, var(--color-motif-soft) 55%, transparent))',
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col items-center justify-end w-full gap-5 sm:gap-6 pb-14 sm:pb-16 md:pb-20">
          <h2
            className={`text-6xl md:text-8xl transform -rotate-6 transition-all duration-1000 ease-out delay-200 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: '"Great Vibes", cursive',
              fontWeight: 400,
              color: textColor,
              textShadow: '0 2px 10px color-mix(in srgb, var(--color-motif-soft) 40%, transparent)',
            }}
          >
            You are
          </h2>
          
          <h1
            className={`text-5xl md:text-7xl font-bold tracking-wider uppercase transition-all duration-1000 ease-out delay-300 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              color: textColor,
              textShadow: '0 2px 12px color-mix(in srgb, var(--color-motif-soft) 45%, transparent)',
              letterSpacing: '0.05em',
            }}
          >
            Invited!
          </h1>

          <button 
            onClick={() => {
              onOpen();
            }}
            className={`px-10 py-4 font-serif text-sm tracking-[0.2em] uppercase rounded-sm border transition-all duration-500 ease-out delay-500 shadow-lg hover:shadow-xl ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              backgroundColor: palette.soft,
              borderColor: palette.cream,
              color: textColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = palette.cream;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = palette.soft;
              e.currentTarget.style.color = palette.soft;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = palette.soft;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = palette.cream;
              e.currentTarget.style.color = textColor;
            }}
          >
            <span
              style={{ fontFamily: '"Cinzel", serif', fontWeight: 500, letterSpacing: '0.18em' }}
            >
              Open Invitation
            </span>
          </button>
        </div>

        {/* Bottom Spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
};