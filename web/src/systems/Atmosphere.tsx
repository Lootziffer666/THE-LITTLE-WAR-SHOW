/**
 * Volumetric AIR — not just light. Two parts:
 *
 *  1. Dust: thousands of tiny motes filling the whole house volume, each
 *     drifting on its own slow current (TSL `positionNode` + per-point `range`
 *     randomness, animated on the GPU). Additive, so they glint where the air
 *     is lit and vanish in shadow.
 *  2. Shafts: soft additive cones that make the show beam and the moonlight
 *     through the storefront read as solid, dusty air.
 *
 * Visibility tracks the lighting state — the air is barely there with the house
 * up, and thick and beam-cut in the dark / during the show.
 */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three/webgpu'
import {
  positionGeometry,
  positionLocal,
  time,
  range,
  sin,
  cos,
  vec3,
  clamp,
  smoothstep,
  uniform,
} from '../materials/tsl'
import { cnode } from '../materials/tsl-helpers'
import { HOUSE, STAGE, QUALITY_DEFAULTS } from '../config/theater.config'
import { useTheaterStore } from '../state/useTheaterStore'
import { Rng } from '../utils/rng'
import { WORLD_SEED } from '../config/theater.config'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function useDust() {
  return useMemo(() => {
    const count = QUALITY_DEFAULTS.dustCount
    const positions = new Float32Array(count * 3)
    const rng = new Rng(WORLD_SEED ^ 0xd057)
    const x0 = -HOUSE.halfWidth + 0.6
    const x1 = HOUSE.halfWidth - 0.6
    const y0 = 0.3
    const y1 = HOUSE.ceilingY - 0.4
    const z0 = STAGE.backZ + 0.6
    const z1 = HOUSE.backZ - 0.6
    for (let i = 0; i < count; i++) {
      // bias a third of the motes into the stage/proscenium air where beams live
      const stagey = rng.chance(0.33)
      const x = stagey ? rng.range(-STAGE.width / 2, STAGE.width / 2) : rng.range(x0, x1)
      const y = stagey ? rng.range(STAGE.deckY, STAGE.deckY + 5) : rng.range(y0, y1)
      const z = stagey ? rng.range(STAGE.backZ + 0.5, STAGE.frontZ + 2) : rng.range(z0, z1)
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 4, 8), 40)

    const opacity = uniform(0.18)
    const mat = new THREE.PointsNodeMaterial()
    const seed = range(0, 6.2832)
    const speed = range(0.25, 0.9)
    const amp = range(0.06, 0.22)
    const drift = vec3(
      sin(time.mul(speed).add(seed)),
      sin(time.mul(speed.mul(0.55)).add(seed.mul(1.7))).mul(0.6),
      cos(time.mul(speed.mul(0.8)).add(seed.mul(0.9))),
    ).mul(amp)
    mat.positionNode = positionGeometry.add(drift)
    mat.sizeNode = range(0.012, 0.05)
    mat.sizeAttenuation = true
    mat.colorNode = cnode('#d8c8a4').mul(range(0.45, 1.25))
    mat.opacityNode = opacity.mul(range(0.25, 1.0))
    mat.transparent = true
    mat.depthWrite = false
    mat.blending = THREE.AdditiveBlending
    return { geom, mat, opacity }
  }, [])
}

/** A soft, dusty volumetric cone from `from` (apex) to `to` (base). */
function Shaft({
  from,
  to,
  color,
  topRadius,
  uOpacity,
}: {
  from: [number, number, number]
  to: [number, number, number]
  color: string
  topRadius: number
  uOpacity: { value: number }
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = new THREE.Vector3().subVectors(a, b) // base→apex (so cone +y points at the light)
    const len = dir.length()
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)
    return { position: mid.toArray() as [number, number, number], quaternion: q, length: len }
  }, [from, to])

  const mat = useMemo(() => {
    const m = new THREE.MeshBasicNodeMaterial()
    m.transparent = true
    m.depthWrite = false
    m.blending = THREE.AdditiveBlending
    m.side = THREE.DoubleSide
    m.colorNode = cnode(color)
    // h: 0 at base (floor) .. 1 at apex (light). Fade both ends.
    const h = clamp(positionLocal.y.div(length).add(0.5), 0, 1)
    const fade = smoothstep(0, 0.25, h).mul(smoothstep(1, 0.6, h))
    m.opacityNode = fade.mul(uOpacity).mul(0.5)
    return m
  }, [color, length, uOpacity])

  return (
    <mesh position={position} quaternion={quaternion} material={mat} renderOrder={3} frustumCulled={false}>
      <coneGeometry args={[topRadius, length, 28, 1, true]} />
    </mesh>
  )
}

export function Atmosphere() {
  const { geom, mat, opacity } = useDust()
  const showOp = useRef({ value: 0 })
  const moonOp = useRef({ value: 0 })

  useFrame(() => {
    const mode = useTheaterStore.getState().lightMode
    const dustTarget = mode === 'house' ? 0.14 : mode === 'show' ? 0.5 : 0.4
    opacity.value = lerp(opacity.value, dustTarget, 0.05)
    showOp.current.value = lerp(showOp.current.value, mode === 'show' ? 0.5 : 0.0, 0.05)
    moonOp.current.value = lerp(moonOp.current.value, mode === 'dark' ? 0.45 : mode === 'house' ? 0.1 : 0.2, 0.05)
  })

  return (
    <group name="Atmosphere">
      <points geometry={geom} material={mat} frustumCulled={false} renderOrder={2} />
      {/* show key beam */}
      <Shaft
        from={[3.2, STAGE.deckY + 7.5, 6.5]}
        to={[0, STAGE.deckY, 0]}
        color="#ffe6c2"
        topRadius={1.7}
        uOpacity={showOp.current}
      />
      {/* moonlight spilling from the storefront, raked across the house */}
      <Shaft
        from={[2, HOUSE.ceilingY, HOUSE.backZ + 6]}
        to={[-2, 0, HOUSE.frontZ + 4]}
        color="#bcd0ff"
        topRadius={2.6}
        uOpacity={moonOp.current}
      />
    </group>
  )
}
