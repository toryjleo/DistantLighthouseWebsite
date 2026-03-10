function rand(min, max) {
    return Math.random() * (max - min) + min
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

/** A CPU implementation of a particle emitter. */
export default class ParticleEmitter {
    constructor() {
        this.particles = []
    }

    /** Populate the initial particle array. */
    init(bounds, config) {
        const count = Math.max(1, Math.floor(config.count))
        this.particles = Array.from({ length: count }, () =>
            makeParticle(bounds, config),
        )
    }

    /** Grow or shrink the particle array to match config.count. */
    syncCount(bounds, config) {
        const targetCount = Math.max(1, Math.floor(config.count))
        if (this.particles.length === targetCount) return

        while (this.particles.length < targetCount) {
            this.particles.push(makeParticle(bounds, config))
        }
        this.particles.length = targetCount
    }

    /**
     * Advance every particle by one time-step.
     * Handles movement along the rotation direction, respawning particles
     * that leave the top of the canvas, and clamping X within the emitter band.
     */
    update(delta, bounds, config) {
        const { width, height } = bounds
        const offsetX = config.emitterX * width
        const offsetY = config.emitterY * height
        const rotationRad = (config.rotation * Math.PI) / 180
        const dirX = Math.sin(rotationRad)
        const dirY = -Math.cos(rotationRad)

        for (const p of this.particles) {
            p.x += (dirX * p.speed + p.drift) * delta
            p.y += dirY * p.speed * delta

            // Respawn at the bottom when a particle drifts above the canvas.
            if (p.y < -p.r) {
                const spawned = makeParticle(bounds, config)
                p.x = spawned.x
                p.y = height + p.r + offsetY
                p.r = spawned.r
                p.speed = spawned.speed
                p.drift = spawned.drift
            }

            // Wrap horizontally within the emitter band.
            if (p.x < offsetX || p.x > offsetX + config.sideWidth) {
                p.x = rand(0, config.sideWidth) + offsetX
            }
        }
    }
}
