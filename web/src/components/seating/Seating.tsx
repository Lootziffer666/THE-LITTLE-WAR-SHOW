/**
 * The auditorium seating: raked rows of velour fold-down seats in two blocks
 * split by a centre aisle, on cast-iron art-deco standards. Most seats are
 * folded up (an empty house); some are deterministically stuck half-up or left
 * down — the worn detail the brief asks for. Built as instanced meshes (a few
 * draw calls for ~100 seats), seat bottoms pivoting at their hinge.
 */
import { useMemo } from 'react'
import * as THREE from 'three/webgpu'
import { SEATING, HOUSE, PALETTE, WORLD_SEED } from '../../config/theater.config'
import { velourMaterial, blackIronMaterial, darkWoodMaterial } from '../../materials'
import { Rng } from '../../utils/rng'

interface Seat {
  x: number
  y: number
  z: number
  fold: number // 1 = up against the back, 0 = down (occupied position)
}

function build() {
  const rng = new Rng(WORLD_SEED ^ 0x5ea7)
  const riser = 0.16
  const aisleHalf = HOUSE.aisleWidth / 2
  const seats: Seat[] = []
  const standards: { x: number; y: number; z: number }[] = []

  for (let r = 0; r < SEATING.rows; r++) {
    const z = SEATING.firstRowZ + r * SEATING.rowSpacing
    const y = r * riser
    for (const side of [-1, 1] as const) {
      for (let i = 0; i < SEATING.seatsPerBlock; i++) {
        const x = side * (aisleHalf + 0.35 + i * SEATING.seatPitch)
        let fold: number
        if (rng.chance(0.16)) fold = rng.range(0.42, 0.92) // stuck half-up
        else fold = rng.chance(0.12) ? 0.0 : 1.0 // a few left down
        seats.push({ x, y, z, fold })
      }
      for (let i = 0; i <= SEATING.seatsPerBlock; i++) {
        standards.push({ x: side * (aisleHalf + i * SEATING.seatPitch), y, z })
      }
    }
  }

  const dummy = new THREE.Object3D()
  const velour = velourMaterial({ color: PALETTE.velourSeat, worn: 0.55 })
  const iron = blackIronMaterial()
  const wood = darkWoodMaterial({ tone: PALETTE.woodTrim })

  // seat backs
  const backGeo = new THREE.BoxGeometry(0.52, 0.64, 0.09)
  const backs = new THREE.InstancedMesh(backGeo, velour, seats.length)
  // seat bottoms — geometry pushed forward so the instance origin is the hinge
  const botGeo = new THREE.BoxGeometry(0.48, 0.085, 0.46)
  botGeo.translate(0, 0, -0.23)
  const bottoms = new THREE.InstancedMesh(botGeo, velour, seats.length)

  seats.forEach((s, idx) => {
    dummy.rotation.set(0, 0, 0)
    dummy.position.set(s.x, s.y + 0.75, s.z + 0.27)
    dummy.updateMatrix()
    backs.setMatrixAt(idx, dummy.matrix)

    dummy.position.set(s.x, s.y + 0.44, s.z + 0.2)
    dummy.rotation.set(s.fold * 1.46, 0, 0)
    dummy.updateMatrix()
    bottoms.setMatrixAt(idx, dummy.matrix)
  })

  // cast-iron standards + wooden arm caps
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

  for (const m of [backs, bottoms, stands, arms]) {
    m.castShadow = true
    m.receiveShadow = true
    m.frustumCulled = false
    m.instanceMatrix.needsUpdate = true
  }
  return { backs, bottoms, stands, arms }
}

export function Seating() {
  const { backs, bottoms, stands, arms } = useMemo(build, [])
  return (
    <group name="Seating">
      <primitive object={stands} />
      <primitive object={arms} />
      <primitive object={backs} />
      <primitive object={bottoms} />
    </group>
  )
}
