/**
 * ParticleEdges — WebGL component that renders lit, outlined sphere particles
 * streaming up both edges of the canvas.
 *
 * Simulation is handled by ParticleEmitter; this component is responsible for
 * the WebGL context, shader program, per-frame rendering, and the horizontal
 * mirror effect that places particles on both the left and right sides.
 */
import { useEffect, useRef } from 'react'
import particleVertexSource from './particle.vert?raw'
import particleFragmentSource from './particle.frag?raw'
import ParticleEmitter from './ParticleEmitter'

// ─── Default prop values ─────────────────────────────────────────────────────
const DEFAULTS = {
  count: 70,              // Max number of pooled particles
  spawnRate: 5,           // Particles to spawn per second
  minRadius: 8,           // Minimum sphere radius in CSS pixels
  maxRadius: 22,          // Maximum sphere radius in CSS pixels
  minSpeed: 10,           // Minimum upward speed (px/s)
  maxSpeed: 32,           // Maximum upward speed (px/s)
  drift: 12,              // Maximum horizontal drift (px/s, applied ±)
  opacity: 0.25,          // Per-particle alpha
  emitterX: 0,            // Horizontal origin offset (0-1, fraction of width)
  emitterY: 0,            // Vertical origin offset   (0-1, fraction of height)
  emitterZ: 0,            // Depth factor — scales particle radius
  rotation: 0,            // Travel direction in degrees (0 = straight up)
  lightX: 0.6,            // Light direction X component
  lightY: -0.6,           // Light direction Y component
  lightZ: 2.0,            // Light direction Z component
  outline: 0.1,           // Outline thickness (normalised)
  outlineSoft: 0.04,      // Outline softness / feather
  outlineAlpha: 0.8,      // Outline opacity
  diffuse: 0.3,           // Diffuse lighting intensity
  specular: 0.55,         // Specular highlight intensity
  specularPower: 32,      // Specular exponent (shininess)
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

export default function ParticleEdges({
  className = '',
  style,
  paused = false,
  count = DEFAULTS.count,
  spawnRate = DEFAULTS.spawnRate,
  scrollBurst = 0.1,
  minRadius = DEFAULTS.minRadius,
  maxRadius = DEFAULTS.maxRadius,
  minSpeed = DEFAULTS.minSpeed,
  maxSpeed = DEFAULTS.maxSpeed,
  drift = DEFAULTS.drift,
  opacity = DEFAULTS.opacity,
  emitterX = DEFAULTS.emitterX,
  emitterY = DEFAULTS.emitterY,
  emitterZ = DEFAULTS.emitterZ,
  rotation = DEFAULTS.rotation,
  lightX = DEFAULTS.lightX,
  lightY = DEFAULTS.lightY,
  lightZ = DEFAULTS.lightZ,
  outline = DEFAULTS.outline,
  outlineSoft = DEFAULTS.outlineSoft,
  outlineAlpha = DEFAULTS.outlineAlpha,
  diffuse = DEFAULTS.diffuse,
  specular = DEFAULTS.specular,
  specularPower = DEFAULTS.specularPower,
}) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)               // requestAnimationFrame handle
  const lastTimeRef = useRef(0)          // Timestamp of the previous frame (ms)
  const emitterRef = useRef(new ParticleEmitter())
  const configRef = useRef({})           // Latest config snapshot for the RAF loop
  const boundsRef = useRef({ width: 1, height: 1, dpr: 1 })

  // ── Sync props into a mutable ref so the animation loop always reads
  //    the latest values without tearing down the WebGL context. ──────────
  useEffect(() => {
    configRef.current = {
      count,
      spawnRate,
      scrollBurst,
      minRadius,
      maxRadius,
      minSpeed,
      maxSpeed,
      drift,
      opacity,
      emitterX,
      emitterY,
      emitterZ,
      rotation,
      lightX,
      lightY,
      lightZ,
      outline,
      outlineSoft,
      outlineAlpha,
      diffuse,
      specular,
      specularPower,
    }
  }, [
    count,
    spawnRate,
    scrollBurst,
    minRadius,
    maxRadius,
    minSpeed,
    maxSpeed,
    drift,
    opacity,
    emitterX,
    emitterY,
    emitterZ,
    rotation,
    lightX,
    lightY,
    lightZ,
    outline,
    outlineSoft,
    outlineAlpha,
    diffuse,
    specular,
    specularPower,
  ])

  // ── Main WebGL lifecycle effect ────────────────────────────────────────
  // Re-runs only when `paused` changes (all other config is read via ref).
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true })
    if (!gl) return undefined

    // Compile the particle sphere shader program.
    let program
    try {
      program = createProgram(gl, particleVertexSource, particleFragmentSource)
    } catch (error) {
      console.error('[ParticleEdges]', error)
      return undefined
    }

    // ── Attribute & uniform locations ──────────────────────────────────
    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const uResolution = gl.getUniformLocation(program, 'u_resolution')
    const uCenter = gl.getUniformLocation(program, 'u_center')
    const uRadius = gl.getUniformLocation(program, 'u_radius')
    const uLight = gl.getUniformLocation(program, 'u_light_pos')
    const uOutline = gl.getUniformLocation(program, 'u_outline')
    const uOutlineSoft = gl.getUniformLocation(program, 'u_outline_soft')
    const uOutlineAlpha = gl.getUniformLocation(program, 'u_outline_alpha')
    const uDiffuse = gl.getUniformLocation(program, 'u_diffuse')
    const uSpecular = gl.getUniformLocation(program, 'u_specular')
    const uSpecularPower = gl.getUniformLocation(program, 'u_specular_power')
    const uAlpha = gl.getUniformLocation(program, 'u_alpha')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')

    // ── Fullscreen quad geometry ──────────────────────────────────────
    // A 4-vertex triangle strip covering clip space (-1 to 1).
    // Each particle is drawn by issuing a draw call on this same quad;
    // the fragment shader uses u_center / u_radius to compute the sphere.
    const quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
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

    gl.useProgram(program)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const emitter = emitterRef.current

    // ── Resize handler ────────────────────────────────────────────────
    // Syncs the canvas backing resolution to its CSS size × DPR.
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, rect.width)
      const height = Math.max(1, rect.height)
      const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap DPR at 2x
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      boundsRef.current = { width, height, dpr }
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    // ── Interaction handlers ──────────────────────────────────────────
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', onMouseMove)

    let scrollDistance = 0
    let lastScrollY = window.scrollY
    let scrollTimer = null
    const onScroll = () => {
      const currentScrollY = window.scrollY
      scrollDistance += Math.abs(currentScrollY - lastScrollY)
      lastScrollY = currentScrollY

      if (scrollTimer) clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        // Scroll ended! Spawn bubbles based on distance
        // 1 particle per 10px scrolled, up to the max count limit
        const activeConfig = configRef.current
        const burstCount = Math.min(
          Math.floor(scrollDistance * activeConfig.scrollBurst),
          activeConfig.count
        )
        if (burstCount > 0) {
          emitter.spawnBurst(burstCount, boundsRef.current, activeConfig)
        }
        scrollDistance = 0
      }, 150)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── Per-particle draw call ────────────────────────────────────────
    // Sets all per-particle uniforms (center, radius, material) and
    // issues a single TRIANGLE_STRIP draw on the shared quad buffer.
    const drawParticle = (centerX, centerY, radius, config) => {
      gl.uniform2f(uCenter, centerX, centerY)
      gl.uniform1f(uRadius, radius)
      gl.uniform3f(uLight, config.lightX, config.lightY, config.lightZ)
      gl.uniform1f(uOutline, config.outline)
      gl.uniform1f(uOutlineSoft, config.outlineSoft)
      gl.uniform1f(uOutlineAlpha, config.outlineAlpha)
      gl.uniform1f(uDiffuse, config.diffuse)
      gl.uniform1f(uSpecular, config.specular)
      gl.uniform1f(uSpecularPower, config.specularPower)
      gl.uniform1f(uAlpha, config.opacity)
      gl.uniform2f(uMouse, mouseX, mouseY)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    // ── Animation loop ────────────────────────────────────────────────
    const draw = (time) => {
      // Compute delta time in seconds, clamped to 50ms to avoid large
      // jumps when the tab is backgrounded or the frame stutters.
      if (!lastTimeRef.current) lastTimeRef.current = time
      let delta = (time - lastTimeRef.current) / 1000
      if (paused) {
        delta = 0
      }
      lastTimeRef.current = time
      delta = Math.min(delta, 0.05)

      const bounds = boundsRef.current
      const { width, dpr } = bounds
      const config = configRef.current

      // Clear to transparent so the canvas composites over the page.
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      // Bind shared state for the frame.
      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
      gl.uniform2f(uResolution, width * dpr, bounds.height * dpr)

      // --- Particle simulation (delegated to ParticleEmitter) ---
      emitter.update(delta, bounds, config)

      // --- Render each particle + its horizontal mirror ---
      // The mirror creates the symmetrical "edges" effect: particles on
      // the left are duplicated at (canvasWidth - x) on the right.
      for (const p of emitter.particles) {
        if (!p.active) continue

        const radius = p.r * (1 + config.emitterZ * 0.5) * dpr
        const centerX = p.x * dpr
        const centerY = p.y * dpr
        drawParticle(centerX, centerY, radius, config)

        const mirroredX = width * dpr - centerX
        drawParticle(mirroredX, centerY, radius, config)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    // ── Cleanup ────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      if (scrollTimer) clearTimeout(scrollTimer)
      gl.deleteBuffer(quadBuffer)
      gl.deleteProgram(program)
    }
  }, [paused])

  return <canvas ref={canvasRef} className={className} style={style} />
}
