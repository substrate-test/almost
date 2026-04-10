'use client'

import { useState, useEffect } from 'react'
import type { Note } from '@/types'
import type { NoteResponse } from '@/lib/data'
import { formatDate, msLeft, formatCountdown, msLeftForResponse, timeAgo } from '@/lib/data'

interface Props {
  note: Note
  responses: NoteResponse[]
  onBack: () => void
  onOpenChat: () => void
  onDecline: () => void
}

export default function ViewResponseScreen({ note, responses, onBack, onOpenChat, onDecline }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [index, setIndex] = useState(0)
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const response = responses[index]
  const responseMs = msLeftForResponse(response)
  const responseExpired = responseMs <= 0

  return (
    <div className="flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      <div className="flex flex-col h-full px-6">

        {/* Header */}
        <div className="pt-8 flex items-center">
          <button onClick={onBack} className="flex items-center gap-3 transition-opacity hover:opacity-70">
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide relative top-[1px]">Back</span>
          </button>
        </div>

        <h1 className="font-mono text-[#2c2c2c] mt-14 mb-2" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
          They wrote back
        </h1>
        <p className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2] mb-6">
          Someone felt the connection and replied to your note.
        </p>

        {/* Original note — collapsed snippet */}
        <p className="font-sans text-[#9d9d9d] text-[15px] uppercase tracking-wide mb-3">
          Your note
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
                {msLeft(note) > 0 && (
                  <span className="font-sans text-[12px] text-[#FE0155] shrink-0 ml-auto tabular-nums">
                    {formatCountdown(msLeft(note))}
                  </span>
                )}
              </div>
            </div>
          )}
        </button>

        {/* Reply label + pagination */}
        <div className="flex items-center justify-between mb-3">
          <p className="font-sans text-[#9d9d9d] text-[15px] uppercase tracking-wide">
            Reply {index + 1}/{responses.length}
          </p>
          {responses.length > 1 && (
            <div className="flex gap-3">
              <button
                onClick={() => setIndex(i => Math.max(0, i - 1))}
                disabled={index === 0}
                className="transition-opacity disabled:opacity-25 hover:opacity-60"
              >
                <img src="/Back icon.svg" alt="" width={20} height={11} />
              </button>
              <button
                onClick={() => setIndex(i => Math.min(responses.length - 1, i + 1))}
                disabled={index === responses.length - 1}
                className="transition-opacity disabled:opacity-25 hover:opacity-60"
              >
                <img src="/Back icon.svg" alt="" width={20} height={11} className="rotate-180" />
              </button>
            </div>
          )}
        </div>

        {/* Reply card */}
        <div className="flex-1 bg-white rounded-xl p-4 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <p className="font-sans text-[20px] text-[#2c2c2c] leading-[1.6] whitespace-pre-wrap">
              {response.text}
            </p>
          </div>
          <div className="flex items-center gap-1.5 pt-3 min-w-0">
            <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] shrink-0">
              {timeAgo(response.respondedAt)}
            </span>
            {!responseExpired && (
              <span className="font-sans text-[12px] text-[#FE0155] shrink-0 ml-auto tabular-nums">
                {formatCountdown(responseMs)}
              </span>
            )}
            {responseExpired && (
              <span className="font-sans text-[12px] text-[#9d9d9d] shrink-0 ml-auto">
                Expired
              </span>
            )}
          </div>
        </div>

        {/* CTAs */}
        <div className="pb-8 pt-4 flex flex-col gap-3">
          <button
            onClick={onOpenChat}
            disabled={responseExpired}
            className="w-full py-[15px] text-white font-sans text-[16px] text-center transition-all duration-200 disabled:cursor-not-allowed active:opacity-80 rounded-full"
            style={{ background: responseExpired ? '#a0a0a0' : '#FE0155' }}
          >
            Unlock chat for £10
          </button>
          <button
            onClick={onDecline}
            className="w-full py-2 font-sans text-[15px] text-[#9d9d9d] text-center transition-opacity hover:opacity-60 active:opacity-40"
          >
            Not for me
          </button>
        </div>

      </div>
    </div>
  )
}
