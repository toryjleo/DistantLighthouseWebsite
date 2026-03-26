import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import WaterShader from './components/Water/WaterShader'
import ParticleEdges from './components/Bubbles/ParticleEdges'
import About from './pages/About'
import Projects from './pages/Projects'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Quote from './pages/Quote'

const navItems = [
  { to: '/', label: 'About', end: true },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

const logoMark = encodeURI('/Distant Lighthouse_ICON - B&W.jpg')

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

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
    particleEmitterX: 70,
    particleEmitterY: 1,
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

  return (
    <div className="min-h-screen bg-black text-white">
      <ScrollToTop />
      <div className="bubble-fade pointer-events-none fixed inset-x-0 top-0 z-[31] h-[30vh]" />
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
                  min="0"
                  max="1"
                  step="0.01"
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
                <span>Min Radius</span>
                <input
                  className="w-32"
                  type="range"
                  min="2"
                  max="30"
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
                <span>Max Radius</span>
                <input
                  className="w-32"
                  type="range"
                  min="4"
                  max="60"
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
                <span>Min Speed</span>
                <input
                  className="w-32"
                  type="range"
                  min="1"
                  max="50"
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
                <span>Max Speed</span>
                <input
                  className="w-32"
                  type="range"
                  min="1"
                  max="80"
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
                  max="60"
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
                <span>Sway</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
                  max="50"
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
                  min="0"
                  max="6"
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
                <span>Opacity</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
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
                <span>Emitter X</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
                  max="200"
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
                <span>Emitter Y</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
                  max="300"
                  step="1"
                  value={shaderDebug.particleEmitterY}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleEmitterY: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Emitter Z</span>
                <input
                  className="w-32"
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
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
                <span>Rotation</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
                  max="6.28"
                  step="0.01"
                  value={shaderDebug.particleRotation}
                  onChange={(event) =>
                    setShaderDebug((prev) => ({
                      ...prev,
                      particleRotation: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Light X</span>
                <input
                  className="w-32"
                  type="range"
                  min="-2"
                  max="2"
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
                  min="-2"
                  max="2"
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
                  min="0"
                  max="4"
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
                  min="0"
                  max="1"
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
                <span>Outline Soft</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
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
                <span>Outline Alpha</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
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
                <span>Spec</span>
                <input
                  className="w-32"
                  type="range"
                  min="0"
                  max="1"
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
      <header className="navbar-scene fixed left-0 right-0 top-0 z-40 h-28 overflow-hidden sm:h-32">
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
        <div className="mx-auto flex max-w-6xl items-start justify-between px-6 pt-4 sm:pl-28">
          <NavLink to="/" className="flex items-center gap-4">
            <motion.img
              src={logoMark}
              alt="Distant Lighthouse logo"
              className="h-14 w-14 rounded-full border border-black/15 bg-white object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-black">
              Distant Lighthouse
            </div>
          </NavLink>
          <NavLink
            to="/quote"
            className="hidden text-[11px] italic text-black/70 transition hover:text-black sm:block"
          >
            “A distant lighthouse guides ships safely through unfamiliar waters.”
          </NavLink>
        </div>
      </header>

      <aside className="fixed left-0 top-0 z-50 flex h-screen w-20 flex-col items-center justify-between border-r border-white/10 py-6 sm:w-24">
        <div />
        <nav className="flex w-full flex-col items-center gap-4 px-2 text-[10px] uppercase tracking-[0.12em] text-white/80 sm:px-2 sm:text-[11px] sm:tracking-[0.22em]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `text-center leading-tight transition ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="text-[9px] uppercase tracking-[0.4em] text-white/30">
          © 2026
        </div>
      </aside>

      <main className="pt-28 pl-20 sm:pl-28">
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="*" element={<About />} />
        </Routes>
      </main>

      <footer className="border-t border-white/10 py-8 pl-20 text-center text-xs text-white/40 sm:pl-28">
        © 2026 Distant Lighthouse. All rights reserved.
      </footer>
    </div>
  )
}

export default App
