/**
 * The auditorium seating: raked rows of velour fold-down seats in two blocks
 * on cast-iron art-deco standards. Two upholstery variants (the original
 * crimson and a darker, later-replaced bordeaux, scattered so it reads as
 * "patched over the years"), most seats folded up, a deterministic few stuck
 * half-up or down — and one seat (our C14) permanently taped out of service.
 * Instanced for performance; seat bottoms pivot at the hinge.
 */
import { useMemo } from 'react'
import * as THREE from 'three/webgpu'
import { SEATING, HOUSE, PALETTE, WORLD_SEED } from '../../config/theater.config'
import { velourMaterial, blackIronMaterial, darkWoodMaterial } from '../../materials'
import { c } from '../../materials/tsl-helpers'
import { Rng } from '../../utils/rng'

interface Seat {
  x: number
  y: number
  z: number
  fold: number // 1 = up against the back, 0 = down
  variant: 0 | 1
  taped: boolean
}

function build() {
  const rng = new Rng(WORLD_SEED ^ 0x5ea7)
  const riser = 0.16
  const aisleHalf = HOUSE.aisleWidth / 2
  const seats: Seat[] = []
  const standards: { x: number; y: number; z: number }[] = []
  // C14: row C (index 2), a fixed seat — permanently out of service
  const tapedRow = 2
  const tapedX = -(aisleHalf + 0.35 + 3 * SEATING.seatPitch)

  for (let r = 0; r < SEATING.rows; r++) {
    const z = SEATING.firstRowZ + r * SEATING.rowSpacing
    const y = r * riser
    for (const side of [-1, 1] as const) {
      for (let i = 0; i < SEATING.seatsPerBlock; i++) {
        const x = side * (aisleHalf + 0.35 + i * SEATING.seatPitch)
        const taped = r === tapedRow && Math.abs(x - tapedX) < 1e-3
        let fold: number
        if (taped) fold = 1
        else if (rng.chance(0.16)) fold = rng.range(0.42, 0.92)
        else fold = rng.chance(0.12) ? 0.0 : 1.0
        const variant: 0 | 1 = rng.chance(0.26) ? 1 : 0
        seats.push({ x, y, z, fold, variant, taped })
      }
      for (let i = 0; i <= SEATING.seatsPerBlock; i++) {
        standards.push({ x: side * (aisleHalf + i * SEATING.seatPitch), y, z })
      }
    }
  }

  const dummy = new THREE.Object3D()
  const velA = velourMaterial({ color: PALETTE.velourSeat, worn: 0.55 })
  const velB = velourMaterial({ color: '#52131a', worn: 0.75 })
  const iron = blackIronMaterial()
  const wood = darkWoodMaterial({ tone: PALETTE.woodTrim })

  const backGeo = new THREE.BoxGeometry(0.52, 0.64, 0.09)
  const botGeo = new THREE.BoxGeometry(0.48, 0.085, 0.46)
  botGeo.translate(0, 0, -0.23)

  const inst = (geo: THREE.BufferGeometry, mat: THREE.Material, list: Seat[], kind: 'back' | 'bottom') => {
    const im = new THREE.InstancedMesh(geo, mat, list.length)
    list.forEach((s, i) => {
      if (kind === 'back') {
        dummy.rotation.set(0, 0, 0)
        dummy.position.set(s.x, s.y + 0.75, s.z + 0.27)
      } else {
        dummy.position.set(s.x, s.y + 0.44, s.z + 0.2)
        dummy.rotation.set(s.fold * 1.46, 0, 0)
      }
      dummy.updateMatrix()
      im.setMatrixAt(i, dummy.matrix)
    })
    im.castShadow = im.receiveShadow = true
    im.frustumCulled = false
    im.instanceMatrix.needsUpdate = true
    return im
  }

  const A = seats.filter((s) => s.variant === 0)
  const B = seats.filter((s) => s.variant === 1)

  // standards + arm caps
  const standGeo = new THREE.BoxGeometry(0.06, 0.72, 0.54)
  const stands = new THREE.InstancedMesh(standGeo, iron, standards.length)
  const armGeo = new THREE.BoxGeometry(0.09, 0.05, 0.56)
  const arms = new THREE.InstancedMesh(armGeo, wood, standards.length)
  standards.forEach((p, idx) => {
    dummy.rotation.set(0, 0, 0)
    dummy.position.set(p.x, p.y + 0.36, p.z + 0.06)
    dummy.updateMatrix()
    stands.setMatrixAt(idx, dummy.matrix)
    dummy.position.set(p.x, p.y + 0.74, p.z - 0.02)
    dummy.updateMatrix()
    arms.setMatrixAt(idx, dummy.matrix)
  })
  for (const m of [stands, arms]) {
    m.castShadow = m.receiveShadow = true
    m.frustumCulled = false
    m.instanceMatrix.needsUpdate = true
  }

  const taped = seats.find((s) => s.taped)!
  return {
    backsA: inst(backGeo, velA, A, 'back'),
    bottomsA: inst(botGeo, velA, A, 'bottom'),
    backsB: inst(backGeo, velB, B, 'back'),
    bottomsB: inst(botGeo, velB, B, 'bottom'),
    stands,
    arms,
    taped,
  }
}

export function Seating() {
  const s = useMemo(build, [])
  const tapeMat = useMemo(() => {
    const m = new THREE.MeshStandardNodeMaterial()
    m.color = c('#e0c93a')
    m.roughness = 0.7 as unknown as number
    return m
  }, [])
  return (
    <group name="Seating">
      <primitive object={s.stands} />
      <primitive object={s.arms} />
      <primitive object={s.backsA} />
      <primitive object={s.bottomsA} />
      <primitive object={s.backsB} />
      <primitive object={s.bottomsB} />
      {/* the taped-out seat (C14): a gaffer X across the folded-up bottom */}
      <group position={[s.taped.x, s.taped.y + 0.62, s.taped.z + 0.16]}>
        <mesh material={tapeMat} rotation={[0, 0, 0.7]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.02]} />
        </mesh>
        <mesh material={tapeMat} rotation={[0, 0, -0.7]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.02]} />
        </mesh>
      </group>
    </group>
  )
}
