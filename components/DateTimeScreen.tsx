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

  const nightStart = new Date(now)
  nightStart.setDate(nightStart.getDate() - (isEvening ? offsetDays : offsetDays + 1))
  nightStart.setHours(17, 0, 0, 0)

  const nightEnd = new Date(nightStart)
  nightEnd.setDate(nightEnd.getDate() + 1)
  nightEnd.setHours(5, 0, 0, 0)

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short' })
  const sub = `${fmt(nightStart)} PM – ${fmt(nightEnd)} AM`

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

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES = ['M','T','W','T','F','S','S']

function DatePicker({ value, max, onChange }: { value: string; max: string; onChange: (v: string) => void }) {
  const maxDate = new Date(max + 'T00:00:00')
  const initDate = value ? new Date(value + 'T00:00:00') : maxDate

  const [viewYear, setViewYear] = useState(initDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initDate.getMonth())

  const selected = value ? new Date(value + 'T00:00:00') : null

  const firstDow = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const canGoNext = !(viewYear === maxDate.getFullYear() && viewMonth === maxDate.getMonth())

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (!canGoNext) return
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const isDisabled = (day: number) => new Date(viewYear, viewMonth, day) > maxDate
  const isSelected = (day: number) =>
    !!selected &&
    selected.getFullYear() === viewYear &&
    selected.getMonth() === viewMonth &&
    selected.getDate() === day
  const isToday = (day: number) =>
    maxDate.getFullYear() === viewYear &&
    maxDate.getMonth() === viewMonth &&
    maxDate.getDate() === day

  const select = (day: number) => {
    if (isDisabled(day)) return
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(iso)
  }

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-xl p-4">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center border border-[#e0e0e0] rounded-lg text-[#5d5d5d] hover:border-almost-pink/40 hover:text-almost-pink transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="font-sans text-[#2c2c2c] text-sm">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="w-8 h-8 flex items-center justify-center border border-[#e0e0e0] rounded-lg text-[#5d5d5d] hover:border-almost-pink/40 hover:text-almost-pink transition-colors disabled:opacity-25"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d, i) => (
          <div key={i} className="text-center font-sans text-[11px] text-[#7b7b7b] py-1 tracking-widest">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-px">
        {cells.map((day, i) => (
          <div key={i} className="aspect-square">
            {day !== null && (
              <button
                onClick={() => select(day)}
                disabled={isDisabled(day)}
                className={`
                  w-full h-full font-sans text-[13px] transition-colors rounded-lg
                  ${isSelected(day)
                    ? 'bg-almost-pink text-white'
                    : isToday(day)
                    ? 'border border-almost-pink/40 text-almost-pink'
                    : 'text-[#2c2c2c] hover:bg-[#f7f5f6]'}
                  ${isDisabled(day) ? 'opacity-20 cursor-not-allowed' : ''}
                `}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 transition-opacity hover:opacity-70"
    >
      <img src="/Back icon.svg" alt="" width={20} height={11} />
      <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide">Back</span>
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
    <div className="flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      <div className="flex flex-col h-full px-6">
      {/* Header */}
      <div className="flex items-center gap-4 pt-[48px] pb-[60px]">
        <BackButton onClick={onBack} />
        <span className="font-sans text-[#2c2c2c] text-[15px] ml-auto">
          2 / 3
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <h1 className="font-mono text-[#2c2c2c] leading-tight mb-3" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
          When did you see them?
        </h1>
        <p className="font-sans text-[#2c2c2c] text-[16px] leading-[1.2] mb-8">
          Go on — you already know which night it was.
        </p>

        {/* Quick picks */}
        <div className="space-y-3 pb-6">
          {QUICK_PICKS.map((pick) => {
            const isActive = selected === pick.id
            return (
              <button
                key={pick.id}
                onClick={() => setSelected(pick.id)}
                className="w-full text-left bg-white p-4 rounded-xl flex flex-col transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex flex-col gap-3 min-w-0">
                    <span className="font-sans text-[#2c2c2c] text-[20px] leading-tight">{pick.label}</span>
                    <span className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2]">{pick.sub}</span>
                  </div>
                  <div className="w-[25px] h-[25px] rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center shrink-0">
                    {isActive && <div className="w-[11px] h-[11px] rounded-full bg-almost-pink" />}
                  </div>
                </div>

                {/* Custom date picker */}
                {pick.id === 'custom' && isActive && (
                  <div
                    className="mt-4 animate-fade-in"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DatePicker value={customDate} max={today} onChange={setCustomDate} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Continue — always visible at bottom */}
      <div className="pb-8 pt-4">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="
            w-full py-[15px]
            font-sans text-[16px] text-center text-white
            transition-all duration-200
            disabled:cursor-not-allowed
            active:opacity-80 rounded-full
          "
          style={{
            background: canContinue ? '#FE0155' : '#a0a0a0',
          }}
        >
          Continue
        </button>
      </div>
      </div>
    </div>
  )
}
