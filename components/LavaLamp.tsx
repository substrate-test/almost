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

  // 8 blobs — varied speeds and orbits
  vec2 b[8];
  b[0] = vec2(0.5 + 0.38*sin(u_time*0.37),        0.5 + 0.40*cos(u_time*0.31));
  b[1] = vec2(0.5 + 0.42*cos(u_time*0.29 + 1.2),  0.3 + 0.28*sin(u_time*0.51 + 0.7));
  b[2] = vec2(0.5 + 0.32*sin(u_time*0.58 + 2.1),  0.7 + 0.24*cos(u_time*0.43 + 1.5));
  b[3] = vec2(0.2 + 0.18*cos(u_time*0.35 + 3.0),  0.5 + 0.42*sin(u_time*0.27 + 0.3));
  b[4] = vec2(0.8 + 0.14*sin(u_time*0.46 + 0.8),  0.5 + 0.38*cos(u_time*0.33 + 2.2));
  b[5] = vec2(0.5 + 0.28*cos(u_time*0.53 + 4.0),  0.15 + 0.13*sin(u_time*0.61 + 1.1));
  b[6] = vec2(0.5 + 0.34*sin(u_time*0.41 + 2.5),  0.85 + 0.11*cos(u_time*0.48 + 3.3));
  b[7] = vec2(0.35 + 0.22*cos(u_time*0.44 + 5.1), 0.5 + 0.30*sin(u_time*0.36 + 4.7));

  // Aspect-corrected UV
  vec2 uvA = vec2(uv.x * asp, uv.y);

  float field = 0.0;
  for (int i = 0; i < 8; i++) {
    vec2 bA = vec2(b[i].x * asp, b[i].y);
    float d2 = dot(uvA - bA, uvA - bA);
    field += 0.013 / (d2 + 0.001);
  }

  // Colours
  vec3 bg    = vec3(0.109, 0.075, 0.094); // #1c1318 — base dark
  vec3 mid   = vec3(0.45,  0.01,  0.20);  // deep magenta glow
  vec3 hot   = vec3(0.996, 0.004, 0.333); // #FE0155 — full blob

  float t1 = smoothstep(0.5, 1.4, field);
  float t2 = smoothstep(1.4, 3.2, field);

  vec3 col = mix(bg, mid, t1);
  col = mix(col, hot, t2);

  // Ambient glow halo
  col += hot * smoothstep(0.2, 0.7, field) * 0.18;

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
