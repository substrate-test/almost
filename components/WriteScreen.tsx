'use client'

import { useState, useRef, useEffect } from 'react'
import type { Venue } from '@/types'
import { formatDate } from '@/lib/data'
import LavaBackground from '@/components/LavaBackground'

const MAX_CHARS = 280

interface Props {
  venue?: Venue
  datetime?: Date
  onBack: () => void
  onNext: (text: string) => void
}

export default function WriteScreen({ venue, datetime, onBack, onNext }: Props) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const t = setTimeout(() => textareaRef.current?.focus(), 350)
    return () => clearTimeout(t)
  }, [])

  const remaining = MAX_CHARS - text.length
  const isOver = remaining < 0
  const canSubmit = text.trim().length > 0 && !isOver

  return (
    <div className="relative h-full animate-screen-in overflow-hidden">
      <LavaBackground blobCount={2} speed={0.6} threshold={0.8} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative flex flex-col h-full px-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-[48px] pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-white font-sans text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <span className="font-sans text-almost-muted text-xs font-medium tracking-widest uppercase ml-auto">
            3 of 3
          </span>
        </div>

        <h2 className="font-mono text-[30px] leading-tight text-almost-text mb-2">
          Your moment.
        </h2>
        <p className="font-mono text-almost-secondary text-sm mb-5">
          Relive that moment — describe the connection, the music, anything they might remember you by.
        </p>

        {/* Note card — identical to the live preview */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            backgroundColor: '#141414',
            backgroundImage: `
              repeating-linear-gradient(to right, transparent, transparent 34px, rgba(255,255,255,0.06) 34px, rgba(255,255,255,0.06) 35px),
              repeating-linear-gradient(to bottom, transparent, transparent 34px, rgba(255,255,255,0.06) 34px, rgba(255,255,255,0.06) 35px)
            `,
          }}
        >
          {/* Textarea fills the card */}
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="This is your shot…"
              maxLength={MAX_CHARS + 10}
              className="absolute inset-0 w-full h-full bg-transparent px-6 pt-6 pb-3 font-sans text-[20px] leading-[1.75] text-almost-text placeholder:text-[#505050] placeholder:font-light resize-none focus:outline-none"
            />
            {remaining <= 60 && (
              <div className={`absolute bottom-3 right-5 font-mono text-xs tabular-nums ${isOver ? 'text-red-400' : remaining <= 20 ? 'text-almost-pink' : 'text-almost-muted'}`}>
                {remaining}
              </div>
            )}
          </div>

          {/* Chips — identical to note preview */}
          <div className="flex items-center gap-1.5 px-6 pb-5 mt-2 min-w-0">
            {venue && (
              <span className="bg-black/50 px-2.5 py-[5px] font-mono text-[11px] text-white/70 truncate min-w-0">
                {venue.name}
              </span>
            )}
            {datetime && (
              <span className="bg-black/50 px-2.5 py-[5px] font-mono text-[11px] text-white/70 shrink-0">
                {formatDate(datetime)}
              </span>
            )}
            <span className="bg-black/50 px-2.5 py-[5px] font-mono text-[11px] text-almost-pink/80 shrink-0 ml-auto">
              24:00:00
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="pb-8 mt-5">
          <button
            onClick={() => canSubmit && onNext(text.trim())}
            disabled={!canSubmit}
            className="w-full py-[15px] text-white font-mono text-[15px] text-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:opacity-80"
            style={{ background: canSubmit ? '#FE0155' : 'rgba(254,1,85,0.2)' }}
          >
            Put it out there
          </button>
        </div>
      </div>
    </div>
  )
}
