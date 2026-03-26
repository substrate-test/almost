'use client'

import { useState, useEffect } from 'react'
import type { Venue, Note } from '@/types'
import { notesForVenue, formatCountdown, formatDate, msLeft } from '@/lib/data'

interface Props {
  venue: Venue
  initialNoteId?: string
  onBack: () => void
  onRespond: (note: Note) => void
}

export default function BrowseNotesScreen({ venue, initialNoteId, onBack, onRespond }: Props) {
  const notes = notesForVenue(venue.id)
  const initialIndex = initialNoteId ? Math.max(0, notes.findIndex(n => n.id === initialNoteId)) : 0
  const [index, setIndex] = useState(initialIndex)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  if (notes.length === 0) {
    return (
      <div className="flex flex-col h-full animate-screen-in bg-almost-bg">
        <div className="flex flex-col h-full px-6">
        <div className="pt-[48px] pb-[60px] flex items-center">
          <button onClick={onBack} className="flex items-center gap-1.5 text-white font-sans text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-70">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <p className="font-mono text-almost-text text-[22px]">No notes here yet.</p>
          <p className="font-mono text-almost-secondary text-sm max-w-[260px]">
            Nothing live at {venue.name} right now. Check back later — or be the first to leave one.
          </p>
        </div>
        <div className="pb-8">
          <button onClick={onBack} className="w-full py-[15px] bg-almost-pink text-white font-mono text-[15px] text-center transition-opacity hover:opacity-90 active:opacity-80">
            Go back
          </button>
        </div>
      </div>
    </div>
    )
  }

  const note = notes[index]
  const remaining = msLeft(note)
  const isExpiringSoon = remaining < 2 * 3600 * 1000

  return (
    <div className="flex flex-col h-full animate-screen-in bg-almost-bg">
      <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-[48px] pb-6 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-white font-sans text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-70">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <span className="font-mono text-almost-muted text-xs font-medium tracking-widest uppercase">
          {index + 1} of {notes.length}
        </span>
      </div>

      {/* Note card — full screen */}
      <div className="flex-1 mx-6 flex flex-col overflow-hidden"
        style={{
          backgroundColor: '#141414',
          backgroundImage: `
            repeating-linear-gradient(to right, transparent, transparent 34px, rgba(255,255,255,0.06) 34px, rgba(255,255,255,0.06) 35px),
            repeating-linear-gradient(to bottom, transparent, transparent 34px, rgba(255,255,255,0.06) 34px, rgba(255,255,255,0.06) 35px)
          `,
        }}
      >
        <div className="flex-1 px-6 pt-6 pb-4 overflow-y-auto">
          <p className="font-sans text-almost-text text-[20px] leading-[1.75] whitespace-pre-wrap">
            &ldquo;{note.text}&rdquo;
          </p>
        </div>

        {/* Chips */}
        <div className="px-6 pb-5 flex items-center gap-1.5 min-w-0">
          <span className="bg-black/50 px-2.5 py-[5px] font-mono text-[11px] text-white/70 truncate min-w-0">
            {note.venue.name}
          </span>
          <span className="bg-black/50 px-2.5 py-[5px] font-mono text-[11px] text-white/70 shrink-0">
            {formatDate(note.datetime)}
          </span>
          <span className={`bg-black/50 px-2.5 py-[5px] font-mono text-[11px] shrink-0 ml-auto ${isExpiringSoon ? 'text-almost-pink' : 'text-almost-pink/80'}`}>
            {formatCountdown(remaining)}
          </span>
        </div>
      </div>

      {/* Navigation + CTA */}
      <div className="px-6 pb-8 pt-4 flex flex-col gap-3">
        {/* Prev / Next */}
        {notes.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              disabled={index === 0}
              className="flex-1 py-[15px] border border-almost-border font-mono text-[15px] text-center text-almost-secondary transition-all disabled:opacity-25 hover:border-almost-border/60"
            >
              ←
            </button>
            <button
              onClick={() => setIndex(i => Math.min(notes.length - 1, i + 1))}
              disabled={index === notes.length - 1}
              className="flex-1 py-[15px] border border-almost-border font-mono text-[15px] text-center text-almost-secondary transition-all disabled:opacity-25 hover:border-almost-border/60"
            >
              →
            </button>
          </div>
        )}
        <button
          onClick={() => onRespond(note)}
          className="w-full py-[15px] bg-almost-pink text-white font-mono text-[15px] text-center transition-opacity hover:opacity-90 active:opacity-80"
        >
          This is me — make a move
        </button>
      </div>
      </div>
    </div>
  )
}
