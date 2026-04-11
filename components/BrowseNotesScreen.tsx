'use client'

import { useState, useEffect } from 'react'
import type { Venue, Note } from '@/types'
import { notesForVenue, formatCountdown, formatDate, msLeft, humanWhen } from '@/lib/data'

function ShareButton({ note, primary = false }: { note: Note; primary?: boolean }) {
  const handleShare = () => {
    const text = `"${note.text}" — left at ${note.venue.name}`
    if (navigator.share) {
      navigator.share({ title: 'A note on Almost', text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  if (primary) {
    return (
      <button
        onClick={handleShare}
        className="w-full py-[15px] bg-almost-pink text-white font-sans text-[16px] text-center transition-opacity hover:opacity-90 active:opacity-80 rounded-full"
      >
        Share note
      </button>
    )
  }

  return (
    <button
      onClick={handleShare}
      className="w-full py-2 font-sans text-[15px] text-[#9d9d9d] text-center transition-opacity hover:opacity-60 active:opacity-40"
    >
      Share note
    </button>
  )
}

interface Props {
  venue: Venue
  initialNoteId?: string
  notes?: Note[]
  context?: 'browse' | 'look'
  onBack: () => void
  onRespond: (note: Note) => void
  onViewMyNote?: (note: Note) => void
}

export default function BrowseNotesScreen({ venue, initialNoteId, notes: notesProp, context = 'browse', onBack, onRespond, onViewMyNote }: Props) {
  const notes = notesProp ?? notesForVenue(venue.id)
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
        <div className="pt-[37px] pb-[60px] flex items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-3 transition-opacity hover:opacity-70"
          >
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <p className="font-sans text-[#2c2c2c] text-[22px]">Nobody here yet. Or they were, and they bottled it.</p>
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

  return (
    <div className="flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>

      {/* Header */}
      <div className="px-6 pt-[37px] flex items-center justify-between shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-3 transition-opacity hover:opacity-70"
        >
          <img src="/Back icon.svg" alt="" width={20} height={11} />
          
        </button>
      </div>

      {/* Scrollable content + buttons */}
      <div className="flex-1 overflow-y-auto">

        {/* Human date heading */}
        <div className="px-6 mt-8 mb-1">
          <h1 className="font-mono text-[#2c2c2c]" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
            {humanWhen(note.datetime)}
          </h1>
        </div>

        {/* Pagination + arrows */}
        <div className="px-6 mt-4 mb-3 flex items-center justify-between">
          <span className="font-sans text-[#9d9d9d] text-[13px] uppercase tracking-widest">
            Note {index + 1}/{notes.length}
          </span>
          {notes.length > 1 && (
            <div className="flex gap-4">
              <button
                onClick={() => setIndex(i => Math.max(0, i - 1))}
                disabled={index === 0}
                className="transition-opacity disabled:opacity-25 hover:opacity-60"
              >
                <img src="/Back icon.svg" alt="" width={20} height={11} />
              </button>
              <button
                onClick={() => setIndex(i => Math.min(notes.length - 1, i + 1))}
                disabled={index === notes.length - 1}
                className="transition-opacity disabled:opacity-25 hover:opacity-60"
              >
                <img src="/Back icon.svg" alt="" width={20} height={11} className="rotate-180" />
              </button>
            </div>
          )}
        </div>

        {/* Note card */}
        <div className="mx-6 bg-white rounded-xl p-4">
          {note.mine && (
            <span className="inline-block bg-almost-pink rounded px-2 py-1 font-sans text-[12px] text-white mb-3">
              My note
            </span>
          )}
          <p className="font-sans text-[20px] text-[#2c2c2c] leading-[1.6] whitespace-pre-wrap">
            {note.text}
          </p>
          <div className="flex items-center gap-1.5 pt-3 min-w-0">
            <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] truncate min-w-0">
              {note.venue.name}
            </span>
            <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] shrink-0">
              {formatDate(note.datetime)}
            </span>
            <span className={`font-sans text-[12px] shrink-0 ml-auto tabular-nums ${remaining < 3600000 ? 'text-almost-pink' : 'text-[#FE0155]'}`}>
              {formatCountdown(remaining)}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-8 pt-4 flex flex-col gap-3">
          {note.mine ? (
            <>
              <button
                onClick={() => onViewMyNote?.(note)}
                className="w-full py-[15px] bg-almost-pink text-white font-sans text-[16px] text-center transition-opacity hover:opacity-90 active:opacity-80 rounded-full"
              >
                View my note
              </button>
              <ShareButton note={note} />
            </>
          ) : context === 'browse' ? (
            <>
              <button
                onClick={() => onRespond(note)}
                className="w-full py-[15px] bg-almost-pink text-white font-sans text-[16px] text-center transition-opacity hover:opacity-90 active:opacity-80 rounded-full"
              >
                Write back
              </button>
              <ShareButton note={note} />
            </>
          ) : (
            <>
              <ShareButton note={note} primary />
              <button
                onClick={() => onRespond(note)}
                className="w-full py-2 font-sans text-[15px] text-[#9d9d9d] text-center transition-opacity hover:opacity-60 active:opacity-40"
              >
                Write back
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
