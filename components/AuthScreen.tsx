'use client'

import { useState } from 'react'

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
    <div className="flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      <div className="flex flex-col h-full px-6">
        {/* Header */}
        <div className="pt-[48px] pb-[60px] flex items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-3 transition-opacity hover:opacity-70"
          >
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide relative top-[1px]">Back</span>
          </button>
        </div>

        <h1 className="font-mono text-[#2c2c2c] leading-tight mb-2" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
          {title}
        </h1>
        <p className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2] mb-8">
          {description}
        </p>

        {/* SSO options */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={onDone}
            className="w-full flex items-center gap-3 px-5 py-4 bg-white border border-[#e0e0e0] rounded-xl font-sans text-[16px] text-[#2c2c2c] hover:border-[#d0d0d0] transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={onDone}
            className="w-full flex items-center gap-3 px-5 py-4 bg-white border border-[#e0e0e0] rounded-xl font-sans text-[16px] text-[#2c2c2c] hover:border-[#d0d0d0] transition-all duration-200"
          >
            <img src="/Apple_logo_black.svg" width="18" height="18" alt="" />
            Continue with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#e0e0e0]" />
          <span className="font-sans text-[#7b7b7b] text-[11px] tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-[#e0e0e0]" />
        </div>

        {/* Phone / Email toggle */}
        <div className="flex gap-2 mb-4">
          {(['phone', 'email'] as Method[]).map(m => (
            <button
              key={m}
              onClick={() => { setMethod(m); setValue('') }}
              className={`flex-1 py-3 font-sans text-[16px] transition-all duration-200 border rounded-xl ${
                method === m
                  ? 'border-almost-pink/40 text-almost-pink bg-white'
                  : 'border-[#e0e0e0] text-[#7b7b7b] bg-white hover:border-[#d0d0d0]'
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
              className="w-full bg-white border border-[#e0e0e0] rounded-xl px-5 py-4 font-sans text-[16px] text-[#2c2c2c] placeholder:text-[#7b7b7b] focus:border-almost-pink/40 transition-colors duration-200"
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
              className="w-full py-[15px] font-sans text-[16px] text-center text-white transition-all duration-200 disabled:cursor-not-allowed active:opacity-80 rounded-full"
              style={{ background: canContinue ? '#FE0155' : '#a0a0a0' }}
            >
              {cta}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
