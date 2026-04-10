'use client'

import { useState, useEffect } from 'react'
import type { Note } from '@/types'
import { msLeft, formatCountdown, formatDate, humanWhen } from '@/lib/data'

interface Props {
  notes: Note[]
  initialNoteId?: string
  onBack: () => void
  onViewResponse?: () => void
}

export default function MyNoteDetailScreen({ notes, initialNoteId, onBack, onViewResponse }: Props) {
  const initialIndex = initialNoteId
    ? Math.max(0, notes.findIndex(n => n.id === initialNoteId))
    : 0
  const [index, setIndex] = useState(initialIndex)
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const note = notes[index]
  const remaining = msLeft(note)
  const live = remaining > 0

  return (
    <div className="flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>

      {/* Header */}
      <div className="px-6 pt-8 flex items-center shrink-0">
        <button onClick={onBack} className="flex items-center gap-3 transition-opacity hover:opacity-70">
          <img src="/Back icon.svg" alt="" width={20} height={11} />
          <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide relative top-[1px]">Back</span>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* Human date heading */}
        <div className="px-6 mt-8 mb-1">
          <h1 className="font-mono text-[#2c2c2c]" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
            {humanWhen(note.datetime)}
          </h1>
        </div>

        {/* Pagination */}
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

        {/* Response banner */}
        {(note.moves ?? 0) > 0 && (
          <div className="mx-6 mb-3 rounded-xl px-4 py-3" style={{ background: 'rgba(254,1,85,0.1)' }}>
            <p className="font-sans text-[#2c2c2c] text-[15px] leading-[1.4] mb-3">
              The feeling is mutual. You have {note.moves} {note.moves === 1 ? 'reply' : 'replies'}.
            </p>
            {onViewResponse && (
              <button
                onClick={onViewResponse}
                className="text-almost-pink font-sans text-[13px] uppercase tracking-wide inline-flex items-center gap-2 transition-opacity hover:opacity-70"
              >
                Read {note.moves === 1 ? 'reply' : 'replies'}
                <svg width="20" height="11" viewBox="0 0 20 11" fill="none" className="shrink-0">
                  <path d="M0 5.5h18M13 1l5.5 4.5L13 10" stroke="#FE0155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Note card */}
        <div className="mx-6 bg-white rounded-xl p-4">
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
            {live ? (
              <span className="font-sans text-[12px] shrink-0 ml-auto tabular-nums text-[#FE0155]">
                {formatCountdown(remaining)}
              </span>
            ) : (
              <span className="font-sans text-[12px] shrink-0 ml-auto text-[#9d9d9d]">
                Expired
              </span>
            )}
          </div>
        </div>

        {/* Status line */}
        <div className="px-6 pb-8 pt-4">
          <p className="text-center font-sans text-[15px] text-[#9d9d9d]">
            {!live
              ? ((note.moves ?? 0) > 0 ? 'Someone wrote back on this one' : 'Crickets. Statistically meaningless.')
              : 'Still live — fingers crossed'}
          </p>
        </div>

      </div>
    </div>
  )
}
