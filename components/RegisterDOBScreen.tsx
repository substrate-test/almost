'use client'

import { useState } from 'react'

interface Props {
  onBack: () => void
  onNext: () => void
}

export default function RegisterDOBScreen({ onBack, onNext, onSkip }: Props & { onSkip?: () => void }) {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [error, setError] = useState('')

  const handleContinue = () => {
    const d = parseInt(day)
    const m = parseInt(month)
    const y = parseInt(year)

    if (!d || !m || !y || y < 1900 || y > new Date().getFullYear()) {
      setError('Please enter a valid date of birth.')
      return
    }

    const dob = new Date(y, m - 1, d)
    const now = new Date()
    let age = now.getFullYear() - dob.getFullYear()
    const monthDiff = now.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age--

    if (age < 18) {
      setError('You must be 18 or over to use Almost.')
      return
    }

    setError('')
    onNext()
  }

  const canContinue = day.length > 0 && month.length > 0 && year.length === 4

  return (
    <div className="relative flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      {process.env.NODE_ENV === 'development' && onSkip && (
        <button onClick={onSkip} className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-20 h-20 opacity-0" aria-label="Skip to app" />
      )}
      <div className="flex flex-col h-full px-6">
        <div className="pt-[48px]">
          <button onClick={onBack} className="flex items-center gap-3 transition-opacity hover:opacity-70">
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide relative top-[1px]">Back</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h1 className="font-mono text-[#2c2c2c] leading-tight mb-2" style={{ fontSize: 36, lineHeight: 1.15 }}>
            When were you born?
          </h1>
          <p className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2] mb-2">
            You must be 18 or over to use Almost.
          </p>
          <p className="font-sans text-[#9d9d9d] text-[13px] leading-[1.4] mb-8">
            Your date of birth is used for age verification only. It won&apos;t appear on your profile or be shared with anyone.
          </p>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 w-[72px]">
              <label className="font-sans text-[#9d9d9d] text-[11px] uppercase tracking-widest">Day</label>
              <input
                type="number"
                value={day}
                onChange={e => setDay(e.target.value)}
                placeholder="DD"
                min={1} max={31}
                className="w-full bg-white rounded-xl px-4 py-4 font-sans text-[16px] text-[#2c2c2c] placeholder:text-[#aaa] focus:outline-none text-center"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-[72px]">
              <label className="font-sans text-[#9d9d9d] text-[11px] uppercase tracking-widest">Month</label>
              <input
                type="number"
                value={month}
                onChange={e => setMonth(e.target.value)}
                placeholder="MM"
                min={1} max={12}
                className="w-full bg-white rounded-xl px-4 py-4 font-sans text-[16px] text-[#2c2c2c] placeholder:text-[#aaa] focus:outline-none text-center"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="font-sans text-[#9d9d9d] text-[11px] uppercase tracking-widest">Year</label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="YYYY"
                min={1900} max={new Date().getFullYear()}
                className="w-full bg-white rounded-xl px-4 py-4 font-sans text-[16px] text-[#2c2c2c] placeholder:text-[#aaa] focus:outline-none text-center"
              />
            </div>
          </div>

          {error && (
            <p className="font-sans text-almost-pink text-[14px] mt-4">{error}</p>
          )}
        </div>

        <div className="pb-8">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-full py-[15px] text-white font-sans text-[16px] text-center transition-all duration-200 disabled:cursor-not-allowed active:opacity-80 rounded-full"
            style={{ background: canContinue ? '#FE0155' : '#a0a0a0' }}
          >
            Let&apos;s go
          </button>
        </div>
      </div>
    </div>
  )
}
