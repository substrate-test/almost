'use client'


interface Props {
  onBack: () => void
  onLeave: () => void
  onFind: () => void
}

function Card({ title, body, onClick }: { title: string; body: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-[rgba(20,20,20,0.85)] p-6 transition-all duration-200 hover:bg-[rgba(254,1,85,0.06)] active:opacity-80 group"
    >
      <div className="flex items-center gap-2 mb-2">
        <p className="font-sans font-normal text-almost-text text-[20px]">
          {title}
        </p>
        <span className="text-almost-pink transition-transform duration-200 group-hover:translate-x-1">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <p className="font-mono text-almost-secondary text-[13px] leading-[1.7]">
        {body}
      </p>
    </button>
  )
}

export default function ChoiceScreen({ onBack, onLeave, onFind }: Props) {
  return (
    <div className="flex flex-col h-full animate-screen-in bg-almost-bg">
      <div className="flex flex-col h-full px-8">
        {/* Back */}
        <div className="pt-[48px] pb-[60px] flex items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-sans text-white text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        </div>

        <h2 className="font-sans text-almost-text mb-6" style={{ fontSize: 'clamp(26px, 7vw, 32px)' }}>
          What brings you here?
        </h2>

        <div className="flex flex-col gap-4">
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
        </div>

        <div className="flex-1" />
        <div className="pb-8" />
      </div>
    </div>
  )
}
