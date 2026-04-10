'use client'

import { useState } from 'react'

export default function RegisterAuthScreen({ onDone, onSkip }: { onDone: () => void; onSkip?: () => void }) {
  const [showEmail, setShowEmail] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

  return (
    <div className="relative flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      {onSkip && (
        <button onClick={onSkip} className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-20 h-20 opacity-0" aria-label="Skip to app" />
      )}
      <div className="flex flex-col h-full px-6">
        <div className="flex-1 flex flex-col justify-center">

          <h1 className="font-mono text-[#2c2c2c] leading-tight mb-3" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
            Almost? Finally.
          </h1>

          <p className="font-sans text-[#9d9d9d] text-[16px] leading-[1.5] mb-8 mt-3">
            By continuing you accept our terms of use. Please see our privacy policy which defines how we use your personal information.
          </p>

          {/* Primary auth buttons */}
          <div className="flex flex-col gap-3 mb-4">
            <button
              onClick={onDone}
              className="w-full flex items-center gap-3 px-5 py-4 bg-white border border-[#e0e0e0] rounded-full font-sans text-[16px] text-[#2c2c2c] hover:border-[#d0d0d0] transition-all duration-200"
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
              className="w-full flex items-center gap-3 px-5 py-4 bg-white border border-[#e0e0e0] rounded-full font-sans text-[16px] text-[#2c2c2c] hover:border-[#d0d0d0] transition-all duration-200"
            >
              <img src="/Apple_logo_black.svg" width="18" height="18" alt="" />
              Continue with Apple
            </button>
          </div>

          {/* Secondary auth — phone + email side by side */}
          <div className="flex gap-3">
            <button
              onClick={() => { setShowPhone(true); setShowEmail(false) }}
              className="flex-1 py-3 bg-white border border-[#e0e0e0] rounded-full font-sans text-[14px] text-[#5d5d5d] hover:border-[#d0d0d0] transition-all duration-200"
            >
              Phone
            </button>
            <button
              onClick={() => { setShowEmail(true); setShowPhone(false) }}
              className="flex-1 py-3 bg-white border border-[#e0e0e0] rounded-full font-sans text-[14px] text-[#5d5d5d] hover:border-[#d0d0d0] transition-all duration-200"
            >
              Email
            </button>
          </div>

          {/* Inline phone input */}
          {showPhone && (
            <div className="flex flex-col gap-2 mt-3">
              <input
                type="tel"
                placeholder="+44 7700 900000"
                autoFocus
                className="w-full bg-white border border-[#e0e0e0] rounded-full px-5 py-4 font-sans text-[16px] text-[#2c2c2c] placeholder:text-[#aaa]"
              />
              <button onClick={onDone} className="w-full py-4 bg-almost-pink text-white font-sans text-[16px] rounded-full transition-opacity hover:opacity-90">
                Send code
              </button>
            </div>
          )}

          {/* Inline email input */}
          {showEmail && (
            <div className="flex flex-col gap-2 mt-3">
              <input
                type="email"
                placeholder="you@example.com"
                autoFocus
                className="w-full bg-white border border-[#e0e0e0] rounded-full px-5 py-4 font-sans text-[16px] text-[#2c2c2c] placeholder:text-[#aaa]"
              />
              <button onClick={onDone} className="w-full py-4 bg-almost-pink text-white font-sans text-[16px] rounded-full transition-opacity hover:opacity-90">
                Continue
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
