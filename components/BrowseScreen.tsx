'use client'

export default function BrowseScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-almost-bg px-8 animate-screen-in">
      <div className="pt-14" />

      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <p className="font-mono text-almost-text" style={{ fontSize: '28px' }}>
          Coming soon
        </p>
        <p className="font-sans text-almost-secondary text-[15px] leading-[1.75] max-w-[280px]">
          Browsing notes at venues is on its way. Check back soon.
        </p>
      </div>

      <div className="pb-8">
        <button
          onClick={onBack}
          className="w-full py-[15px] bg-almost-pink text-white font-mono text-[15px] text-center transition-opacity hover:opacity-90 active:opacity-80 rounded-full"
        >
          Go back
        </button>
      </div>
    </div>
  )
}
