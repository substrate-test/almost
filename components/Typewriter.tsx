'use client'

import { useState, useEffect } from 'react'

interface Props {
  text: string
  speed?: number
  className?: string
  style?: React.CSSProperties
  orbCursor?: boolean
}

export default function Typewriter({ text, speed = 90, className, style, orbCursor = false }: Props) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span className={className} style={style}>
      {displayed}
      {orbCursor ? (
        <img
          src="/OrbCursor.svg"
          className="inline-block ml-1"
          style={{
            width: 'clamp(30px, 8vw, 36px)',
            height: 'clamp(30px, 8vw, 36px)',
            verticalAlign: 'middle',
            animation: done ? 'cursor-blink 1.33s step-start infinite' : 'none',
          }}
        />
      ) : (
        <span
          className="inline-block w-[2px] h-[1em] ml-[2px] bg-[#FE0155]"
          style={{ verticalAlign: 'text-bottom', animation: done ? 'cursor-blink 1.33s step-start infinite' : 'none' }}
        />
      )}
    </span>
  )
}
