/**
 * House character: period wall sconces marching down both side walls (original
 * fittings, now LED — they glow on the house circuit and bloom), a gilt ceiling
 * medallion where a chandelier used to hang, and one speaker mounted very
 * slightly crooked — because someone improvised, once.
 */
import { useMemo } from 'react'
import * as THREE from 'three/webgpu'
import { HOUSE, PALETTE } from '../../config/theater.config'
import { brassMaterial, emissiveMaterial, giltMaterial, blackIronMaterial, steelMaterial } from '../../materials'
import { glow } from '../../systems/lightUniforms'

function Sconce({ position, rotationY, brass, shade }: { position: [number, number, number]; rotationY: number; brass: THREE.Material; shade: THREE.Material }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh material={brass} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.14, 0.34, 0.06]} />
      </mesh>
      <mesh material={brass} position={[0, -0.08, 0.12]} rotation={[0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.24, 8]} />
      </mesh>
      {/* frosted shade — a flame-up half cup */}
      <mesh material={shade} position={[0, 0.12, 0.18]}>
        <sphereGeometry args={[0.1, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
      </mesh>
    </group>
  )
}

export function HouseDetails() {
  const mats = useMemo(
    () => ({
      brass: brassMaterial(),
      shade: emissiveMaterial(PALETTE.houseWarm, 3.2, glow.house),
      gilt: giltMaterial(),
      iron: blackIronMaterial(),
      grille: steelMaterial({ tone: '#1a1c1f', rough: 0.7 }),
      pendant: emissiveMaterial(PALETTE.houseWarm, 2.4, glow.house),
    }),
    [],
  )
  const X = HOUSE.sideWallX - 0.16
  const zs = [5.2, 8.2, 11.2, 14.2, 17.0]

  return (
    <group name="HouseDetails">
      {zs.map((z, i) => (
        <group key={i}>
          <Sconce position={[-X, 3.3, z]} rotationY={Math.PI / 2} brass={mats.brass} shade={mats.shade} />
          <Sconce position={[X, 3.3, z]} rotationY={-Math.PI / 2} brass={mats.brass} shade={mats.shade} />
        </group>
      ))}

      {/* gilt ceiling medallion + a small pendant where a chandelier hung */}
      <group position={[0, HOUSE.ceilingY - 0.06, 11]}>
        <mesh material={mats.gilt} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 0.08, 36]} />
        </mesh>
        <mesh material={mats.gilt} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
          <torusGeometry args={[0.75, 0.06, 12, 36]} />
        </mesh>
        <mesh material={mats.iron} position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.0, 8]} />
        </mesh>
        <mesh material={mats.pendant} position={[0, -1.0, 0]}>
          <sphereGeometry args={[0.14, 16, 12]} />
        </mesh>
      </group>

      {/* the slightly-crooked speaker (someone improvised, once) */}
      <group position={[X - 0.18, 5.4, 6.2]} rotation={[0.06, -Math.PI / 2, 0.13]}>
        <mesh material={mats.iron} castShadow>
          <boxGeometry args={[0.5, 0.8, 0.4]} />
        </mesh>
        <mesh material={mats.grille} position={[0, 0, 0.21]}>
          <boxGeometry args={[0.42, 0.72, 0.02]} />
        </mesh>
      </group>
    </group>
  )
}
