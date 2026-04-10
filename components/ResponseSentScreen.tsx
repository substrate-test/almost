'use client'

interface Props {
  onDone: () => void
}

export default function ResponseSentScreen({ onDone }: Props) {
  return (
    <div className="relative flex flex-col h-full overflow-hidden animate-screen-in" style={{ background: '#f7f5f6' }}>

      {/* Pulsing orb */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 1200,
          height: 1200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(254,1,56,1) 0%, rgba(254,1,56,0.7) 40%, rgba(254,1,56,0) 70%)',
          filter: 'blur(20px)',
          animation: 'orb-pulse 3s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 flex flex-col h-full px-6">

        {/* Vertically centred text */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="font-mono text-[#2c2c2c] leading-tight mb-3" style={{ fontSize: 36, lineHeight: 1.15 }}>
            The vibes are out there now.
          </h1>
          <p className="font-sans text-[#3a3a3a] text-[16px] leading-[1.2]" style={{ width: '60%' }}>
            Somewhere out there, someone&apos;s phone just lit up. Maybe.
          </p>
        </div>

        {/* CTA */}
        <div className="pb-8">
          <button
            onClick={onDone}
            className="w-full py-[15px] bg-almost-pink text-white font-sans text-[16px] text-center transition-opacity hover:opacity-90 active:opacity-80 rounded-full"
          >
            Onwards
          </button>
        </div>

      </div>
    </div>
  )
}
