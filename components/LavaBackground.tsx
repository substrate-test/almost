'use client'

import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const makeFrag = (count: number) => `
precision mediump float;
uniform vec2  u_res;
uniform float u_time;
uniform float u_speed;
uniform float u_threshold;

void main() {
  vec2 uv  = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  vec2 uvA = vec2(uv.x * asp, uv.y);

  float field = 0.0;
  float n = float(${count});

  for (int i = 0; i < ${count}; i++) {
    float fi = float(i);
    float ox = fi * 1.618 + 0.3;
    float oy = fi * 2.399 + 0.7;
    float spd = u_speed * (0.25 + 0.18 * sin(fi * 0.9));
    vec2 b = vec2(
      0.5 + 0.40 * sin(u_time * spd        + ox),
      0.5 + 0.42 * cos(u_time * spd * 0.83 + oy)
    );
    vec2 bA = vec2(b.x * asp, b.y);
    float d2 = dot(uvA - bA, uvA - bA);
    field += 0.013 / (d2 + 0.001);
  }

  vec3 bg  = vec3(0.109, 0.075, 0.094);
  vec3 mid = vec3(0.45,  0.01,  0.20);
  vec3 hot = vec3(0.996, 0.004, 0.333);

  float lo = u_threshold * 0.38;
  float hi = u_threshold;

  float t1 = smoothstep(lo * 0.4, hi * 0.9, field);
  float t2 = smoothstep(hi * 0.9, hi * 2.2, field);

  vec3 col = mix(bg, mid, t1);
  col = mix(col, hot, t2);
  col += hot * smoothstep(lo * 0.15, lo * 0.5, field) * 0.18;

  gl_FragColor = vec4(col, 1.0);
}
`

interface Props {
  blobCount?: number
  speed?: number
  threshold?: number
  className?: string
}

export default function LavaBackground({
  blobCount = 8,
  speed = 1.0,
  threshold = 1.0,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, makeFrag(blobCount)))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uRes       = gl.getUniformLocation(prog, 'u_res')
    const uTime      = gl.getUniformLocation(prog, 'u_time')
    const uSpeed     = gl.getUniformLocation(prog, 'u_speed')
    const uThreshold = gl.getUniformLocation(prog, 'u_threshold')

    gl.uniform1f(uSpeed, speed)
    gl.uniform1f(uThreshold, threshold)

    const start = performance.now()
    let raf: number

    const tick = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(tick)
    }

    tick()
    return () => cancelAnimationFrame(raf)
  }, [blobCount, speed, threshold])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
