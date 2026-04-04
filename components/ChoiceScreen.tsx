'use client'

import AnimatedBlobs from '@/components/AnimatedBlobs'

interface Props {
  onBack: () => void
  onLeave: () => void
  onFind: () => void
  onLook: () => void
}

function Card({ title, body, onClick }: { title: string; body: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white p-4 rounded-xl transition-all duration-200 active:opacity-70 group"
    >
      <div className="flex items-center gap-2 mb-2">
        <h2 className="font-sans text-[#2c2c2c] text-[20px] leading-tight">
          {title}
        </h2>
        <span className="transition-transform duration-200 group-hover:translate-x-1">
          <img src="/Arrow icon.svg" alt="" width={20} height={11} />
        </span>
      </div>
      <p className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2]">
        {body}
      </p>
    </button>
  )
}

export default function ChoiceScreen({ onBack, onLeave, onFind, onLook }: Props) {
  return (
    <div className="relative flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      <AnimatedBlobs />

      <div className="relative z-10 flex flex-col h-full px-[calc(8.33%+2px)]">

        {/* Back */}
        <div className="pt-8 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-3 transition-opacity hover:opacity-60 active:opacity-40"
          >
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide">Back</span>
          </button>
        </div>

        {/* Hero — heading */}
        <div className="flex-1 flex items-center justify-center">
          <h1
            className="font-mono text-[#2c2c2c] text-center"
            style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15, width: '172px' }}
          >
            What brings you here?
          </h1>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4 pb-8">
          <Card
            title="Leave a note"
            body="You saw someone. You felt something. Write it down and pin it to the place it happened."
            onClick={onLeave}
          />
          <Card
            title="Make a move"
            body="You felt it too. You both missed the moment. Browse by venue and see if they left a note for you."
            onClick={onFind}
          />
          <Card
            title="Just looking"
            body="Browse the moments people left behind. No agenda. Pure nosiness."
            onClick={onLook}
          />
        </div>

      </div>
    </div>
  )
}
