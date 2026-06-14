/**
 * The cinematic pipeline (TSL RenderPipeline / PostProcessing).
 *
 * We take over R3F's render loop (a `useFrame` at priority 1 makes us the sole
 * renderer) and drive the scene through:
 *   scene → tilt-shift DoF → bloom → chromatic aberration → warm grade →
 *   vignette → film grain → (ACES tone-map + sRGB, applied on output).
 *
 * Bloom strength/threshold and exposure ease toward the active LightMode, so
 * the dark house glows and the show beam blooms harder than the work lights.
 */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three/webgpu'
import { bloom } from 'three/addons/tsl/display/BloomNode.js'
import { film } from 'three/addons/tsl/display/FilmNode.js'
import { pass, uniform, float, vec3, screenUV, dot, mix, clamp } from '../materials/tsl'
import { LIGHT_PRESETS } from '../config/theater.config'
import { useTheaterStore } from '../state/useTheaterStore'

export function PostFX() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const firedReady = useRef(false)

  const u = useMemo(
    () => ({
      grain: uniform(0.22),
      vignette: uniform(1.15),
      sat: uniform(1.22),
    }),
    [],
  )

  const built = useMemo(() => {
    if (!gl) return null
    const post = new THREE.PostProcessing(gl as unknown as THREE.WebGPURenderer)

    const scenePass = pass(scene, camera)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const color: any = scenePass.getTextureNode()

    // bloom contributes additively; keep the node so we can animate it.
    // (The depth-based DoF and chromatic aberration are intentionally omitted
    // for backend robustness — this subset is the dependable cinematic core.)
    const b = bloom(color, 0.7, 0.85, 0.85)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let outp: any = color.add(b)

    // warm grade + gentle saturation lift
    const lum = dot(outp, vec3(0.2126, 0.7152, 0.0722))
    outp = mix(vec3(lum), outp, u.sat)
    outp = outp.mul(vec3(1.05, 1.0, 0.92))

    // soft vignette
    const d = screenUV.sub(0.5)
    const vig = clamp(float(1).sub(d.dot(d).mul(u.vignette)), 0, 1).pow(1.15)
    outp = outp.mul(vig)

    // film grain last (pre tone-map)
    outp = film(outp, u.grain)

    post.outputNode = outp
    return { post, bloomNode: b }
  }, [gl, scene, camera, u])

  useEffect(() => {
    if (built && size) (built.post as unknown as { setSize?: (w: number, h: number) => void }).setSize?.(size.width, size.height)
  }, [built, size])

  // We own the render loop (priority 1). WebGPU rendering is ASYNCHRONOUS, so we
  // drive renderAsync() and route any async rejection to the warning banner.
  // On failure — or when post is toggled off (key P) — we fall back to a plain
  // scene render so the canvas is never silently black. A live #diag readout
  // reports backend / frame / mode / last error so issues are visible.
  const failed = useRef(false)
  const frame = useRef(0)
  const lastErr = useRef<string | null>(null)

  const onErr = (e: unknown) => {
    const msg = e instanceof Error ? e.message : String(e)
    lastErr.current = msg
    if (!failed.current) {
      failed.current = true
      window.dispatchEvent(new CustomEvent('theater-warning', { detail: msg }))
    }
  }

  useFrame(() => {
    frame.current++
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = gl as any
    const st = useTheaterStore.getState()

    const present = (): unknown => {
      if (!built || failed.current || !st.usePost) {
        return r.renderAsync ? r.renderAsync(scene, camera) : r.render(scene, camera)
      }
      const pr = LIGHT_PRESETS[st.lightMode]
      const b = built.bloomNode
      b.strength.value += (pr.bloomStrength - b.strength.value) * 0.06
      b.threshold.value += (pr.bloomThreshold - b.threshold.value) * 0.06
      if (typeof r.toneMappingExposure === 'number') r.toneMappingExposure += (pr.exposure * 1.05 - r.toneMappingExposure) * 0.06
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = built.post as any
      return p.renderAsync ? p.renderAsync() : p.render()
    }

    try {
      const ret = present()
      if (ret && typeof (ret as { then?: unknown }).then === 'function') {
        ;(ret as Promise<unknown>).catch(onErr)
      }
    } catch (e) {
      onErr(e)
      try {
        if (r.renderAsync) r.renderAsync(scene, camera)
        else r.render(scene, camera)
      } catch {
        /* */
      }
    }

    if (frame.current === 1) window.dispatchEvent(new CustomEvent('theater-ready'))
    if (frame.current % 15 === 0) {
      const el = document.getElementById('diag')
      if (el) {
        const be = r?.backend?.isWebGPUBackend ? 'WebGPU' : r?.backend ? 'WebGL2' : '—'
        const mode = !built || failed.current ? 'plain' : !st.usePost ? 'plain(off)' : 'post'
        el.textContent = `${be} · f${frame.current} · ${mode}${lastErr.current ? ' · ERR ' + lastErr.current : ''}`
      }
    }
  }, 1)

  return null
}
