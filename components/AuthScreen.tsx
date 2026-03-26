'use client'

import { useState } from 'react'
import LavaBackground from '@/components/LavaBackground'

interface Props {
  onBack: () => void
  onDone: () => void
  title?: string
  description?: string
  cta?: string
}

type Method = 'phone' | 'email' | null

export default function AuthScreen({ onBack, onDone, title = 'One last step.', description = "We'll notify you the moment someone claims your note. No feed, no followers — just a tap when it matters.", cta = 'Post my note' }: Props) {
  const [method, setMethod] = useState<Method>(null)
  const [value, setValue] = useState('')

  const canContinue = value.trim().length > 0

  return (
    <div className="relative h-full animate-screen-in overflow-hidden">
      <LavaBackground blobCount={2} speed={0.6} threshold={0.8} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative flex flex-col h-full px-6">
        {/* Header */}
        <div className="pt-[48px] pb-[60px] flex items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-white font-sans text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        </div>

        <h2 className="font-mono text-almost-text leading-tight mb-2" style={{ fontSize: 'clamp(26px, 7vw, 32px)' }}>
          {title}
        </h2>
        <p className="font-mono text-almost-secondary text-sm mb-8">
          {description}
        </p>

        {/* SSO options */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={onDone}
            className="w-full flex items-center gap-3 px-5 py-4 bg-[rgba(20,20,20,0.85)] border border-almost-border font-mono text-sm text-almost-text hover:border-almost-border/60 hover:bg-white/[0.04] transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="white"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="white"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="white"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="white"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={onDone}
            className="w-full flex items-center gap-3 px-5 py-4 bg-[rgba(20,20,20,0.85)] border border-almost-border font-mono text-sm text-almost-text hover:border-almost-border/60 hover:bg-white/[0.04] transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 814 1000" fill="white">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.5-57.8-155.5-127.4C46 336.8 17.5 247.9 17.5 183.8c0-113.9 74.4-174.3 147.4-174.3 73.9 0 127.4 48.4 170.3 48.4 41 0 103.3-51.3 184.3-51.3 20.7 0 107.2 1.9 170.9 75.6zm-126.7-74.7c-34.3-41.9-84-70.5-136-70.5-17.5 0-34.3 1.9-50.4 6.4 30.8 40.8 48.4 91.6 48.4 141.3 0 6.4-.6 12.8-1.3 19.2 6.4.6 12.8 1.3 19.2 1.3 47.8 0 99.8-27.3 120.1-97.7z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-almost-border" />
          <span className="font-mono text-almost-muted text-[11px] tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-almost-border" />
        </div>

        {/* Phone / Email toggle */}
        <div className="flex gap-2 mb-4">
          {(['phone', 'email'] as Method[]).map(m => (
            <button
              key={m}
              onClick={() => { setMethod(m); setValue('') }}
              className={`flex-1 py-3 font-mono text-xs tracking-widest uppercase transition-all duration-200 border ${
                method === m
                  ? 'border-almost-pink/40 text-almost-pink bg-[rgba(254,1,85,0.08)]'
                  : 'border-almost-border text-almost-muted bg-[rgba(20,20,20,0.85)] hover:border-almost-border/60'
              }`}
            >
              {m === 'phone' ? 'Phone' : 'Email'}
            </button>
          ))}
        </div>

        {method && (
          <div className="animate-fade-in">
            <input
              type={method === 'phone' ? 'tel' : 'email'}
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={method === 'phone' ? '+44 7700 000000' : 'you@example.com'}
              autoFocus
              className="w-full bg-[rgba(20,20,20,0.85)] border border-almost-border px-5 py-4 font-mono text-sm text-almost-text placeholder:text-almost-muted focus:border-almost-pink/40 transition-colors duration-200"
            />
          </div>
        )}

        <div className="flex-1" />

        {/* CTA */}
        {method && (
          <div className="pb-8 animate-fade-in">
            <button
              onClick={() => canContinue && onDone()}
              disabled={!canContinue}
              className="w-full py-[15px] font-mono text-[15px] text-center text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:opacity-80"
              style={{ background: canContinue ? '#FE0155' : 'rgba(254,1,85,0.2)' }}
            >
              {cta}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
