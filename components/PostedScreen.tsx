'use client'

import type { MomentData } from '@/types'
import { formatDate } from '@/lib/data'

interface Props {
  data: MomentData
  onViewNote: () => void
  onRestart: () => void
}

export default function PostedScreen({ data, onViewNote, onRestart }: Props) {
  const noteText = data.text || ''

  return (
    <div className="flex flex-col h-full animate-screen-in bg-almost-bg">
      <div className="flex flex-col h-full px-6">
        {/* Header */}
        <div className="pt-[48px] pb-[60px]">
          <p className="font-mono text-almost-pink text-xs font-medium tracking-widest uppercase">
            Your note is live
          </p>
        </div>

        <h2 className="font-sans text-almost-text leading-tight mb-2" style={{ fontSize: 'clamp(26px, 7vw, 32px)' }}>
          It&apos;s out there.
        </h2>
        <p className="font-mono text-almost-secondary text-sm mb-6">
          If they were there and they&apos;re looking, they&apos;ll find it.
        </p>

        {/* Note card — identical to preview */}
        <div
          className="flex-1 flex flex-col px-6 py-6 overflow-hidden"
          style={{
            backgroundColor: '#141414',
            backgroundImage: `
              repeating-linear-gradient(to right, transparent, transparent 34px, rgba(255,255,255,0.06) 34px, rgba(255,255,255,0.06) 35px),
              repeating-linear-gradient(to bottom, transparent, transparent 34px, rgba(255,255,255,0.06) 34px, rgba(255,255,255,0.06) 35px)
            `,
          }}
        >
          <p className="font-sans text-almost-text text-[20px] leading-[1.75] flex-1 overflow-y-auto whitespace-pre-wrap">
            &ldquo;{noteText}&rdquo;
          </p>

          <div className="flex items-center gap-1.5 mt-5 min-w-0">
            {data.venue && (
              <span className="bg-black/50 px-2.5 py-[5px] font-mono text-[11px] text-white/70 truncate min-w-0">
                {data.venue.name}
              </span>
            )}
            {data.datetime && (
              <span className="bg-black/50 px-2.5 py-[5px] font-mono text-[11px] text-white/70 shrink-0">
                {formatDate(data.datetime)}
              </span>
            )}
            <span className="bg-black/50 px-2.5 py-[5px] font-mono text-[11px] text-almost-pink/80 shrink-0 ml-auto">
              24:00:00
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pb-8 pt-5 space-y-3">
          <button
            onClick={onViewNote}
            className="w-full py-[15px] bg-almost-pink text-white font-mono text-[15px] text-center transition-opacity hover:opacity-90 active:opacity-80"
          >
            View your note
          </button>
          <button
            onClick={onRestart}
            className="w-full py-3 font-mono text-almost-muted text-[14px] text-center transition-colors hover:text-almost-secondary"
          >
            Back to start
          </button>
        </div>
      </div>
    </div>
  )
}
