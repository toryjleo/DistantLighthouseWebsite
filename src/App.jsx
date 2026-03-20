import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import logoMark from './assets/DistantLightHouse1.png'
import WaterShader from './components/Water/WaterShader'
import ParticleEdges from './components/Bubbles/ParticleEdges'
import ProjectCard from './components/Projects/ProjectCard'

function App() {
  const [shaderDebug, setShaderDebug] = useState({
    paused: false,
    showUV: false,
    lowQuality: false,
    timeScale: 0.65,
    alpha: 0.95,
    depth: 0.62,
    edge: 0.12,
    height: 0.0,
    w1Scale: 10.0,
    w2Scale: 4.0,
    w3Scale: 16.0,
    particleCount: 70,
    particleSpawnRate: 5,
    particleScrollBurst: 0.1,
    particleMinRadius: 8,
    particleMaxRadius: 22,
    particleMinSpeed: 10,
    particleMaxSpeed: 32,
    particleDrift: 12,
    particleSwayAmount: 15,
    particleSwaySpeed: 2,
    particleSwayRandom: 0.5,
    particleOpacity: 0.25,
    particleEmitterX: 70, // 70 pixels from the edge (center of the old column width of 140)
    particleEmitterY: 1,  // Bottom of the screen
    particleEmitterZ: 0,
    particleRotation: 0,
    particleLightX: 0.6,
    particleLightY: -0.6,
    particleLightZ: 2.0,
    particleOutline: 0.1,
    particleOutlineSoft: 0.04,
    particleOutlineAlpha: 0.8,
    particleDiffuse: 0.3,
    particleSpecular: 0.55,
    particleSpecularPower: 32,
  })

  useEffect(() => {
    let mounted = true
    // Append timestamp to bust browser cache
    fetch(`${import.meta.env.BASE_URL}water-preset.json?t=${Date.now()}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((preset) => {
        if (!mounted || !preset) return
        setShaderDebug((prev) => {
          const newDebug = { ...prev }
          for (const key in preset) {
            if (key !== 'savedAt' && newDebug.hasOwnProperty(key)) {
              newDebug[key] = typeof preset[key] === 'boolean'
                ? preset[key]
                : Number(preset[key] ?? prev[key])
            }
          }
          return newDebug
        })
      })
      .catch(() => { })

    return () => {
      mounted = false
    }
  }, [])

  const downloadShaderPreset = () => {
    const preset = {
      ...shaderDebug,
      savedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(preset, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'water-shader-preset.json'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  const projects = [
    {
      name: 'Your Best Week Yet',
      description:
        'A custom platform that blends automation, data clarity, and a tailored workflow for fast-moving teams.',
      details: 'Custom theming with two brand colors.',
      theme: {
        primary: '#1eff00ff',
        secondary: '#e41111ff',
        text: '#1f1207',
      },
      media: [
        {
          type: 'video',
          src: '/YBWY/YBWY Promo v2 (no subtitles).mp4',
          label: 'Workflow Demo'
        },
        {
          type: 'image',
          src: '/YBWY/YBWY-DASHBOARD.png',
          label: 'Screenshot 01'
        },
        {
          type: 'image',
          src: '/YBWY/YBWY-WEIGHTENTRY.png',
          label: 'Screenshot 02'
        },
        {
          type: 'image',
          src: '/YBWY/YBWY-ADMIN-CONSOLE.png',
          label: 'Screenshot 03'
        },
      ],
    },
  ]

  const whyChoose = [
    'Personal attention — You work directly with the engineer building your system.',
    'Custom solutions — Designed specifically for your business, not generic templates.',
    'Technical depth — Capable of handling complex or unusual requirements.',
    'Clear communication — No jargon required.',
    'Local understanding — We work with real-world businesses, not just tech companies.',
  ]

  const exampleProblems = [
    '“We track everything in spreadsheets and it’s breaking down.”',
    '“Our staff wastes hours on manual paperwork.”',
    '“We need a system tailored to our exact workflow.”',
    '“We have data but no way to use it.”',
    '“We need an app to log field data.”',
  ]

  const serviceColumns = [
    [
      'Custom internal tools',
      'Inventory management',
      'Data dashboards & reporting tools',
      'Customer portals',
      'Booking and reservation systems',
    ],
    [
      'iOS and Android apps',
      'Windows / macOS / Linux applications',
      'API development',
      'System integrations',
      'Data migration and cleanup',
    ],
    [
      'Reporting automation',
      'Embedded systems & hardware software',
      'Simulation and visualization tools',
      'Custom algorithms',
    ],
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top fade — black gradient so bubbles dissolve smoothly */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[31] h-[30vh]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0) 100%)',
        }}
      />
      <ParticleEdges
        className="particle-edges pointer-events-none fixed left-0 top-0 z-30 block h-screen w-screen"
        paused={shaderDebug.paused}
        count={shaderDebug.particleCount}
        spawnRate={shaderDebug.particleSpawnRate}
        scrollBurst={shaderDebug.particleScrollBurst}
        minRadius={shaderDebug.particleMinRadius}
        maxRadius={shaderDebug.particleMaxRadius}
        minSpeed={shaderDebug.particleMinSpeed}
        maxSpeed={shaderDebug.particleMaxSpeed}
        drift={shaderDebug.particleDrift}
        swayAmount={shaderDebug.particleSwayAmount}
        swaySpeed={shaderDebug.particleSwaySpeed}
        swayRandom={shaderDebug.particleSwayRandom}
        opacity={shaderDebug.particleOpacity}
        emitterX={shaderDebug.particleEmitterX}
        emitterY={shaderDebug.particleEmitterY}
        emitterZ={shaderDebug.particleEmitterZ}
        rotation={shaderDebug.particleRotation}
        lightX={shaderDebug.particleLightX}
        lightY={shaderDebug.particleLightY}
        lightZ={shaderDebug.particleLightZ}
        outline={shaderDebug.particleOutline}
        outlineSoft={shaderDebug.particleOutlineSoft}
        outlineAlpha={shaderDebug.particleOutlineAlpha}
        diffuse={shaderDebug.particleDiffuse}
        specular={shaderDebug.particleSpecular}
        specularPower={shaderDebug.particleSpecularPower}
      />
      {import.meta.env.DEV && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-h-[90vh] overflow-y-auto rounded-lg border border-white/10 bg-black/80 p-4 text-xs text-white/70 backdrop-blur custom-scrollbar">
          <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-white/50">
            Shader Dev
          </p>

          <details className="mb-2 group">
            <summary className="cursor-pointer text-white font-semibold flex justify-between select-none">
              General
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 space-y-2 pl-2">
              <label className="flex items-center justify-between gap-2">
                <span>Pause time</span>
                <input
                  type="checkbox"
                  checked={shaderDebug.paused}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      paused: event.target.checked,
                    }))
                  }
                />
              </label>
            </div>
          </details>

          <details className="mb-2 group">
            <summary className="cursor-pointer text-white font-semibold flex justify-between select-none">
              Water Surface
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 space-y-3 pl-2">
              <label className="flex items-center justify-between gap-3">
                <span>Time scale</span>
                <input
                  className="w-32"
                  type="range"
                  min="0.05"
                  max="2"
                  step="0.01"
                  value={shaderDebug.timeScale}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      timeScale: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Alpha</span>
                <input
                  className="w-32"
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.01"
                  value={shaderDebug.alpha}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      alpha: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Depth</span>
                <input
                  className="w-32"
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.01"
                  value={shaderDebug.depth}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      depth: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Edge</span>
                <input
                  className="w-32"
                  type="range"
                  min="0.01"
                  max="0.3"
                  step="0.005"
                  value={shaderDebug.edge}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      edge: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Height</span>
                <input
                  className="w-32"
                  type="range"
                  min="-0.3"
                  max="0.3"
                  step="0.005"
                  value={shaderDebug.height}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      height: Number(event.target.value),
                    }))
                  }
                />
              </label>
            </div>
          </details>

          <details className="mb-2 group">
            <summary className="cursor-pointer text-white font-semibold flex justify-between select-none">
              Water Waves
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 space-y-3 pl-2">
              <label className="flex items-center justify-between gap-3">
                <span>Wave 1</span>
                <input
                  className="w-32"
                  type="range"
                  min="2"
                  max="24"
                  step="0.1"
                  value={shaderDebug.w1Scale}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      w1Scale: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Wave 2</span>
                <input
                  className="w-32"
                  type="range"
                  min="2"
                  max="24"
                  step="0.1"
                  value={shaderDebug.w2Scale}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      w2Scale: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Wave 3</span>
                <input
                  className="w-32"
                  type="range"
                  min="2"
                  max="24"
                  step="0.1"
                  value={shaderDebug.w3Scale}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      w3Scale: Number(event.target.value),
                    }))
                  }
                />
              </label>
            </div>
          </details>

          <details className="mb-2 group" open>
            <summary className="cursor-pointer text-white font-semibold flex justify-between select-none">
              Particle Physics
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 space-y-3 pl-2">
              <label className="flex items-center justify-between gap-3">
                <span>Max Count</span>
                <input
                  className="w-32"
                  type="range"
                  min="10"
                  max="500"
                  step="1"
                  value={shaderDebug.particleCount}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleCount: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Spawn Rate</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={shaderDebug.particleSpawnRate}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleSpawnRate: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Scroll Burst</span>
                <input
                  className="w-32"
                  type="range"
                  min="0.001"
                  max="0.5"
                  step="0.001"
                  value={shaderDebug.particleScrollBurst}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleScrollBurst: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Size min</span>
                <input
                  className="w-32"
                  type="range"
                  min="2"
                  max="150"
                  step="1"
                  value={shaderDebug.particleMinRadius}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleMinRadius: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Size max</span>
                <input
                  className="w-32"
                  type="range"
                  min="4"
                  max="200"
                  step="1"
                  value={shaderDebug.particleMaxRadius}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleMaxRadius: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Speed min</span>
                <input
                  className="w-32"
                  type="range"
                  min="2"
                  max="300"
                  step="1"
                  value={shaderDebug.particleMinSpeed}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleMinSpeed: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Speed max</span>
                <input
                  className="w-32"
                  type="range"
                  min="4"
                  max="500"
                  step="1"
                  value={shaderDebug.particleMaxSpeed}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleMaxSpeed: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Drift</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={shaderDebug.particleDrift}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleDrift: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Sway Amount</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={shaderDebug.particleSwayAmount}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleSwayAmount: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Sway Speed</span>
                <input
                  className="w-32"
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={shaderDebug.particleSwaySpeed}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleSwaySpeed: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Sway Random</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={shaderDebug.particleSwayRandom}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleSwayRandom: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Spawn X (px)</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
                  max="500"
                  step="1"
                  value={shaderDebug.particleEmitterX}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleEmitterX: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Spawn Y</span>
                <input
                  className="w-32"
                  type="range"
                  min="-0.2"
                  max="1.2"
                  step="0.01"
                  value={shaderDebug.particleEmitterY}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleEmitterY: Number(event.target.value),
                    }))
                  }
                />
              </label>
            </div>
          </details>

          <details className="mb-2 group">
            <summary className="cursor-pointer text-white font-semibold flex justify-between select-none">
              Particle Lighting
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 space-y-3 pl-2">
              <label className="flex items-center justify-between gap-3">
                <span>Opacity</span>
                <input
                  className="w-32"
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.01"
                  value={shaderDebug.particleOpacity}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleOpacity: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Emit Z / Radius Scale</span>
                <input
                  className="w-32"
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={shaderDebug.particleEmitterZ}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleEmitterZ: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Light X</span>
                <input
                  className="w-32"
                  type="range"
                  min="-3"
                  max="3"
                  step="0.05"
                  value={shaderDebug.particleLightX}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleLightX: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Light Y</span>
                <input
                  className="w-32"
                  type="range"
                  min="-3"
                  max="3"
                  step="0.05"
                  value={shaderDebug.particleLightY}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleLightY: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Light Z</span>
                <input
                  className="w-32"
                  type="range"
                  min="0.1"
                  max="6"
                  step="0.05"
                  value={shaderDebug.particleLightZ}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleLightZ: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Outline</span>
                <input
                  className="w-32"
                  type="range"
                  min="0.02"
                  max="0.4"
                  step="0.01"
                  value={shaderDebug.particleOutline}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleOutline: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Outline soft</span>
                <input
                  className="w-32"
                  type="range"
                  min="0.005"
                  max="0.2"
                  step="0.005"
                  value={shaderDebug.particleOutlineSoft}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleOutlineSoft: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Outline alpha</span>
                <input
                  className="w-32"
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.01"
                  value={shaderDebug.particleOutlineAlpha}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleOutlineAlpha: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Diffuse</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={shaderDebug.particleDiffuse}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleDiffuse: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Specular</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
                  max="2"
                  step="0.01"
                  value={shaderDebug.particleSpecular}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleSpecular: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Spec power</span>
                <input
                  className="w-32"
                  type="range"
                  min="2"
                  max="96"
                  step="1"
                  value={shaderDebug.particleSpecularPower}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleSpecularPower: Number(event.target.value),
                    }))
                  }
                />
              </label>
            </div>
          </details>

          <button
            type="button"
            onClick={downloadShaderPreset}
            className="mt-4 w-full rounded-md border border-white/20 px-3 py-2 text-[10px] uppercase tracking-[0.35em] text-white/70 transition hover:border-white/60 hover:text-white"
          >
            Save preset
          </button>
        </div>
      )}
      <header className="navbar-scene fixed left-0 right-0 top-0 z-40 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24">
          <WaterShader
            paused={shaderDebug.paused}
            timeScale={shaderDebug.timeScale}
            alpha={shaderDebug.alpha}
            depth={shaderDebug.depth}
            edge={shaderDebug.edge}
            height={shaderDebug.height}
            w1Scale={shaderDebug.w1Scale}
            w2Scale={shaderDebug.w2Scale}
            w3Scale={shaderDebug.w3Scale}
            className="h-full w-full"
          />
        </div>
        <div className="mx-auto max-w-6xl px-6 pt-4 text-[11px] italic text-black/70">
          “A distant lighthouse guides ships safely through unfamiliar waters.
          Contact us today!”
        </div>
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 pb-6 pt-4">
          <div className="flex items-center gap-4">
            <motion.img
              src={logoMark}
              alt="Distant Lighthouse logo"
              className="h-16 w-16 rounded-full border border-black/15 bg-white object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-black">
              Distant Lighthouse
            </div>
          </div>
          <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-black/70 sm:flex">
            <a href="#hero" className="hover:text-black">
              Home
            </a>
            <a href="#projects" className="hover:text-black">
              Projects
            </a>
            <a href="#problems" className="hover:text-black">
              Problems
            </a>
            <a href="#services" className="hover:text-black">
              Services
            </a>
            <a href="#workflow" className="hover:text-black">
              Workflow
            </a>
            <a href="#contact" className="hover:text-black">
              Contact
            </a>
          </div>
        </nav>
      </header>

      <main className="pt-24">
        <section
          id="hero"
          className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center px-6 py-28"
        >
          <motion.div
            className="max-w-2xl space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Mercer, Maine • Software Contracting
            </p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              This website was created in 3 hours.
            </h1>
            <div className="space-y-4 text-base text-white/70 sm:text-lg">
              <p>
                Based in Mercer, Maine, Distant Lighthouse is an independent
                software development firm with 10 years of computer science and
                software engineering experience. We offer faster solutions with
                cutting edge AI development practices.
              </p>
              <p>
                We specialize in solving problems that off-the-shelf software
                cannot.
              </p>
              <p>
                We partner with organizations of all sizes — from small local
                businesses to technical teams — and can collaborate with our
                partners at{' '}
                <a
                  href="https://goldensoft.llc"
                  className="text-white underline decoration-white/30 underline-offset-4 transition hover:text-white"
                >
                  Goldensoft
                </a>{' '}
                when projects require additional scale.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white/60"
              >
                Start a project
              </a>
              <a
                href="#services"
                className="rounded-full border border-white/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
              >
                View services
              </a>
            </div>
          </motion.div>
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-black to-black" />
        </section>

        <motion.section
          id="projects"
          className="mx-auto max-w-6xl px-6 py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="mb-12 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Custom Projects
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Easily expandable projects with bespoke theming.
            </h2>
          </div>
          <div className="space-y-10">
            {projects.map((project) => (
              <ProjectCard
                key={project.name}
                name={project.name}
                description={project.description}
                details={project.details}
                theme={project.theme}
                media={project.media}
              />
            ))}
          </div>
        </motion.section>



        <motion.section
          id="problems"
          className="mx-auto max-w-6xl px-6 py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="mb-12 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Sound Familiar?
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Example Problems We Solve
            </h2>
          </div>
          <motion.ul
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {exampleProblems.map((item) => (
              <motion.li
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-lg text-white/70"
                variants={{
                  hidden: { opacity: 0, x: -15 },
                  visible: { opacity: 1, x: 0 },
                }}
                whileHover={{ y: -4, boxShadow: '0 0 20px rgba(255,255,255,0.08)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
          <p className="mt-8 text-base text-white/70">
            If your organization says "There must be a better way," we can
            build it.
          </p>
        </motion.section>

        <motion.section
          id="services"
          className="mx-auto max-w-6xl px-6 py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="mb-12 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Services
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              What we build.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {serviceColumns.map((column, index) => (
              <motion.div
                key={`service-column-${index}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
                whileHover={{ y: -4, boxShadow: '0 0 20px rgba(255,255,255,0.08)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <motion.ul
                  className="space-y-3 text-sm text-white/70"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ staggerChildren: 0.08 }}
                >
                  {column.map((item) => (
                    <motion.li
                      key={item}
                      variants={{
                        hidden: { opacity: 0, x: -15 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="workflow"
          className="mx-auto max-w-6xl px-6 py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="mb-12 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Workflow
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              How engagements work.
            </h2>
          </div>
          <motion.ol
            className="flex flex-col gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {[
              'Initial consultation (no obligation)',
              'Problem definition and feature assessment',
              'Feature/progress definition in work tracking software',
              'Development with feedback',
              'Deployment and support',
            ].map((step, i) => (
              <motion.li
                key={step}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-lg text-white/70"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -4, boxShadow: '0 0 20px rgba(255,255,255,0.08)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <span className="font-semibold text-white">{i + 1}.</span> {step}
              </motion.li>
            ))}
          </motion.ol>
        </motion.section>

        <motion.section
          id="contact"
          className="mx-auto max-w-6xl px-6 py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Contact
                </p>
                <h2 className="text-3xl font-semibold sm:text-4xl">
                  Ready to map the next build?
                </h2>
                <p className="text-base text-white/70">
                  Contact us for timelines, scoping, and the right technical
                  approach.
                </p>
                <div className="space-y-2 text-sm text-white/70">
                  <p>toryjleo@distantlighthouse.com</p>
                  <p>(207) 509-8613</p>
                  <a
                    href="mailto:toryjleo@distantlighthouse.com"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white/60"
                  >
                    Start the conversation
                  </a>
                </div>
                <div className="pt-4 text-sm text-white/60">
                  Social:{' '}
                  <a
                    href="https://linkedin.com/distant-lighthouse-llc"
                    className="text-white underline decoration-white/30 underline-offset-4 transition hover:text-white"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
              <form className="w-full max-w-md space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-white/40"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-white/40"
                />
                <textarea
                  rows="4"
                  placeholder="Tell us about your project"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-white/40"
                />
                <button
                  type="button"
                  className="w-full rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white/60"
                >
                  Request a consult
                </button>
              </form>
            </div>
            <div className="mt-12 border-t border-white/10 pt-8">
              <blockquote className="quote-block text-sm text-white/70">
                "A stormy wind may drive sleet against inland meadows sufficiently
                to arouse sympathy for the men who patrol the streets; but seldom
                on such nights do thoughts of people nowadays drift to the men
                in solitary outposts of the seaboard who are confined to the
                narrow cabin of a lightship, or to those who watch in the towers
                of lighthouses perched on the bleak headlands of the coast or on
                sunken ledges. These men keep a quiet but effective watch which
                makes a naturally inhospitable coast at least a navigable one.
                Remote and unknown, they are the guardians of the coast; and man
                must still keep constant vigil against the treachery of wind and
                water.""
              </blockquote>
              <p className="mt-4 text-xs text-white/50">
                LIGHTHOUSES OF THE MAINE COAST — Robert T. Sterling.
              </p>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/40">
        © 2026 Distant Lighthouse. All rights reserved.
      </footer>
    </div >
  )
}

export default App
