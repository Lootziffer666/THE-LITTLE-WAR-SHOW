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
import { dof } from 'three/addons/tsl/display/DepthOfFieldNode.js'
import { film } from 'three/addons/tsl/display/FilmNode.js'
import { chromaticAberration } from 'three/addons/tsl/display/ChromaticAberrationNode.js'
import { pass, uniform, float, vec3, screenUV, dot, mix, clamp } from '../materials/tsl'
import { CAMERA, LIGHT_PRESETS } from '../config/theater.config'
import { useTheaterStore } from '../state/useTheaterStore'

export function PostFX() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const firedReady = useRef(false)

  const u = useMemo(
    () => ({
      grain: uniform(0.26),
      ca: uniform(0.0016),
      vignette: uniform(1.15),
      sat: uniform(1.12),
    }),
    [],
  )

  const built = useMemo(() => {
    if (!gl) return null
    const post = new THREE.PostProcessing(gl as unknown as THREE.WebGPURenderer)

    const scenePass = pass(scene, camera)
    const color = scenePass.getTextureNode()
    const viewZ = scenePass.getViewZNode()

    // diorama tilt-shift: a narrow sharp band on the stage, soft fore/back.
    // Post nodes are dynamic graphs — `any` past here (TSL's published types
    // don't expose the chainable math on the concrete node subclasses).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dofd: any = dof(color, viewZ, float(CAMERA.dofFocus), float(CAMERA.dofRange), float(CAMERA.dofStrength))

    // bloom contributes additively; keep the node so we can animate it
    const b = bloom(dofd, 0.7, 0.85, 0.85)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let outp: any = dofd.add(b)

    // edge-weighted chromatic aberration
    outp = chromaticAberration(outp, u.ca)

    // warm grade + gentle saturation lift
    const lum = dot(outp, vec3(0.2126, 0.7152, 0.0722))
    outp = mix(vec3(lum), outp, u.sat)
    outp = outp.mul(vec3(1.025, 1.0, 0.965))

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

  // We own the render loop (priority 1). It is fail-safe: if the TSL pipeline
  // ever throws (e.g. a WGSL compile edge case), we fall back to a plain render
  // so the scene still shows, and surface the message once instead of a black
  // screen — invaluable while iterating without a live viewport.
  const failed = useRef(false)
  useFrame(() => {
    const markReady = () => {
      if (!firedReady.current) {
        firedReady.current = true
        window.dispatchEvent(new CustomEvent('theater-ready'))
      }
    }
    const renderPlain = () => {
      try {
        ;(gl as unknown as { render: (s: unknown, c: unknown) => void }).render(scene, camera)
      } catch {
        /* nothing more we can do */
      }
    }

    if (!built || failed.current) {
      renderPlain()
      markReady()
      return
    }

    try {
      const pr = LIGHT_PRESETS[useTheaterStore.getState().lightMode]
      const b = built.bloomNode
      b.strength.value += (pr.bloomStrength - b.strength.value) * 0.06
      b.threshold.value += (pr.bloomThreshold - b.threshold.value) * 0.06
      const r = gl as unknown as { toneMappingExposure: number }
      if (r) r.toneMappingExposure += (pr.exposure * 1.05 - r.toneMappingExposure) * 0.06
      built.post.render()
    } catch (e) {
      failed.current = true
      window.dispatchEvent(
        new CustomEvent('theater-warning', { detail: e instanceof Error ? e.message : String(e) }),
      )
      renderPlain()
    }
    markReady()
  }, 1)

  return null
}
