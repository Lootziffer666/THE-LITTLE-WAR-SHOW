/**
 * App shell: the WebGPU canvas (with automatic WebGL2 fallback), the scene
 * graph, the systems (lighting, atmosphere, controls, post), and the 2D
 * overlays (boot veil + director HUD). If no GPU backend can start, we show an
 * honest fatal message instead of a black screen.
 */
import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { createRenderer, isWebGPUBackend } from './r3f-webgpu'
import { CAMERA } from './config/theater.config'
import { Theater } from './components/Theater'
import { DebugProbe } from './components/DebugProbe'
import { Lighting } from './systems/Lighting'
import { Atmosphere } from './systems/Atmosphere'
import { Controls } from './systems/Controls'
import { PostFX } from './systems/PostFX'
import { DirectorHUD } from './ui/DirectorHUD'
import { Loader } from './ui/Loader'
import { useTheaterStore } from './state/useTheaterStore'

function urlHasFlag(name: string): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has(name)
}

export function App() {
  const [fatal, setFatal] = useState<string | null>(null)
  const [warn, setWarn] = useState<string | null>(null)
  const setBackend = useTheaterStore((s) => s.setBackend)
  const postEnabled = useMemo(() => urlHasFlag('post'), [])
  const probeEnabled = useMemo(() => urlHasFlag('probe'), [])

  useEffect(() => {
    const onWarn = (e: Event) => setWarn((e as CustomEvent).detail ?? 'post-processing disabled')
    window.addEventListener('theater-warning', onWarn)
    return () => window.removeEventListener('theater-warning', onWarn)
  }, [])

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: CAMERA.position, fov: CAMERA.fov, near: CAMERA.near, far: CAMERA.far }}
        gl={async (props) => {
          try {
            const renderer = await createRenderer(props as never)
            setBackend(isWebGPUBackend(renderer) ? 'webgpu' : 'webgl')
            return renderer
          } catch (err) {
            setFatal(err instanceof Error ? err.message : String(err))
            throw err
          }
        }}
      >
        <color attach="background" args={['#0a0708']} />
        <fogExp2 attach="fog" args={['#1c140e', 0.016]} />

        <Suspense fallback={null}>
          {probeEnabled ? <DebugProbe /> : <Theater />}
        </Suspense>

        {!probeEnabled && <Lighting />}
        {!probeEnabled && <Atmosphere />}
        <Controls />
        {!probeEnabled && postEnabled && <PostFX />}
      </Canvas>

      <Loader />
      {!fatal && <DirectorHUD />}

      {!postEnabled && !fatal && (
        <div className="warnbar" role="status">
          Safe preview: WebGL + plain render. Add <code>?probe=1</code> for the debug cube, <code>?post=1</code> for post FX, <code>?webgpu=1</code> for WebGPU.
        </div>
      )}

      {warn && (
        <div className="warnbar" onClick={() => setWarn(null)} role="button">
          Post-processing fell back to a plain render — tap to dismiss. <code>{warn}</code>
        </div>
      )}

      {fatal && (
        <div className="fatal">
          <div className="boot__title" style={{ fontSize: '1.2rem' }}>
            The house could not open
          </div>
          <p>This experience needs a WebGPU- or WebGL2-capable browser.</p>
          <code>{fatal}</code>
        </div>
      )}
    </>
  )
}
