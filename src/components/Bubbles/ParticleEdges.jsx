import { useEffect, useRef } from 'react'
import particleVertexSource from './particle.vert?raw'
import particleFragmentSource from './particle.frag?raw'

const DEFAULTS = {
  sideWidth: 140,
  count: 70,
  minRadius: 8,
  maxRadius: 22,
  minSpeed: 10,
  maxSpeed: 32,
  drift: 12,
  opacity: 0.25,
  emitterX: 0,
  emitterY: 0,
  emitterZ: 0,
  rotation: 0,
  lightX: 0.6,
  lightY: -0.6,
  lightZ: 2.0,
  outline: 0.1,
  outlineSoft: 0.04,
  outlineAlpha: 0.8,
  diffuse: 0.3,
  specular: 0.55,
  specularPower: 32,
}

function rand(min, max) {
  return Math.random() * (max - min) + min
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

function makeParticle(bounds, config) {
  const offsetX = config.emitterX * bounds.width
  const offsetY = config.emitterY * bounds.height
  return {
    x: rand(0, config.sideWidth) + offsetX,
    y: rand(0, bounds.height) + offsetY,
    r: rand(config.minRadius, config.maxRadius),
    speed: rand(config.minSpeed, config.maxSpeed),
    drift: rand(-config.drift, config.drift),
  }
}

export default function ParticleEdges({
  className = '',
  style,
  paused = false,
  sideWidth = DEFAULTS.sideWidth,
  count = DEFAULTS.count,
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
  const rafRef = useRef(0)
  const lastTimeRef = useRef(0)
  const particlesRef = useRef([])
  const configRef = useRef({})
  const boundsRef = useRef({ width: 1, height: 1, dpr: 1 })

  useEffect(() => {
    configRef.current = {
      sideWidth,
      count,
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
    sideWidth,
    count,
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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true })
    if (!gl) return undefined

    let program
    try {
      program = createProgram(gl, particleVertexSource, particleFragmentSource)
    } catch (error) {
      console.error('[ParticleEdges]', error)
      return undefined
    }

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

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, rect.width)
      const height = Math.max(1, rect.height)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      boundsRef.current = { width, height, dpr }
      gl.viewport(0, 0, canvas.width, canvas.height)

      if (!particlesRef.current.length) {
        const config = configRef.current
        particlesRef.current = Array.from({ length: config.count }, () =>
          makeParticle({ width, height }, config),
        )
      }
    }

    resize()
    window.addEventListener('resize', resize)

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
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const draw = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      let delta = (time - lastTimeRef.current) / 1000
      if (paused) {
        delta = 0
      }
      lastTimeRef.current = time
      delta = Math.min(delta, 0.05)

      const { width, height, dpr } = boundsRef.current
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
      gl.uniform2f(uResolution, width * dpr, height * dpr)

      const config = configRef.current
      const offsetX = config.emitterX * width
      const offsetY = config.emitterY * height
      const rotationRad = (config.rotation * Math.PI) / 180
      const dirX = Math.sin(rotationRad)
      const dirY = -Math.cos(rotationRad)

      const targetCount = Math.max(1, Math.floor(config.count))
      if (particlesRef.current.length !== targetCount) {
        const next = [...particlesRef.current]
        while (next.length < targetCount) {
          next.push(makeParticle(boundsRef.current, config))
        }
        particlesRef.current = next.slice(0, targetCount)
      }

      for (const particle of particlesRef.current) {
        particle.x += (dirX * particle.speed + particle.drift) * delta
        particle.y += dirY * particle.speed * delta

        if (particle.y < -particle.r) {
          const spawned = makeParticle(boundsRef.current, config)
          particle.x = spawned.x
          particle.y = height + particle.r + offsetY
          particle.r = spawned.r
          particle.speed = spawned.speed
          particle.drift = spawned.drift
        }

        if (particle.x < offsetX || particle.x > offsetX + config.sideWidth) {
          particle.x = rand(0, config.sideWidth) + offsetX
        }

        const radius = particle.r * (1 + config.emitterZ * 0.5) * dpr
        const centerX = particle.x * dpr
        const centerY = particle.y * dpr
        drawParticle(centerX, centerY, radius, config)

        const mirroredX = width * dpr - centerX
        drawParticle(mirroredX, centerY, radius, config)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      gl.deleteBuffer(quadBuffer)
      gl.deleteProgram(program)
    }
  }, [paused])

  return <canvas ref={canvasRef} className={className} style={style} />
}
