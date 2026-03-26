'use client'

import { useState } from 'react'

interface Props {
  onBack: () => void
  onNext: (datetime: Date) => void
}

type QuickPick = 'tonight' | 'lastnight' | 'earlier' | 'custom'

function getNightLabel(offsetDays: number): { label: string; sub: string } {
  const now = new Date()
  const isEvening = now.getHours() >= 17

  // offsetDays=0 → most recent night, offsetDays=1 → the one before
  const nightStart = new Date(now)
  nightStart.setDate(nightStart.getDate() - (isEvening ? offsetDays : offsetDays + 1))
  nightStart.setHours(17, 0, 0, 0)

  const nightEnd = new Date(nightStart)
  nightEnd.setDate(nightEnd.getDate() + 1)
  nightEnd.setHours(5, 0, 0, 0)

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short' })
  const sub = `${fmt(nightStart)} 5pm – ${fmt(nightEnd)} 5am`

  let label: string
  if (offsetDays === 0) label = isEvening ? 'Tonight' : 'Last night'
  else label = isEvening ? 'Last night' : 'The night before'

  return { label, sub }
}

const night0 = getNightLabel(0)
const night1 = getNightLabel(1)

const QUICK_PICKS: { id: QuickPick; label: string; sub: string }[] = [
  { id: 'tonight', label: night0.label, sub: night0.sub },
  { id: 'lastnight', label: night1.label, sub: night1.sub },
  { id: 'custom', label: 'Another time', sub: 'Pick a date' },
]

function resolveQuickPick(id: QuickPick, customDate?: string): Date {
  const now = new Date()
  if (id === 'tonight') {
    const d = new Date(now)
    d.setHours(d.getHours() - 2)
    return d
  }
  if (id === 'lastnight') {
    const d = new Date(now)
    d.setDate(d.getDate() - 1)
    d.setHours(23, 0, 0, 0)
    return d
  }
  if (id === 'earlier') {
    const d = new Date(now)
    d.setDate(d.getDate() - 3)
    d.setHours(22, 0, 0, 0)
    return d
  }
  if (customDate) {
    return new Date(`${customDate}T20:00:00`)
  }
  return new Date(now)
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-white font-sans text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back
    </button>
  )
}

export default function DateTimeScreen({ onBack, onNext }: Props) {
  const [selected, setSelected] = useState<QuickPick | null>(null)
  const [customDate, setCustomDate] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const canContinue =
    selected !== null &&
    (selected !== 'custom' || customDate !== '')

  const handleContinue = () => {
    if (!selected) return
    onNext(resolveQuickPick(selected, customDate))
  }

  return (
    <div className="flex flex-col h-full animate-screen-in bg-almost-bg">
      <div className="flex flex-col h-full px-6">
      {/* Header */}
      <div className="flex items-center gap-4 pt-[48px] pb-[60px]">
        <BackButton onClick={onBack} />
        <span className="font-sans text-almost-muted text-xs font-medium tracking-widest uppercase ml-auto">
          2 of 3
        </span>
      </div>

      <h2 className="font-mono text-almost-text leading-tight mb-2" style={{ fontSize: 'clamp(26px, 7vw, 32px)' }}>
        When was it?
      </h2>
      <p className="font-mono text-almost-secondary text-sm mb-8">
        Roughly. The feeling matters more than the hour.
      </p>

      {/* Quick picks */}
      <div className="space-y-3">
        {QUICK_PICKS.map((pick) => {
          const isActive = selected === pick.id
          return (
            <button
              key={pick.id}
              onClick={() => setSelected(pick.id)}
              className={`
                w-full text-left px-5 py-4 border transition-all duration-200
                ${isActive
                  ? 'border-almost-pink/40 bg-[rgba(254,1,85,0.08)]'
                  : 'border-almost-border bg-almost-surface hover:border-almost-border/80 hover:bg-white/[0.02]'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-mono text-sm ${isActive ? 'text-almost-pink' : 'text-almost-text'}`}>
                    {pick.label}
                  </p>
                  <p className="font-mono text-sm text-almost-secondary mt-0.5">{pick.sub}</p>
                </div>
                <div
                  className={`
                    w-4 h-4 rounded-full border flex items-center justify-center
                    transition-all duration-200
                    ${isActive ? 'border-almost-pink bg-almost-pink' : 'border-almost-muted'}
                  `}
                >
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-almost-bg" />
                  )}
                </div>
              </div>

              {/* Custom date input */}
              {pick.id === 'custom' && isActive && (
                <div
                  className="mt-4 animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="date"
                    value={customDate}
                    max={today}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="
                      w-full bg-almost-surface border border-almost-border
                      px-5 py-4 font-mono text-sm text-almost-text
                      focus:border-almost-pink/40 transition-colors duration-200
                    "
                  />
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex-1" />

      {/* Continue */}
      <div className="pb-8">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="
            w-full py-[15px]
            font-mono text-[15px] text-center text-white
            transition-all duration-200
            disabled:opacity-30 disabled:cursor-not-allowed
            active:opacity-80
          "
          style={{
            background: canContinue ? '#FE0155' : 'rgba(254,1,85,0.2)',
          }}
        >
          Continue
        </button>
      </div>
      </div>
    </div>
  )
}
