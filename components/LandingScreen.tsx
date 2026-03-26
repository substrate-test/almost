'use client'

import { useState, useEffect } from 'react'

const TEXTS = [
  'For the ones who almost found each other.',
  'No profiles. No photos.\nJust real chemistry.',
]

export default function LandingScreen({ onNext }: { onNext: () => void }) {
  const [logoVisible, setLogoVisible]   = useState(false)
  const [textIndex, setTextIndex]       = useState(0)
  const [textVisible, setTextVisible]   = useState(false)
  const [spinnerVisible, setSpinnerVisible] = useState(false)
  const [ctaVisible, setCtaVisible]     = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLogoVisible(true),    300)   // logo fades in
    const t2 = setTimeout(() => setTextVisible(true),    1400)  // first text fades in
    const t3 = setTimeout(() => setTextVisible(false),   3500)  // first text fades out
    const t4 = setTimeout(() => { setTextIndex(1); setTextVisible(true) }, 4600) // second text fades in
    const t5 = setTimeout(() => setSpinnerVisible(true), 6200)  // spinner appears
    const t6 = setTimeout(() => { setSpinnerVisible(false); setCtaVisible(true) }, 8000) // CTA loads
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6)
    }
  }, [])

  return (
    <div className="relative flex flex-col h-full bg-almost-bg overflow-hidden">
      {/* Full-bleed background photo */}
      <img
        src="/Background6.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />

      {/* 20% black overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Logo + text — dead center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 z-20">
        <img
          src="/Logo New.svg"
          alt="almost"
          className="w-[86%] max-w-[355px]"
          style={{ opacity: logoVisible ? 1 : 0, transition: 'opacity 1s ease' }}
        />

        <p
          className="font-mono text-white text-[17px] leading-[1.6] text-center whitespace-pre-line"
          style={{ opacity: textVisible ? 0.8 : 0, transition: 'opacity 1s ease' }}
        >
          {TEXTS[textIndex]}
        </p>
      </div>

      {/* Spinner + CTA — bottom */}
      <div className="relative mt-auto px-8 pb-8 z-30">
        <div className="h-[52px] flex items-center justify-center">
          {spinnerVisible && !ctaVisible && (
            <div
              className="w-6 h-6 rounded-full border-2 border-almost-pink/30 border-t-almost-pink animate-spin"
              style={{ opacity: spinnerVisible ? 1 : 0, transition: 'opacity 0.6s ease' }}
            />
          )}
          {ctaVisible && (
            <button
              onClick={onNext}
              className="w-full py-[15px] bg-almost-pink text-white font-mono text-[15px] text-center hover:opacity-90 active:opacity-80 animate-fade-in"
            >
              Find your connection
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
