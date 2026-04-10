'use client'

import type { MomentData } from '@/types'

interface Props {
  data: MomentData
  onViewNote: () => void
  onBack: () => void
}

export default function PostedScreen({ data, onViewNote, onBack }: Props) {
  return (
    <div className="relative flex flex-col h-full overflow-hidden animate-screen-in" style={{ background: '#f7f5f6' }}>

      {/* Ripple orbs — blurry filled circles growing and fading */}
      {[0, 0.3, 0.6, 0.9, 1.2, 1.5].map((delay, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 2400,
            height: 2400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(254,1,56,1) 0%, rgba(254,1,56,0.7) 40%, rgba(254,1,56,0) 70%)',
            filter: 'blur(20px)',
            animation: `ripple-out 4.05s ease-out ${delay}s infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col h-full px-6">

        {/* Back button */}
        <div className="pt-[48px]">
          <button
            onClick={onBack}
            className="flex items-center gap-3 transition-opacity hover:opacity-70"
          >
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide relative top-[1px]">Back</span>
          </button>
        </div>

        {/* Vertically centred text */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="font-mono text-[#2c2c2c] leading-tight mb-3" style={{ fontSize: 36, lineHeight: 1.15 }}>
            Your note is now live
          </h1>
          <p className="font-sans text-[#3a3a3a] text-[16px] leading-[1.2]" style={{ width: '60%' }}>
            You&apos;ve done your bit. Now let the universe do its thing.
          </p>
        </div>

        {/* Actions */}
        <div className="pb-8">
          <button
            onClick={onViewNote}
            className="w-full py-[15px] bg-almost-pink text-white font-sans text-[16px] text-center transition-opacity hover:opacity-90 active:opacity-80 rounded-full"
          >
            View your note
          </button>
        </div>
      </div>
    </div>
  )
}
