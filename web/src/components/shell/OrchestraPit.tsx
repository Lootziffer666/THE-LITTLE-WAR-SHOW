/**
 * The covered orchestra pit at the foot of the stage — rarely used now. Most of
 * it is decked over with plates flush to the house floor; one plate sits proud,
 * lifted on its ring, revealing the recess below with a forgotten music stand
 * and a coil of cable. "DO NOT — PIT LIP" lives on the deck above (Storytelling).
 */
import { useMemo } from 'react'
import { STAGE } from '../../config/theater.config'
import { concreteMaterial, darkWoodMaterial, steelMaterial, brassMaterial, blackIronMaterial } from '../../materials'
import { Box } from './../primitives'

export function OrchestraPit() {
  const mats = useMemo(
    () => ({
      pit: concreteMaterial({ color: '#3e3a34' }),
      plate: darkWoodMaterial({ tone: '#1c1814', planks: false }),
      steel: steelMaterial({ tone: '#2a2d31', rough: 0.5 }),
      brass: brassMaterial(),
      iron: blackIronMaterial(),
    }),
    [],
  )
  const W = 7
  const zC = (STAGE.frontZ + 0.2 + 4.7) / 2 // between apron and the first row
  const zFront = STAGE.frontZ + 0.2
  const zBack = 4.8
  const depth = zBack - zFront

  const plateW = 1.36
  const plates = [-2.8, -1.4, 0, 1.4, 2.8]

  return (
    <group name="OrchestraPit">
      {/* recess */}
      <Box args={[W, 0.08, depth]} position={[0, -1.15, zC]} material={mats.pit} castShadow={false} />
      <Box args={[W, 1.15, 0.08]} position={[0, -0.57, zFront]} material={mats.pit} castShadow={false} />
      <Box args={[W, 1.15, 0.08]} position={[0, -0.57, zBack]} material={mats.pit} castShadow={false} />
      {[-1, 1].map((s) => (
        <Box key={s} args={[0.08, 1.15, depth]} position={[(s * W) / 2, -0.57, zC]} material={mats.pit} castShadow={false} />
      ))}

      {/* cover plates — flush, except the second one which sits proud */}
      {plates.map((x, i) =>
        i === 1 ? (
          <group key={i} position={[x, 0.0, zBack]} rotation={[-0.42, 0, 0]}>
            <mesh material={mats.plate} position={[0, 0.03, -depth / 2]} castShadow receiveShadow>
              <boxGeometry args={[plateW, 0.06, depth]} />
            </mesh>
            <mesh material={mats.brass} position={[0, 0.07, -depth / 2]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.08, 0.012, 8, 18]} />
            </mesh>
          </group>
        ) : (
          <Box key={i} args={[plateW, 0.06, depth]} position={[x, 0.0, zC]} material={mats.plate} receiveShadow />
        ),
      )}

      {/* inside: a forgotten music stand + a cable coil under the open plate */}
      <group position={[plates[1], -0.55, zC]}>
        <mesh material={mats.iron} position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.02, 0.7, 8]} />
        </mesh>
        <mesh material={mats.iron} position={[0, 0.7, 0.05]} rotation={[0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.34, 0.24, 0.02]} />
        </mesh>
        <mesh material={mats.steel} position={[0.25, 0.04, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.03, 8, 20]} />
        </mesh>
      </group>
    </group>
  )
}
