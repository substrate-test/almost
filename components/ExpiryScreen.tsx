'use client'

import { useEffect, useState } from 'react'

interface Props {
  onRestart: () => void
}

const MESSAGES = [
  {
    heading: 'Your moment has passed.',
    body: 'Sometimes the universe needed you to say it\neven if no one answered.',
  },
  {
    heading: 'It lived while it needed to.',
    body: 'Not every feeling needs a reply.\nSome just need to be released.',
  },
  {
    heading: 'That was brave.',
    body: 'You put something real into the world.\nThat counts, whether or not it found them.',
  },
]

export default function ExpiryScreen({ onRestart }: Props) {
  const [visible, setVisible] = useState(false)
  const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="flex flex-col h-full px-8 animate-screen-in"
      style={{ background: '#f7f5f6', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}
    >
      <div className="pt-14" />

      <div className="flex-1 flex flex-col justify-center">
        {/* Divider */}
        <div className="h-px w-full bg-[#e0e0e0] mb-10" />

        {/* Message */}
        <h1 className="font-mono text-[#2c2c2c] leading-tight mb-2" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
          {message.heading}
        </h1>
        <p className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2] whitespace-pre-line">
          {message.body}
        </p>

        <div className="mt-12 h-px bg-[#e0e0e0]" />
      </div>

      {/* Actions */}
      <div className="pb-8 space-y-3">
        <button
          onClick={onRestart}
          className="
            w-full py-[15px] bg-almost-pink text-white
            font-sans text-[16px] text-center
            transition-opacity hover:opacity-90 active:opacity-80
            rounded-full
          "
        >
          Write another moment
        </button>

        <button
          onClick={onRestart}
          className="w-full py-3.5 font-sans text-[#5d5d5d] text-[15px] hover:text-[#2c2c2c] transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  )
}
