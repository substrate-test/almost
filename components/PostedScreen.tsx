'use client'

import type { MomentData } from '@/types'

interface Props {
  data: MomentData
  onViewNote: () => void
  onRestart: () => void
}

export default function PostedScreen({ data, onViewNote, onRestart }: Props) {
  return (
    <div className="relative flex flex-col h-full overflow-hidden animate-screen-in" style={{ background: '#f7f5f6' }}>

      {/* Pulsating orb — centred */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(254,1,56,1) 0%, rgba(254,1,56,0.7) 38%, rgba(254,1,56,0.15) 65%, rgba(254,1,56,0) 75%)',
          filter: 'blur(12px)',
          animation: 'orb-pulse 2s ease-in-out infinite',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="relative z-10 flex flex-col h-full px-6">

        {/* Vertically centred text */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="font-sans text-[#2c2c2c] text-[11px] tracking-widest uppercase opacity-60 mb-4">
            Your note is live
          </p>
          <h1 className="font-mono text-[#2c2c2c] leading-tight mb-3" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
            It&apos;s out there!
          </h1>
          <p className="font-sans text-[#3a3a3a] text-[16px] leading-[1.2]">
            If they were there and they&apos;re looking, they&apos;ll find it.
          </p>
        </div>

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
