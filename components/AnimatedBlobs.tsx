'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedBlobs() {
  const blob1 = useRef<HTMLDivElement>(null)
  const blob2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const start = performance.now()

    const tick = () => {
      const t = (performance.now() - start) / 1000

      if (blob1.current) {
        const x = Math.sin(t * 0.28) * 45 + Math.sin(t * 0.13) * 22
        const y = Math.cos(t * 0.21) * 40 + Math.cos(t * 0.17) * 18
        blob1.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
      }

      if (blob2.current) {
        const x = Math.sin(t * 0.19 + 2.1) * 38 + Math.sin(t * 0.31) * 16
        const y = Math.cos(t * 0.24 + 1.1) * 42 + Math.cos(t * 0.11) * 20
        blob2.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
      }

      raf = requestAnimationFrame(tick)
    }

    tick()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        ref={blob1}
        className="absolute"
        style={{ top: '28%', left: '50%' }}
      >
        <img src="/Orb_Large.svg" alt="" width={373} height={389} />
      </div>
      <div
        ref={blob2}
        className="absolute"
        style={{ top: '18%', left: '25%' }}
      >
        <img src="/Orb_Small.svg" alt="" width={280} height={280} />
      </div>
    </div>
  )
}
