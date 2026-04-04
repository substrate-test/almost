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
    <div className="flex flex-col h-full animate-screen-in px-6" style={{ background: '#f7f5f6' }}>
      {/* Header */}
      <div className="flex items-center gap-4 pt-[48px] pb-[60px]">
        <button
          onClick={onBack}
          className="flex items-center gap-3 transition-opacity hover:opacity-70"
        >
          <img src="/Back icon.svg" alt="" width={20} height={11} />
          <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide">Back</span>
        </button>
      </div>

      <h1 className="font-mono text-[#2c2c2c] leading-tight mb-2" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
        Preview your note
      </h1>
      <p className="font-sans text-[#2c2c2c] text-[16px] leading-[1.2] mb-6">
        Looks good? Post it and let them find you.
      </p>

      {/* Note card */}
      <div className="flex-1 bg-white rounded-xl p-4 flex flex-col justify-between overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <p className="font-sans text-[20px] text-[#2c2c2c] leading-[1.6] whitespace-pre-wrap">
            {noteText}
          </p>
        </div>
        <div className="flex items-center gap-1.5 pt-3 min-w-0">
          {data.venue && (
            <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] truncate min-w-0">
              {data.venue.name}
            </span>
          )}
          {data.datetime && (
            <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] shrink-0">
              {formatDate(data.datetime)}
            </span>
          )}
          <span className="font-sans text-[12px] text-[#FE0155] shrink-0 ml-auto tabular-nums">
            24:00:00
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="pb-8 pt-5">
        <button
          onClick={onPost}
          className="w-full py-[15px] bg-almost-pink text-white font-sans text-[16px] text-center transition-opacity hover:opacity-90 active:opacity-80 rounded-full"
        >
          Post your note
        </button>
      </div>
    </div>
  )
}
