/**
 * The lighting rig and its three switch states (house ON / everything OFF /
 * show SPOT). One `useFrame` lerps every real light toward the active preset
 * for smooth transitions, animates the flicker, and writes the shared emissive
 * glow uniforms so bulbs, EXIT signs and neon track the same state.
 *
 * Photometric note: three's lights are physical (candela/lux). Without a live
 * viewport these magnitudes are tuned by reasoning, not by eye — they give
 * three clearly distinct moods and a sane starting point for fine-tuning.
 */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three/webgpu'
import { HOUSE, STAGE, LIGHT_PRESETS, PALETTE, type LightMode } from '../config/theater.config'
import { useTheaterStore } from '../state/useTheaterStore'
import { glow } from './lightUniforms'
import { c } from '../materials/tsl-helpers'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function Lighting() {
  const scene = useThree((s) => s.scene)

  const ambientRef = useRef<THREE.AmbientLight>(null)
  const hemiRef = useRef<THREE.HemisphereLight>(null)
  const keyRef = useRef<THREE.SpotLight>(null)
  const fillRef = useRef<THREE.DirectionalLight>(null)
  const moonRef = useRef<THREE.DirectionalLight>(null)
  const chandRefs = useRef<THREE.PointLight[]>([])
  const footRefs = useRef<THREE.PointLight[]>([])
  const exitRefs = useRef<THREE.PointLight[]>([])

  const spotTarget = useMemo(() => {
    const o = new THREE.Object3D()
    o.position.set(0, STAGE.deckY + 1.0, 0)
    return o
  }, [])

  // wire the spotlight to its target and apply soft shadow settings
  useEffect(() => {
    const k = keyRef.current
    if (k) {
      k.target = spotTarget
      k.shadow.mapSize.set(2048, 2048)
      k.shadow.bias = -0.0004
      k.shadow.normalBias = 0.02
      k.shadow.camera.near = 1
      k.shadow.camera.far = 40
    }
  }, [spotTarget])

  const flick = useRef({ value: 1, until: 0 })

  useFrame((state, dt) => {
    const t = Math.min(dt, 0.05)
    const k = 1 - Math.pow(0.0015, t) // frame-rate-independent smoothing
    const mode: LightMode = useTheaterStore.getState().lightMode
    const flickerOn = useTheaterStore.getState().flicker
    const p = LIGHT_PRESETS[mode]
    const now = state.clock.elapsedTime

    // --- flicker: brief stochastic dips when enabled --------------------
    const f = flick.current
    if (flickerOn) {
      if (now > f.until && Math.random() < 0.04) {
        f.value = 0.45 + Math.random() * 0.35
        f.until = now + 0.04 + Math.random() * 0.12
      } else if (now > f.until) {
        f.value = lerp(f.value, 1, 0.4)
      }
      // a faint mains hum on top
      const hum = 1 - 0.025 * (0.5 + 0.5 * Math.sin(now * 47.0))
      f.value = Math.min(f.value, hum)
    } else {
      f.value = lerp(f.value, 1, 0.5)
    }
    glow.flicker.value = lerp(glow.flicker.value, f.value, 0.6)

    // --- emissive glow uniforms ----------------------------------------
    glow.house.value = lerp(glow.house.value, p.houseChandeliers > 0 ? 1 : 0, k)
    glow.foot.value = lerp(glow.foot.value, p.footlights > 0 ? 1 : 0, k)
    glow.show.value = lerp(glow.show.value, p.keySpot > 0 ? 1 : 0, k)
    glow.exit.value = lerp(glow.exit.value, p.exitSigns, k)
    glow.ember.value = lerp(glow.ember.value, p.embers, k)
    glow.neon.value = lerp(glow.neon.value, mode === 'dark' ? 1.15 : 0.9, k)

    // --- real lights ----------------------------------------------------
    if (ambientRef.current) ambientRef.current.intensity = lerp(ambientRef.current.intensity, p.ambient * 1.9, k)
    if (hemiRef.current) hemiRef.current.intensity = lerp(hemiRef.current.intensity, p.ambient * 1.7, k)
    if (fillRef.current) fillRef.current.intensity = lerp(fillRef.current.intensity, p.fill * 1.1, k)
    if (moonRef.current) moonRef.current.intensity = lerp(moonRef.current.intensity, p.moonThroughGlass * 0.9, k)
    if (keyRef.current) keyRef.current.intensity = lerp(keyRef.current.intensity, p.keySpot * 20 * f.value, k)

    for (const cl of chandRefs.current) {
      if (cl) cl.intensity = lerp(cl.intensity, p.houseChandeliers * 14 * f.value, k)
    }
    for (const fl of footRefs.current) {
      if (fl) fl.intensity = lerp(fl.intensity, p.footlights * 6, k)
    }
    for (const el of exitRefs.current) {
      if (el) el.intensity = lerp(el.intensity, p.exitSigns * 1.6, k)
    }

    // atmospheric haze tracks the mode (thickest for the show beam)
    const fog = scene.fog as THREE.FogExp2 | null
    if (fog && (fog as THREE.FogExp2).isFogExp2) {
      fog.density = lerp(fog.density, p.fogDensity, k)
      fog.color.lerp(c(p.fogColor), k)
    }
  })

  const chandPositions: [number, number, number][] = [
    [0, HOUSE.ceilingY - 1.2, 8],
    [-4.5, HOUSE.ceilingY - 1.2, 13.5],
    [4.5, HOUSE.ceilingY - 1.2, 13.5],
  ]
  const footPositions: [number, number, number][] = [
    [-3, STAGE.deckY + 0.2, STAGE.frontZ - 0.3],
    [0, STAGE.deckY + 0.2, STAGE.frontZ - 0.3],
    [3, STAGE.deckY + 0.2, STAGE.frontZ - 0.3],
  ]
  const exitPositions: [number, number, number][] = [
    [-HOUSE.sideWallX + 0.5, 2.6, HOUSE.backZ - 0.6],
    [HOUSE.sideWallX - 0.5, 2.6, HOUSE.backZ - 0.6],
  ]

  return (
    <group name="Lighting">
      <ambientLight ref={ambientRef} color={c(PALETTE.houseWarm)} intensity={0} />
      <hemisphereLight ref={hemiRef} color={c(PALETTE.houseWarm)} groundColor={c('#1a1410')} intensity={0} />

      {/* The show key — soft warm spot that casts the performer's shadow */}
      <spotLight
        ref={keyRef}
        position={[3.2, STAGE.deckY + 7.5, 6.5]}
        color={c(PALETTE.keyWarm)}
        intensity={0}
        angle={0.52}
        penumbra={0.55}
        distance={44}
        decay={1.6}
        castShadow
      />
      <primitive object={spotTarget} />

      {/* Warm fill from the house — lifts the shadows, no shadow of its own */}
      <directionalLight ref={fillRef} position={[-4, 6, 9]} color={c(PALETTE.fillWarm)} intensity={0} />

      {/* Cool moonlight spilling in through the foyer storefront */}
      <directionalLight ref={moonRef} position={[2, 7, 26]} color={c(PALETTE.moonCool)} intensity={0} />

      {chandPositions.map((pos, i) => (
        <pointLight
          key={`chand-${i}`}
          ref={(el) => {
            if (el) chandRefs.current[i] = el
          }}
          position={pos}
          color={c(PALETTE.houseWarm)}
          intensity={0}
          distance={24}
          decay={2}
        />
      ))}
      {footPositions.map((pos, i) => (
        <pointLight
          key={`foot-${i}`}
          ref={(el) => {
            if (el) footRefs.current[i] = el
          }}
          position={pos}
          color={c(PALETTE.footWarm)}
          intensity={0}
          distance={7}
          decay={2}
        />
      ))}
      {exitPositions.map((pos, i) => (
        <pointLight
          key={`exit-${i}`}
          ref={(el) => {
            if (el) exitRefs.current[i] = el
          }}
          position={pos}
          color={c(PALETTE.exitGreen)}
          intensity={0}
          distance={5}
          decay={2}
        />
      ))}
    </group>
  )
}
