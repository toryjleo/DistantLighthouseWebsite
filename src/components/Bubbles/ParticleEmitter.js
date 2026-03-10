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
        baseX: offsetX,
        r: rand(config.minRadius, config.maxRadius),
        speed: rand(config.minSpeed, config.maxSpeed),
        drift: rand(-config.drift, config.drift),
        phase: Math.random() * Math.PI * 2,
        swayScale: 1.0 - config.swayRandom * 0.5 + Math.random() * config.swayRandom,
        age: 0,
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
     * Initializes the particle pool.
     */
    init(bounds, config) {
        this.particles = []
        this.syncCount(config.count)
    }

    /**
     * Spawns a sudden burst of particles.
     * @param {number} count - How many particles to attempt to spawn.
     * @param {Object} bounds - The window bounds.
     * @param {Object} config - Particle configuration.
     */
    spawnBurst(count, bounds, config) {
        let spawned = 0
        for (let i = 0; i < this.particles.length; i++) {
            if (!this.particles[i].active) {
                const newParticleData = makeParticle(bounds, config)
                this.particles[i].x = newParticleData.x
                this.particles[i].y = newParticleData.y
                this.particles[i].baseX = newParticleData.baseX
                this.particles[i].r = newParticleData.r
                this.particles[i].speed = newParticleData.speed
                this.particles[i].drift = newParticleData.drift
                this.particles[i].phase = newParticleData.phase
                this.particles[i].swayScale = newParticleData.swayScale
                this.particles[i].age = 0
                this.particles[i].active = true
                spawned++
                if (spawned >= count) break
            }
        }
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
                    baseX: 0,
                    r: 0,
                    speed: 0,
                    drift: 0,
                    phase: 0,
                    swayScale: 1,
                    age: 0,
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

        // 1. Ambient spawning — controlled by the Spawn Rate slider
        const ambientRate = config.spawnRate
        this.timeSinceLastSpawn += deltaTime
        const spawnInterval = 1.0 / ambientRate
        while (this.timeSinceLastSpawn >= spawnInterval) {
            const p = this.firstUnusedParticle()
            if (p) {
                const data = makeParticle(bounds, config)
                p.x = data.x
                p.y = data.y
                p.baseX = data.baseX
                p.r = data.r
                p.speed = data.speed
                p.drift = data.drift
                p.phase = data.phase
                p.swayScale = data.swayScale
                p.age = 0
                p.active = true
            }
            this.timeSinceLastSpawn -= spawnInterval
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
                // Update position
                p.age += deltaTime
                p.y -= p.speed * deltaTime
                p.baseX += p.drift * deltaTime

                // Sine wave horizontal sway (per-bubble randomization via swayScale)
                p.x = p.baseX + Math.sin(p.age * config.swaySpeed * p.swayScale + p.phase) * config.swayAmount * p.swayScale

                // Despawn if it crosses the top bounds
                if (p.y < -p.r) {
                    p.active = false
                }
            }
        }
    }
}
