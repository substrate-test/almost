'use client'

import { useState, useRef, useEffect } from 'react'
import type { Venue } from '@/types'
import { formatDate } from '@/lib/data'

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
    <div className="flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      <div className="flex flex-col h-full px-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-[48px] pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-3 transition-opacity hover:opacity-70"
          >
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide relative top-[1px]">Back</span>
          </button>
        </div>

        <span className="font-sans text-[#9d9d9d] text-[13px] uppercase tracking-widest block mb-2">3 / 3</span>
        <h1 className="font-mono text-[#2c2c2c] leading-tight mb-2" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
          Write them a note
        </h1>
        <p className="font-sans text-[#2c2c2c] text-[16px] leading-[1.2] mb-5">
          Describe the moment — the details that only they would recognise.
        </p>

        {/* Note card */}
        <div className="flex-1 bg-white rounded-xl p-4 flex flex-col justify-between overflow-hidden">
          {/* Textarea fills the card */}
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="This is your shot…"
              maxLength={MAX_CHARS + 10}
              className="absolute inset-0 w-full h-full bg-transparent p-0 font-sans text-[20px] leading-[1.6] text-[#2c2c2c] placeholder:text-[#aaa] resize-none focus:outline-none"
            />
          </div>

          {/* Tags + countdown */}
          <div className="flex items-center gap-1.5 pt-3 min-w-0">
            {venue && (
              <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] truncate min-w-0">
                {venue.name}
              </span>
            )}
            {datetime && (
              <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] shrink-0">
                {formatDate(datetime)}
              </span>
            )}
            <span className={`font-sans text-[12px] shrink-0 ml-auto tabular-nums ${isOver ? 'text-red-400' : 'text-[#FE0155]'}`}>
              {remaining <= 60 ? remaining : '24:00:00'}
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="pb-8 mt-5">
          <button
            onClick={() => canSubmit && onNext(text.trim())}
            disabled={!canSubmit}
            className="w-full py-[15px] text-white font-sans text-[16px] text-center transition-all duration-200 disabled:cursor-not-allowed active:opacity-80 rounded-full"
            style={{ background: canSubmit ? '#FE0155' : '#a0a0a0' }}
          >
            Leave your note
          </button>
        </div>
      </div>
    </div>
  )
}
