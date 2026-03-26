'use client'


const STEPS = {
  leave: [
    { heading: 'Pick the place', body: 'Choose the venue where it happened.' },
    { heading: 'Write the moment', body: 'Describe them — the look, the feeling, the almost.' },
    { heading: 'It lives for 24 hours', body: "If they're looking, they'll find it." },
  ],
  find: [
    { heading: 'Pick a venue', body: "Somewhere you've been recently." },
    { heading: 'Browse the notes', body: 'See if someone left a note for you.' },
    { heading: 'Make your move', body: "Notes disappear — if you feel it, don't wait." },
  ],
}

interface Props {
  mode: 'leave' | 'find'
  onBack: () => void
  onDone: () => void
}

export default function OnboardingScreen({ mode, onBack, onDone }: Props) {
  const steps = STEPS[mode]

  return (
    <div className="flex flex-col h-full animate-screen-in bg-almost-bg">
      <div className="flex flex-col h-full px-8">
        {/* Back */}
        <div className="pt-[48px] pb-[60px] flex items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-white font-sans text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        </div>

        {/* Title */}
        <h2 className="font-sans text-almost-text mb-6" style={{ fontSize: 'clamp(26px, 7vw, 32px)' }}>
          Your moment is<br />three steps away.
        </h2>

        {/* Step cards */}
        <div className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <div key={i} className="bg-[rgba(20,20,20,0.85)] p-5">
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="font-mono text-almost-muted text-[11px] shrink-0">{i + 1}</span>
                <p className="font-sans text-almost-text text-[18px] leading-tight">{step.heading}</p>
              </div>
              <p className="font-mono text-almost-secondary text-[13px] leading-[1.7] pl-[22px]">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* CTA */}
        <div className="pb-8">
          <button
            onClick={onDone}
            className="w-full py-[15px] bg-almost-pink text-white font-mono text-[15px] text-center transition-opacity hover:opacity-90 active:opacity-80"
          >
            {mode === 'leave' ? 'Leave a note' : 'Find my moment'}
          </button>
        </div>
      </div>
    </div>
  )
}
