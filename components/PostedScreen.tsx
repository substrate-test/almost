'use client'

import type { MomentData } from '@/types'

interface Props {
  data: MomentData
  onViewNote: () => void
  onRestart: () => void
}

export default function PostedScreen({ data, onViewNote, onRestart }: Props) {
  return (
    <div className="relative flex flex-col h-full overflow-hidden animate-screen-in" style={{ background: '#bcbcbc' }}>

      {/* Pulsating orb */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(254,1,56,0.95) 0%, rgba(254,1,56,0.4) 45%, rgba(254,1,56,0) 72%)',
          filter: 'blur(18px)',
          animation: 'orb-pulse 2.6s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 flex flex-col h-full px-6">
        {/* Header */}
        <div className="pt-[48px] pb-[60px]">
          <p className="font-sans text-[#2c2c2c] text-[11px] tracking-widest uppercase opacity-60">
            Your note is live
          </p>
        </div>

        <h1 className="font-mono text-[#2c2c2c] leading-tight mb-2" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
          It&apos;s out there.
        </h1>
        <p className="font-sans text-[#3a3a3a] text-[16px] leading-[1.2] mb-6">
          If they were there and they&apos;re looking, they&apos;ll find it.
        </p>

        <div className="flex-1" />

        {/* Actions */}
        <div className="pb-8 space-y-3">
          <button
            onClick={onViewNote}
            className="w-full py-[15px] bg-almost-pink text-white font-sans text-[16px] text-center transition-opacity hover:opacity-90 active:opacity-80 rounded-full"
          >
            View your note
          </button>
          <button
            onClick={onRestart}
            className="w-full py-3 font-sans text-[#3a3a3a] text-[14px] text-center transition-colors hover:text-[#2c2c2c]"
          >
            Back to start
          </button>
        </div>
      </div>
    </div>
  )
}
