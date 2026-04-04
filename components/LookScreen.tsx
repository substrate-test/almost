'use client'

import { useState, useEffect } from 'react'
import type { Note } from '@/types'
import { allLiveNotes, formatCountdown, msLeft } from '@/lib/data'

type Filter = 'all' | 'venue' | 'expiring'

interface Props {
  onBack: () => void
  onSelect: (note: Note) => void
}

export default function LookScreen({ onBack, onSelect }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const notes = allLiveNotes()

  const sorted = filter === 'expiring'
    ? [...notes].sort((a, b) => msLeft(a) - msLeft(b))
    : filter === 'venue'
    ? [...notes].sort((a, b) => a.venue.name.localeCompare(b.venue.name))
    : [...notes].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'venue', label: 'By venue' },
    { key: 'expiring', label: 'Expiring soon' },
  ]

  return (
    <div className="flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      {/* Header */}
      <div className="px-6 pt-[48px] pb-4 flex items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-3 transition-opacity hover:opacity-70"
        >
          <img src="/Back icon.svg" alt="" width={20} height={11} />
          <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide">Back</span>
        </button>
      </div>

      {/* Title */}
      <div className="px-6 pb-5">
        <h1 className="font-mono text-[#2c2c2c] leading-tight" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
          What&apos;s out there
        </h1>
      </div>

      {/* Filter tabs */}
      <div className="px-6 pb-5 flex gap-2">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-[6px] font-sans text-[13px] transition-all border rounded-full ${
              filter === key
                ? 'border-almost-pink text-almost-pink bg-white'
                : 'border-[#e0e0e0] text-[#5d5d5d] bg-white hover:border-[#d0d0d0]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Note list */}
      <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-3 pb-8">
        {sorted.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-sans text-[#5d5d5d] text-sm">Nothing live right now.</p>
          </div>
        )}
        {sorted.map(note => {
          const remaining = msLeft(note)
          const isExpiringSoon = remaining < 2 * 3600 * 1000
          return (
            <button
              key={note.id}
              onClick={() => onSelect(note)}
              className="w-full text-left bg-white rounded-xl p-4 flex flex-col justify-between transition-all duration-200 active:opacity-80"
            >
              <p className="font-sans text-[20px] text-[#2c2c2c] leading-[1.6] line-clamp-3 mb-3">
                {note.text}
              </p>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] truncate min-w-0">
                  {note.venue.name}
                </span>
                <span className={`font-sans text-[12px] tabular-nums shrink-0 ml-auto ${isExpiringSoon ? 'text-almost-pink' : 'text-[#FE0155]'}`}>
                  {formatCountdown(remaining)}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
