'use client'

import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;

  // 2 blobs — slow, wide orbits
  vec2 b[2];
  b[0] = vec2(0.5 + 0.40*sin(u_time*0.14),       0.5 + 0.38*cos(u_time*0.11));
  b[1] = vec2(0.5 + 0.38*cos(u_time*0.10 + 1.2), 0.5 + 0.35*sin(u_time*0.13 + 0.7));

  // Aspect-corrected UV
  vec2 uvA = vec2(uv.x * asp, uv.y);

  float field = 0.0;
  for (int i = 0; i < 2; i++) {
    vec2 bA = vec2(b[i].x * asp, b[i].y);
    float d2 = dot(uvA - bA, uvA - bA);
    field += 0.0373 / (d2 + 0.001);
  }

  // Colours — grey bg, pink blobs
  vec3 bg  = vec3(0.725, 0.725, 0.725); // #B9B9B9
  vec3 mid = vec3(0.85,  0.55,  0.65);  // warm blush transition
  vec3 hot = vec3(0.996, 0.004, 0.333); // #FE0155

  float t1 = smoothstep(0.4, 1.2, field);
  float t2 = smoothstep(1.2, 2.8, field);

  vec3 col = mix(bg, mid, t1);
  col = mix(col, hot, t2);

  // Soft glow halo
  col += hot * smoothstep(0.15, 0.55, field) * 0.12;

  gl_FragColor = vec4(col, 1.0);
}
`

export default function LavaLamp({ className }: { className?: string }) {
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
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const uRes  = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
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
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
