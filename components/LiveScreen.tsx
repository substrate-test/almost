'use client'

import { useState, useEffect } from 'react'
import type { MomentData } from '@/types'
import { formatDate, WINDOW_HOURS } from '@/lib/data'

interface Props {
  data: MomentData
  onBack: () => void
  onPost: () => void
}


export default function LiveScreen({ data, onBack, onPost }: Props) {
  const submittedAt = data.submittedAt ?? new Date()
  const expiresAt = new Date(submittedAt.getTime() + WINDOW_HOURS * 60 * 60 * 1000)
  const [msLeft, setMsLeft] = useState(() => expiresAt.getTime() - Date.now())

  useEffect(() => {
    const tick = setInterval(() => {
      const remaining = expiresAt.getTime() - Date.now()
      setMsLeft(remaining <= 0 ? 0 : remaining)
      if (remaining <= 0) clearInterval(tick)
    }, 1000)
    return () => clearInterval(tick)
  }, [expiresAt])

  const noteText = data.text
    || `You were quietly crying in the queue, hiding it behind your hair. I handed you my drink and you laughed. We talked for almost an hour.\n\nI loved the way you touched your collarbone when you were thinking. You smelled like something floral I still can't place. 🌸 I've been thinking about you ever since.`

  return (
    <div className="flex flex-col h-full bg-almost-bg animate-screen-in px-6">
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

      <h2 className="font-sans text-almost-text leading-tight mb-2" style={{ fontSize: 'clamp(26px, 7vw, 32px)' }}>
        Preview your note.
      </h2>
      <p className="font-mono text-almost-secondary text-sm mb-6">
        Looks good? Post it and let them find you.
      </p>

      {/* Note card */}
      <div
        className="flex-1 flex flex-col px-6 py-6 overflow-hidden"
        style={{
          backgroundColor: '#141414',
          backgroundImage: `
            repeating-linear-gradient(
              to right,
              transparent,
              transparent 34px,
              rgba(255,255,255,0.06) 34px,
              rgba(255,255,255,0.06) 35px
            ),
            repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 34px,
              rgba(255,255,255,0.06) 34px,
              rgba(255,255,255,0.06) 35px
            )
          `,
        }}
      >
        {/* Note text */}
        <p className="font-sans text-almost-text text-[20px] leading-[1.75] flex-1 overflow-y-auto whitespace-pre-wrap">
          &ldquo;{noteText}&rdquo;
        </p>

        {/* Chips row */}
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

      {/* CTA */}
      <div className="pb-8 pt-5">
        <button
          onClick={onPost}
          className="w-full py-[15px] bg-almost-pink text-white font-mono text-[15px] text-center transition-opacity hover:opacity-90 active:opacity-80"
        >
          Post your note
        </button>
      </div>
    </div>
  )
}
