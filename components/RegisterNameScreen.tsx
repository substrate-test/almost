'use client'

import { useState } from 'react'

interface Props {
  onBack: () => void
  onNext: (name: string) => void
}

export default function RegisterNameScreen({ onBack, onNext, onSkip }: Props & { onSkip?: () => void }) {
  const [name, setName] = useState('')
  const canContinue = name.trim().length > 0

  return (
    <div className="relative flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      {process.env.NODE_ENV === 'development' && onSkip && (
        <button onClick={onSkip} className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-20 h-20 opacity-0" aria-label="Skip to app" />
      )}
      <div className="flex flex-col h-full px-6">
        <div className="pt-[48px]">
          <button onClick={onBack} className="flex items-center gap-3 transition-opacity hover:opacity-70">
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide relative top-[1px]">Back</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h1 className="font-mono text-[#2c2c2c] leading-tight mb-2" style={{ fontSize: 36, lineHeight: 1.15 }}>
            What&apos;s your name?
          </h1>
          <p className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2] mb-8">
            Just your first name is fine.
          </p>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && canContinue && onNext(name.trim())}
            placeholder="Your name"
            autoFocus
            className="w-full bg-white rounded-xl px-5 py-4 font-sans text-[16px] text-[#2c2c2c] placeholder:text-[#aaa] focus:outline-none"
          />
        </div>

        <div className="pb-8">
          <button
            onClick={() => canContinue && onNext(name.trim())}
            disabled={!canContinue}
            className="w-full py-[15px] text-white font-sans text-[16px] text-center transition-all duration-200 disabled:cursor-not-allowed active:opacity-80 rounded-full"
            style={{ background: canContinue ? '#FE0155' : '#a0a0a0' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
