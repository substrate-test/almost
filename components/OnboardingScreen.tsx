'use client'

import AnimatedBlobs from '@/components/AnimatedBlobs'

const STEPS = {
  leave: [
    { heading: 'Pick the place', body: 'Choose the venue where it happened.' },
    { heading: 'Choose a date', body: 'When did it happen? Roughly is fine.' },
    { heading: 'Write your note', body: "Pin your note. It's live for 24 hours." },
  ],
  find: [
    { heading: 'Pick a venue', body: "Somewhere you've been recently." },
    { heading: 'Browse the notes', body: 'See if someone left a note for you.' },
    { heading: 'Make your move', body: "Notes disappear — if you feel it, don't wait." },
  ],
}

const HEADINGS = {
  leave: 'Your moment is three steps away.',
  find: 'Your move is three steps away.',
}

const CTAS = {
  leave: 'Leave a note',
  find: 'Find my moment',
}

interface Props {
  mode: 'leave' | 'find'
  onBack: () => void
  onDone: () => void
}

export default function OnboardingScreen({ mode, onBack, onDone }: Props) {
  const steps = STEPS[mode]

  return (
    <div className="relative flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      <AnimatedBlobs />

      <div className="relative z-10 flex flex-col h-full px-[calc(8.33%+2px)]">

        {/* Back */}
        <div className="pt-8 flex items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-3 transition-opacity hover:opacity-60 active:opacity-40"
          >
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide">Back</span>
          </button>
        </div>

        {/* Hero heading */}
        <div className="flex-1 flex items-center justify-center">
          <h1
            className="font-mono text-[#2c2c2c] text-center"
            style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15, width: '172px' }}
          >
            {HEADINGS[mode]}
          </h1>
        </div>

        {/* Step cards */}
        <div className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <div key={i} className="bg-white p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono font-bold text-almost-pink text-[20px] leading-none">{i + 1}.</span>
                <h2 className="font-sans text-[#2c2c2c] text-[20px] leading-tight">{step.heading}</h2>
              </div>
              <p className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2]">{step.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-4 pb-8">
          <button
            onClick={onDone}
            className="w-full py-[15px] bg-almost-pink text-white font-sans text-[16px] text-center transition-opacity hover:opacity-90 active:opacity-80 rounded-full"
          >
            {CTAS[mode]}
          </button>
        </div>

      </div>
    </div>
  )
}
