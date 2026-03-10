/** Return a random float in [min, max). */
export function rand(min, max) {
    return Math.random() * (max - min) + min
}

/**
 * Creates a new inactive particle at the exact specified emitter position.
 */
export function makeParticle(bounds, config) {
    const offsetX = config.emitterX // Absolute pixels from the left edge
    const offsetY = config.emitterY * bounds.height
    return {
        x: offsetX,
        y: offsetY,
        r: rand(config.minRadius, config.maxRadius),
        speed: rand(config.minSpeed, config.maxSpeed),
        drift: rand(-config.drift, config.drift),
        active: false,
    }
}

export default class ParticleEmitter {
    constructor() {
        this.particles = []
        this.timeSinceLastSpawn = 0
    }

    /**
     * Finds the first particle in the pool that is not currently active.
     */
    firstUnusedParticle() {
        for (let i = 0; i < this.particles.length; i++) {
            if (!this.particles[i].active) {
                return this.particles[i]
            }
        }
        return null
    }

    /**
     * Initializes or resizes the particle pool.
     */
    syncCount(count) {
        if (this.particles.length !== count) {
            // Keep existing particles, but cap at count
            this.particles = this.particles.slice(0, count)
            // Fill the rest with inactive particles
            while (this.particles.length < count) {
                this.particles.push({
                    x: 0,
                    y: 0,
                    r: 0,
                    speed: 0,
                    drift: 0,
                    active: false,
                })
            }
        }
    }

    /**
     * Updates the particle simulation by deltaTime (in seconds).
     */
    update(deltaTime, bounds, config) {
        this.syncCount(config.count)

        // 1. Spawning logic
        if (config.spawnRate > 0) {
            this.timeSinceLastSpawn += deltaTime
            const spawnInterval = 1.0 / config.spawnRate

            // Spawn as many particles as we need to catch up to the current time
            while (this.timeSinceLastSpawn >= spawnInterval) {
                const p = this.firstUnusedParticle()
                if (p) {
                    // Revive the particle at the exact emitter position
                    const newParticleData = makeParticle(bounds, config)
                    p.x = newParticleData.x
                    p.y = newParticleData.y
                    p.r = newParticleData.r
                    p.speed = newParticleData.speed
                    p.drift = newParticleData.drift
                    p.active = true
                }
                this.timeSinceLastSpawn -= spawnInterval
            }
        }

        // 2. Physics & Despawn logic
        // We despawn when particles go above the top of the canvas (y < -maxRadius).
        // Since we draw upwards, the canvas coordinates might need checking. 
        // In this implementation, Y goes from 0 at top to bounds.height at bottom.
        // Or if standard WebGL, maybe different. Let's assume standard 2D canvas origin (0,0) at top-left.
        // Wait, the previous logic was: `p.y -= p.speed * dt`. So smaller Y is higher.

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i]
            if (p.active) {
                // Update variables (speed and drift)
                p.y -= p.speed * deltaTime
                p.x += p.drift * deltaTime

                // Despawn if it crosses the top bounds
                if (p.y < -p.r) {
                    p.active = false
                }
            }
        }
    }
}
