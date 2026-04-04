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
      <div className="flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
        <div className="flex flex-col h-full px-6">
        <div className="pt-[48px] pb-[60px] flex items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-3 transition-opacity hover:opacity-70"
          >
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide">Back</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <p className="font-sans text-[#2c2c2c] text-[22px]">No notes here yet.</p>
          <p className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2] max-w-[260px]">
            Nothing live at {venue.name} right now. Check back later — or be the first to leave one.
          </p>
        </div>
        <div className="pb-8">
          <button onClick={onBack} className="w-full py-[15px] bg-almost-pink text-white font-sans text-[16px] text-center transition-opacity hover:opacity-90 active:opacity-80 rounded-full">
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
    <div className="flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-[48px] pb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-3 transition-opacity hover:opacity-70"
        >
          <img src="/Back icon.svg" alt="" width={20} height={11} />
          <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide">Back</span>
        </button>
      </div>

      {/* Venue heading */}
      <div className="px-6 pb-6">
        <h1 className="font-mono text-[#2c2c2c] leading-tight" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
          {venue.name}
        </h1>
      </div>

      {/* Note card */}
      <div className="flex-1 mx-6 bg-white rounded-xl p-4 flex flex-col justify-between overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <p className="font-sans text-[20px] text-[#2c2c2c] leading-[1.6] whitespace-pre-wrap">
            {note.text}
          </p>
        </div>
        <div className="flex items-center gap-1.5 pt-3 min-w-0">
          <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] truncate min-w-0">
            {venue.name}
          </span>
          <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] shrink-0">
            {formatDate(note.datetime)}
          </span>
          <span className={`font-sans text-[12px] shrink-0 ml-auto tabular-nums ${remaining < 3600000 ? 'text-almost-pink' : 'text-[#FE0155]'}`}>
            {formatCountdown(remaining)}
          </span>
        </div>
      </div>

      {/* Navigation + CTA */}
      <div className="px-6 pb-8 pt-4 flex flex-col gap-3">
        {/* Pagination + arrows */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-sans text-[#7b7b7b] text-[15px]">
            Note {index + 1} of {notes.length}
          </span>
          {notes.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setIndex(i => Math.max(0, i - 1))}
                disabled={index === 0}
                className="w-9 h-9 flex items-center justify-center bg-white border border-[#e0e0e0] rounded-lg text-[#5d5d5d] transition-all disabled:opacity-25 hover:border-[#d0d0d0]"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => setIndex(i => Math.min(notes.length - 1, i + 1))}
                disabled={index === notes.length - 1}
                className="w-9 h-9 flex items-center justify-center bg-white border border-[#e0e0e0] rounded-lg text-[#5d5d5d] transition-all disabled:opacity-25 hover:border-[#d0d0d0]"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => onRespond(note)}
          className="w-full py-[15px] bg-almost-pink text-white font-sans text-[16px] text-center transition-opacity hover:opacity-90 active:opacity-80 rounded-full"
        >
          This is me — make a move
        </button>
      </div>
      </div>
    </div>
  )
}
