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
            
          </button>
        </div>

        <h1 className="font-mono text-[#2c2c2c] leading-tight mb-2" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
          Make your move.
        </h1>
        <p className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2] mb-6">
          Write something only you would know — something they&apos;d remember about you. This is how they&apos;ll know it&apos;s really you.
        </p>

        {/* The note they're responding to */}
        <p className="font-sans text-[#7b7b7b] text-[16px] leading-[1.2] mb-3">
          Responding to
        </p>
        <button
          onClick={() => setExpanded(e => !e)}
          className="relative w-full mb-6 text-left bg-white rounded-xl"
        >
          <svg
            width="14" height="14" viewBox="0 0 12 12" fill="none"
            className={`absolute right-4 text-[#7b7b7b] transition-transform duration-200 ${expanded ? 'rotate-180 top-4' : 'top-1/2 -translate-y-1/2'}`}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {!expanded ? (
            <div className="px-4 py-[14px] pr-10">
              <p className="font-sans text-[#2c2c2c] text-[20px] leading-[1.6] truncate">
                {note.text}
              </p>
            </div>
          ) : (
            <div className="p-4 pr-10 flex flex-col gap-3">
              <p className="font-sans text-[#2c2c2c] text-[20px] leading-[1.6]">
                {note.text}
              </p>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] truncate min-w-0">
                  {note.venue.name}
                </span>
                <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] shrink-0">
                  {formatDate(note.datetime)}
                </span>
                <span className="font-sans text-[12px] text-[#FE0155] shrink-0 ml-auto tabular-nums">
                  {formatCountdown(msLeft(note))}
                </span>
              </div>
            </div>
          )}
        </button>

        {/* Response textarea — styled like WriteScreen */}
        <div className="flex-1 bg-white rounded-xl p-4 flex flex-col justify-between overflow-hidden">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="I was the one who…"
              maxLength={MAX_CHARS + 10}
              className="absolute inset-0 w-full h-full bg-transparent p-0 font-sans text-[20px] leading-[1.6] text-[#2c2c2c] placeholder:text-[#aaa] resize-none focus:outline-none"
            />
          </div>
          {remaining <= 60 && (
            <div className={`text-right font-mono text-xs tabular-nums pt-2 ${remaining < 0 ? 'text-red-400' : remaining <= 20 ? 'text-almost-pink' : 'text-[#7b7b7b]'}`}>
              {remaining === 0 ? 'Calm down. That\'s plenty.' : remaining}
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
