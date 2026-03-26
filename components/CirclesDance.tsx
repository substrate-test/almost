'use client';

import { useEffect, useRef } from 'react';

interface Props {
  /** Width of the canvas in px. Default 400. */
  width?: number;
  /** Height of the canvas in px. Default 160. */
  height?: number;
  /** Duration of one full loop in ms. Default 30000. */
  duration?: number;
  /** Circle colour. Default #FE0155. */
  colour?: string;
  /** Circle radius in px. Default 48. */
  radius?: number;
}

export default function CirclesDance({
  width    = 400,
  height   = 160,
  duration = 30000,
  colour   = '#FE0155',
  radius   = 48,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const cv  = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const R    = radius;
    const cx   = width  / 2;
    const cy   = height / 2;
    const NEAR = R * 1.8;
    const FAR  = R * 2.8;
    const MEET = R * 1.0;

    let startTime: number | null = null;

    function easeInOut(t: number) {
      return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
    }

    function driftLoop(p: number) {
      const a = p * Math.PI * 2;
      return (
        Math.sin(a*1+0.4)*0.20 + Math.sin(a*2+1.7)*0.17 +
        Math.sin(a*3+0.9)*0.14 + Math.sin(a*5+2.5)*0.11 +
        Math.sin(a*7+3.2)*0.08 + Math.cos(a*2+1.3)*0.12 +
        Math.cos(a*4+2.8)*0.08 + Math.cos(a*6+0.6)*0.05
      );
    }

    function blurLoop(p: number) {
      const a = p * Math.PI * 2;
      return (
        Math.sin(a*1+2.3)*0.28 + Math.sin(a*3+0.6)*0.22 +
        Math.sin(a*5+3.5)*0.14 + Math.cos(a*2+1.6)*0.20 +
        Math.cos(a*4+0.8)*0.10 + Math.cos(a*6+2.1)*0.06
      );
    }

    function gravEnvelope(p: number) {
      if (p < 0.60) return 0;
      return easeInOut((p - 0.60) / 0.40);
    }

    function draw(ts: number) {
      if (!startTime) startTime = ts;
      const p = ((ts - startTime) % duration) / duration;

      const rawDrift = driftLoop(p);
      const norm     = (rawDrift + 0.78) / 1.56;
      const driftDist = NEAR + (FAR - NEAR) * norm;

      const grav  = gravEnvelope(p);
      const flirt = Math.sin(p * Math.PI * 2 * 8.5) * 0.07 * (1 - Math.pow(grav, 3));
      const dist  = Math.max(MEET, driftDist * (1 - grav) + MEET * grav + flirt * R);

      const rawBlur   = (blurLoop(p) + 1) / 2;
      const proximity = 1 - (dist - MEET) / (FAR - MEET);
      const blurScale = R / 48;
      const blur = Math.min(7 * blurScale, (3.8 + rawBlur * 1.6 + proximity * 1.4 + grav * 1.4) * blurScale);

      cv.style.filter = `blur(${blur.toFixed(2)}px)`;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = colour;

      ctx.beginPath();
      ctx.arc(cx - dist / 2, cy, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx + dist / 2, cy, R, 0, Math.PI * 2);
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rafRef.current);
  }, [width, height, duration, colour, radius]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block' }}
    />
  );
}
