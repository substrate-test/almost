'use client'

import { useState, useEffect } from 'react'
import type { Note } from '@/types'
import { myLiveNotes, myPastNotes, msLeft, formatCountdown, formatDate } from '@/lib/data'

interface Props {
  onSelect: (note: Note) => void
  onBack: () => void
}

function NoteCard({ note, onSelect }: { note: Note; onSelect?: () => void }) {
  const live = msLeft(note) > 0
  const remaining = msLeft(note)

  return (
    <button
      onClick={onSelect}
      disabled={!onSelect}
      className="w-full text-left bg-white rounded-xl p-4 flex flex-col gap-3 transition-opacity active:opacity-70 disabled:cursor-default"
    >
      {(note.moves ?? 0) > 0 && live && (
        <span className="self-start bg-[#FE0155]/10 text-[#FE0155] font-sans text-[12px] px-2 py-1 rounded">
          {note.moves} {note.moves === 1 ? 'reply' : 'replies'}
        </span>
      )}
      <p className="font-sans text-[#2c2c2c] text-[16px] leading-[1.4] line-clamp-2">
        {note.text}
      </p>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] truncate min-w-0">{note.venue.name}</span>
        <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] shrink-0">{formatDate(note.datetime)}</span>
        {live ? (
          <span className="font-sans text-[#FE0155] text-[12px] tabular-nums shrink-0 ml-auto">
            {formatCountdown(remaining)}
          </span>
        ) : (
          <span className="font-sans text-[#9d9d9d] text-[12px] shrink-0 ml-auto">
            Expired
          </span>
        )}
      </div>
    </button>
  )
}

export default function MyNotesScreen({ onSelect, onBack }: Props) {
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const liveNotes = myLiveNotes()
  const pastNotes = myPastNotes()

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#f7f5f6' }}>
      <div className="flex flex-col h-full px-6 overflow-y-auto">
        <div className="pt-8 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-3 transition-opacity hover:opacity-70">
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            
          </button>
        </div>
        <h1 className="font-mono text-[#2c2c2c] mt-14 mb-8" style={{ fontSize: 36, lineHeight: 1.15 }}>
          My notes
        </h1>

        {liveNotes.length > 0 && (
          <div className="mb-6">
            <p className="font-sans text-[#9d9d9d] text-[15px] uppercase tracking-wide mb-3">Live</p>
            <div className="flex flex-col gap-3">
              {liveNotes.map(note => (
                <NoteCard key={note.id} note={note} onSelect={() => onSelect(note)} />
              ))}
            </div>
          </div>
        )}

        {pastNotes.length > 0 && (
          <div className="pb-8">
            <p className="font-sans text-[#9d9d9d] text-[15px] uppercase tracking-wide mb-3">Past</p>
            <div className="flex flex-col gap-3">
              {pastNotes.map(note => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        )}

        {liveNotes.length === 0 && pastNotes.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-sans text-[#9d9d9d] text-[16px]">No notes yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
