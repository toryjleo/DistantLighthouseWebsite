import { useEffect, useRef } from 'react'

const DEFAULTS = {
  sideWidth: 140,
  count: 70,
  minRadius: 0.8,
  maxRadius: 2.6,
  minSpeed: 12,
  maxSpeed: 38,
  drift: 10,
  opacity: 0.18,
  color: [255, 255, 255],
}

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function createParticle(bounds, config) {
  return {
    x: rand(0, config.sideWidth),
    y: rand(0, bounds.height),
    r: rand(config.minRadius, config.maxRadius),
    speed: rand(config.minSpeed, config.maxSpeed),
    drift: rand(-config.drift, config.drift),
    alpha: rand(config.opacity * 0.6, config.opacity),
  }
}

export default function ParticleEdges({ className = '' }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const particlesRef = useRef([])
  const boundsRef = useRef({ width: 1, height: 1, dpr: 1 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const config = DEFAULTS

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      boundsRef.current = { width, height, dpr }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (!particlesRef.current.length) {
        particlesRef.current = Array.from({ length: config.count }, () =>
          createParticle({ width, height }, config),
        )
      }
    }

    resize()
    window.addEventListener('resize', resize)

    let lastTime = performance.now()

    const draw = (time) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time

      const { width, height } = boundsRef.current
      ctx.clearRect(0, 0, width, height)

      for (const particle of particlesRef.current) {
        particle.y -= particle.speed * delta
        particle.x += particle.drift * delta

        if (particle.y < -particle.r) {
          particle.y = height + particle.r
          particle.x = rand(0, config.sideWidth)
          particle.r = rand(config.minRadius, config.maxRadius)
          particle.speed = rand(config.minSpeed, config.maxSpeed)
          particle.drift = rand(-config.drift, config.drift)
          particle.alpha = rand(config.opacity * 0.6, config.opacity)
        }

        if (particle.x < 0 || particle.x > config.sideWidth) {
          particle.x = rand(0, config.sideWidth)
        }

        const [r, g, b] = config.color
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.alpha})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2)
        ctx.fill()

        const mirroredX = width - particle.x
        ctx.beginPath()
        ctx.arc(mirroredX, particle.y, particle.r, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}
