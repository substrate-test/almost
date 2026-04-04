'use client'

import { useState, useRef, useEffect } from 'react'
import type { Note } from '@/types'
import { formatDate, msLeft, formatCountdown } from '@/lib/data'

interface Props {
  note: Note
  onBack: () => void
  onSent: () => void
}

const MAX_CHARS = 200

export default function BrowseRespondScreen({ note, onBack, onSent }: Props) {
  const [text, setText] = useState('')
  const [expanded, setExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const t = setTimeout(() => textareaRef.current?.focus(), 350)
    return () => clearTimeout(t)
  }, [])

  const remaining = MAX_CHARS - text.length
  const canSend = text.trim().length > 0 && remaining >= 0

  return (
    <div className="flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      <div className="flex flex-col h-full px-6">
      {/* Header */}
      <div className="pt-[48px] pb-[60px] flex items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-3 transition-opacity hover:opacity-70"
        >
          <img src="/Back icon.svg" alt="" width={20} height={11} />
          <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide">Back</span>
        </button>
      </div>

      <h1 className="font-mono text-[#2c2c2c] leading-tight mb-2" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
        Make your move.
      </h1>
      <p className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2] mb-6">
        Write something only you would know — something they&apos;d remember about you. This is how they&apos;ll know it&apos;s really you.
      </p>

      {/* The note they're responding to — collapsible note card */}
      <p className="font-sans text-[#7b7b7b] text-[11px] tracking-widest uppercase mb-2">
        Responding to
      </p>
      <button
        onClick={() => setExpanded(e => !e)}
        className="relative w-full mb-6 text-left"
        style={{
          backgroundColor: '#F5F0E8',
          backgroundImage: `
            repeating-linear-gradient(to right, transparent, transparent 34px, rgba(0,0,0,0.07) 34px, rgba(0,0,0,0.07) 35px),
            repeating-linear-gradient(to bottom, transparent, transparent 34px, rgba(0,0,0,0.07) 34px, rgba(0,0,0,0.07) 35px)
          `,
        }}
      >
        {/* Chevron — top right, vertically centred with collapsed row */}
        <svg
          width="14" height="14" viewBox="0 0 12 12" fill="none"
          className={`absolute right-6 text-[#7b7b7b] transition-transform duration-200 ${expanded ? 'rotate-180 top-4' : 'top-1/2 -translate-y-1/2'}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {!expanded ? (
          <div className="px-6 py-[14px] pr-12">
            <p className="font-sans text-[#1a1a1a] text-[16px] leading-[1.75] truncate">
              &ldquo;{note.text}&rdquo;
            </p>
          </div>
        ) : (
          <>
            <div className="px-6 pt-5 pb-3 pr-12">
              <p className="font-sans text-[#1a1a1a] text-[16px] leading-[1.75]">
                &ldquo;{note.text}&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-6 pb-[14px] min-w-0">
              <span className="bg-[#D9D4CB] px-2.5 py-[5px] font-mono text-[11px] font-semibold text-[#444] truncate min-w-0">
                {note.venue.name}
              </span>
              <span className="bg-[#D9D4CB] px-2.5 py-[5px] font-mono text-[11px] font-semibold text-[#444] shrink-0">
                {formatDate(note.datetime)}
              </span>
              <span className="bg-[#D9D4CB] px-2.5 py-[5px] font-mono text-[11px] font-semibold text-almost-pink shrink-0">
                {formatCountdown(msLeft(note))}
              </span>
            </div>
          </>
        )}
      </button>

      {/* Response textarea */}
      <div className="relative flex-1 flex flex-col">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="I was the one who…"
          maxLength={MAX_CHARS + 10}
          className="flex-1 w-full bg-white border border-[#e0e0e0] rounded-xl px-5 py-4 font-sans text-[16px] leading-relaxed text-[#2c2c2c] placeholder:text-[#7b7b7b] placeholder:font-light focus:border-almost-pink/40 transition-colors duration-200 min-h-[120px]"
        />
        {remaining <= 60 && (
          <div className={`absolute bottom-4 right-4 font-mono text-xs tabular-nums ${remaining < 0 ? 'text-red-400' : remaining <= 20 ? 'text-almost-pink' : 'text-[#7b7b7b]'}`}>
            {remaining}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="pb-8 mt-5">
        <button
          onClick={() => canSend && onSent()}
          disabled={!canSend}
          className="w-full py-[15px] text-white font-sans text-[16px] text-center transition-all duration-200 disabled:cursor-not-allowed active:opacity-80 rounded-full"
          style={{ background: canSend ? '#FE0155' : '#a0a0a0' }}
        >
          Send it
        </button>
      </div>
      </div>
    </div>
  )
}
