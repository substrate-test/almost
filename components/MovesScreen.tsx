'use client'

export default function MovesScreen() {
  return (
    <div className="flex flex-col h-full" style={{ background: '#f7f5f6' }}>
      <div className="flex flex-col h-full px-6">
        <div className="pt-[48px] pb-8">
          <h1 className="font-mono text-[#2c2c2c]" style={{ fontSize: 36, lineHeight: 1.15 }}>
            Moves
          </h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
          <p className="font-sans text-[#2c2c2c] text-[20px]">Nothing yet.</p>
          <p className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2] max-w-[240px]">
            When someone responds to your note, the conversation will appear here.
          </p>
        </div>
      </div>
    </div>
  )
}
