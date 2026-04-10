'use client'

import { useState, useEffect } from 'react'
import LavaBackground from '@/components/LavaBackground'

export default function LandingScreen({ onNext, onSkip }: { onNext: () => void; onSkip?: () => void }) {
  const [logoVisible, setLogoVisible] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  const [textVisible, setTextVisible] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLogoVisible(true), 400)
    const t2 = setTimeout(() => setTextVisible(true), 1000)
    const t3 = setTimeout(() => setTextVisible(false), 3500)
    const t4 = setTimeout(() => { setTextIndex(1); setTextVisible(true) }, 4500)
    const t5 = setTimeout(() => setCtaVisible(true), 5500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5) }
  }, [])

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: '#bcbcbc' }}>
      {onSkip && (
        <button
          onClick={onSkip}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-20 h-20 opacity-0"
          aria-label="Skip to app"
        />
      )}
      <LavaBackground blobCount={2} speed={0.3} threshold={0.8} className="absolute inset-0 w-full h-full" />

      {/* Logo + tagline — dead center */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="relative w-[86%] max-w-[355px]">
          <img
            src="/AlmostLogoWhite.svg"
            alt="almost"
            className="w-full"
            style={{ opacity: logoVisible ? 1 : 0, transition: 'opacity 1s ease' }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 font-mono text-[#2c2c2c] text-[18px] text-center"
            style={{ top: '75%', width: '50vw', opacity: textVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}
          >
            {textIndex === 0 ? (
              <p className="leading-[1]">For the ones that almost got away.</p>
            ) : (
              <div className="leading-snug">
                <p>No profiles.</p>
                <p>No photos.</p>
                <p>Just real chemistry.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA — bottom */}
      <div className="relative mt-auto px-8 pb-8 z-30">
        <div className="h-[52px] flex items-center justify-center">
          {ctaVisible && (
            <button
              onClick={onNext}
              className="w-full py-[15px] bg-almost-pink text-white font-sans text-[15px] text-center hover:opacity-90 active:opacity-80 animate-fade-in rounded-full"
            >
              Find your person
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
