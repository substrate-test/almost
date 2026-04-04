'use client'

import type { MomentData } from '@/types'

interface Props {
  data: MomentData
  onViewNote: () => void
  onRestart: () => void
}

export default function PostedScreen({ data, onViewNote, onRestart }: Props) {
  return (
    <div className="flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      <div className="flex flex-col h-full px-6">
        {/* Header */}
        <div className="pt-[48px] pb-[60px]">
          <p className="font-sans text-almost-pink text-[11px] tracking-widest uppercase">
            Your note is live
          </p>
        </div>

        <h1 className="font-mono text-[#2c2c2c] leading-tight mb-2" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
          It&apos;s out there.
        </h1>
        <p className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2] mb-6">
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
            className="w-full py-3 font-sans text-[#7b7b7b] text-[14px] text-center transition-colors hover:text-[#5d5d5d]"
          >
            Back to start
          </button>
        </div>
      </div>
    </div>
  )
}
