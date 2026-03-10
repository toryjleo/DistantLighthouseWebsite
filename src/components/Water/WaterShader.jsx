/**
 * WaterShader — A fullscreen WebGL water effect rendered on a <canvas>.
 *
 * The entire visual is produced by a fragment shader (water.frag) that
 * composites several wave layers. This component handles the WebGL
 * boilerplate, canvas sizing, and the animation loop that feeds
 * elapsed time + config uniforms into the shader each frame.
 */
import { useEffect, useRef } from 'react'
import waterVertexSource from './water.vert?raw'
import waterFragmentSource from './water.frag?raw'

// ─── Default prop values ─────────────────────────────────────────────────────
const DEFAULTS = {
  timeScale: 0.65,    // Global animation speed multiplier
  alpha: 0.9,         // Overall water opacity
  depth: 0.65,        // Depth colour intensity
  edge: 0.08,         // Wave-edge highlight thickness
  height: 0.0,        // Vertical offset of the water surface
  w1Scale: 10.0,      // Scale of wave layer 1
  w2Scale: 4.0,       // Scale of wave layer 2
  w3Scale: 16.0,      // Scale of wave layer 3
}

// ─── WebGL helpers ───────────────────────────────────────────────────────────

/** Compile a single vertex or fragment shader from GLSL source. */
function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(message || 'Shader compile failed')
  }
  return shader
}

/** Link a vertex + fragment shader pair into a WebGL program. */
function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    throw new Error(message || 'Program link failed')
  }
  // Shaders are baked into the program and can be freed immediately.
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)
  return program
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function WaterShader({
  paused = false,
  timeScale = DEFAULTS.timeScale,
  alpha = DEFAULTS.alpha,
  depth = DEFAULTS.depth,
  edge = DEFAULTS.edge,
  height = DEFAULTS.height,
  w1Scale = DEFAULTS.w1Scale,
  w2Scale = DEFAULTS.w2Scale,
  w3Scale = DEFAULTS.w3Scale,
  className = '',
}) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)            // requestAnimationFrame handle
  const startTimeRef = useRef(0)      // Timestamp of the very first frame (ms)
  const pausedTimeRef = useRef(0)     // Elapsed time frozen at the moment of pause

  // ── Main WebGL lifecycle effect ──────────────────────────────────────
  // Re-runs whenever any prop changes (shader uniforms are set each frame
  // from the current closure values, so the effect must capture them).
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true })
    if (!gl) return undefined

    // Compile the water shader program.
    let program
    try {
      program = createProgram(gl, waterVertexSource, waterFragmentSource)
    } catch (error) {
      console.error('[WaterShader]', error)
      return undefined
    }

    // ── Attribute & uniform locations ────────────────────────────────
    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const uvLocation = gl.getAttribLocation(program, 'a_uv')

    const uTime = gl.getUniformLocation(program, 'u_time')
    const uTimeScale = gl.getUniformLocation(program, 'u_time_scale')
    const uResolution = gl.getUniformLocation(program, 'u_resolution')
    const uAlpha = gl.getUniformLocation(program, 'u_alpha')
    const uDepth = gl.getUniformLocation(program, 'u_depth')
    const uEdge = gl.getUniformLocation(program, 'u_edge')
    const uHeight = gl.getUniformLocation(program, 'u_height')
    const uW1 = gl.getUniformLocation(program, 'u_w1_scale')
    const uW2 = gl.getUniformLocation(program, 'u_w2_scale')
    const uW3 = gl.getUniformLocation(program, 'u_w3_scale')

    // ── Fullscreen quad geometry ────────────────────────────────────
    // Position buffer: 4-vertex triangle strip covering clip space.
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        1, 1,
      ]),
      gl.STATIC_DRAW,
    )

    // UV buffer: maps [0,0]–[1,1] for the fragment shader's texture coords.
    const uvBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0, 0,
        1, 0,
        0, 1,
        1, 1,
      ]),
      gl.STATIC_DRAW,
    )

    gl.useProgram(program)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // ── Resize handler ──────────────────────────────────────────────
    // Syncs canvas backing resolution to its CSS size × DPR (capped at 2x).
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    // ── Animation loop ──────────────────────────────────────────────
    const draw = (time) => {
      // Track elapsed time; freeze it when paused so the waves stop in place.
      if (!startTimeRef.current) startTimeRef.current = time
      const elapsed = (time - startTimeRef.current) / 1000
      const shaderTime = paused ? pausedTimeRef.current : elapsed
      if (!paused) pausedTimeRef.current = elapsed

      // Clear to transparent so the canvas composites over the page.
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(program)

      // Bind position attribute.
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      // Bind UV attribute.
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
      gl.enableVertexAttribArray(uvLocation)
      gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0)

      // Needs to be material specific.
      gl.uniform1f(uTime, shaderTime)
      gl.uniform1f(uTimeScale, timeScale)
      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform1f(uAlpha, alpha)
      gl.uniform1f(uDepth, depth)
      gl.uniform1f(uEdge, edge)
      gl.uniform1f(uHeight, height)
      gl.uniform1f(uW1, w1Scale)
      gl.uniform1f(uW2, w2Scale)
      gl.uniform1f(uW3, w3Scale)

      // Single draw call — the fragment shader does all the visual work.
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    // ── Cleanup ──────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      gl.deleteBuffer(positionBuffer)
      gl.deleteBuffer(uvBuffer)
      gl.deleteProgram(program)
    }
  }, [paused, timeScale, alpha, depth, edge, height, w1Scale, w2Scale, w3Scale])

  return <canvas ref={canvasRef} className={className} />
}
