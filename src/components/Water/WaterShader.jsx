import { useEffect, useRef } from 'react'
import waterVertexSource from './water.vert?raw'
import waterFragmentSource from './water.frag?raw'

const DEFAULTS = {
  timeScale: 0.65,
  alpha: 0.9,
  depth: 0.65,
  edge: 0.08,
  height: 0.0,
  w1Scale: 10.0,
  w2Scale: 4.0,
  w3Scale: 16.0,
}

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
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)
  return program
}

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
  const rafRef = useRef(0)
  const startTimeRef = useRef(0)
  const pausedTimeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true })
    if (!gl) return undefined

    let program
    try {
      program = createProgram(gl, waterVertexSource, waterFragmentSource)
    } catch (error) {
      console.error('[WaterShader]', error)
      return undefined
    }

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

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time
      const elapsed = (time - startTimeRef.current) / 1000
      const shaderTime = paused ? pausedTimeRef.current : elapsed
      if (!paused) pausedTimeRef.current = elapsed

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(program)

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
      gl.enableVertexAttribArray(uvLocation)
      gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0)

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

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

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
