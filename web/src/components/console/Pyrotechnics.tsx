/**
 * Stage pyrotechnics — clearly theatrical spark fountains (gold→red), one per
 * footlight emitter, fired from the tech console / Space bar. Each burst is a
 * GPU-driven Points system: per-spark velocity drives a ballistic path from a
 * trigger time, with an additive flash point-light. No smoke of war here — this
 * is gunpowder-and-applause showbiz.
 */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three/webgpu'
import { positionGeometry, attribute, uniform, vec3, mix, clamp, float } from '../../materials/tsl'
import { cnode } from '../../materials/tsl-helpers'
import { PYRO_EMITTERS } from '../../config/theater.config'
import { useTheaterStore } from '../../state/useTheaterStore'
import { Rng } from '../../utils/rng'

const LIFE = 1.35

function buildBurst(seed: number) {
  const N = 150
  const rng = new Rng(seed)
  const position = new Float32Array(N * 3)
  const vel = new Float32Array(N * 3)
  const sd = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    const ang = rng.range(0, Math.PI * 2)
    const spread = rng.range(0.2, 1.0)
    const sp = rng.range(2.0, 5.0)
    const up = rng.range(3.5, 7.5)
    vel[i * 3] = Math.cos(ang) * sp * spread
    vel[i * 3 + 1] = up
    vel[i * 3 + 2] = Math.sin(ang) * sp * spread
    sd[i] = rng.float()
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geo.setAttribute('aVel', new THREE.BufferAttribute(vel, 3))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(sd, 1))
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 2, 0), 10)

  const uStart = uniform(-100)
  const uNow = uniform(0)
  const age = uNow.sub(uStart).max(0)
  const av = attribute('aVel', 'vec3')
  const seedN = attribute('aSeed', 'float')
  const grav = vec3(0, -5.2, 0).mul(age.mul(age))
  const lifeT = clamp(age.div(LIFE), 0, 1)
  const alive = clamp(float(1).sub(lifeT), 0, 1)
  const twinkle = seedN.mul(40).add(uNow.mul(30)).sin().mul(0.3).add(0.7)

  const mat = new THREE.PointsNodeMaterial()
  mat.positionNode = positionGeometry.add(av.mul(age)).add(grav)
  mat.colorNode = mix(cnode('#fff0b0'), cnode('#ff4d18'), lifeT).mul(3.0)
  mat.opacityNode = alive.mul(twinkle)
  mat.sizeNode = alive.mul(0.07).add(0.012)
  mat.sizeAttenuation = true
  mat.transparent = true
  mat.depthWrite = false
  mat.blending = THREE.AdditiveBlending
  mat.toneMapped = false
  return { geo, mat, uStart, uNow }
}

function Emitter({ id, pos }: { id: string; pos: [number, number, number] }) {
  const { geo, mat, uStart, uNow } = useMemo(() => buildBurst(0x9e37 ^ pos[0] * 131), [pos])
  const light = useRef<THREE.PointLight>(null)
  const lastSeq = useRef(0)
  const flashAt = useRef(-100)

  useFrame((state) => {
    const now = state.clock.elapsedTime
    uNow.value = now
    const st = useTheaterStore.getState()
    if (st.pyroSeq !== lastSeq.current) {
      lastSeq.current = st.pyroSeq
      if (st.pyroEmitter === id || st.pyroEmitter == null) {
        uStart.value = now
        flashAt.current = now
      }
    }
    if (light.current) {
      const a = now - flashAt.current
      light.current.intensity = a >= 0 && a < 0.4 ? (1 - a / 0.4) * 80 : 0
    }
  })

  return (
    <group position={pos}>
      <points geometry={geo} material={mat} frustumCulled={false} renderOrder={5} />
      <pointLight ref={light} color="#ffb366" intensity={0} distance={9} decay={2} position={[0, 0.5, 0]} />
    </group>
  )
}

export function Pyrotechnics() {
  return (
    <group name="Pyrotechnics">
      {PYRO_EMITTERS.map((e) => (
        <Emitter key={e.id} id={e.id} pos={e.pos} />
      ))}
    </group>
  )
}
