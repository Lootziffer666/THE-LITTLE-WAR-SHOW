/**
 * The crossover — the narrow, dark passage directly behind the cyclorama that
 * lets actors cross from stage-left to stage-right unseen. Low header, cable
 * runs, conduit, a tired green work-light, a coil of rope and the handwritten
 * warnings that keep everyone from braining themselves in the blackout.
 */
import { useMemo } from 'react'
import { STAGE } from '../../config/theater.config'
import { concreteMaterial, steelMaterial, blackIronMaterial, emissiveMaterial, paintedFlatMaterial } from '../../materials'
import { enamelSign } from '../../textures/signage'
import { Box } from './../primitives'

export function Crossover() {
  const mats = useMemo(
    () => ({
      header: concreteMaterial({ color: '#43403a' }),
      cable: blackIronMaterial(),
      pipe: steelMaterial({ tone: '#3a3d40', rough: 0.6 }),
      work: emissiveMaterial('#9bffb0', 1.6),
      sign: paintedFlatMaterial(enamelSign('CROSSOVER', { sub: 'QUIET', bg: '#10100c', ink: '#9bffb0' }), { rough: 0.9 }),
    }),
    [],
  )
  const FY = STAGE.deckY
  const z = STAGE.backZ - 0.55
  const W = STAGE.width + 3

  return (
    <group name="Crossover">
      {/* low header makes the passage feel tight */}
      <Box args={[W, 0.4, 0.5]} position={[0, FY + 2.3, z]} material={mats.header} castShadow={false} />

      {/* cable runs + conduit along the back of the cyclorama */}
      {[0.6, 1.0, 1.5].map((dy, i) => (
        <Box key={i} args={[W - 1, 0.05, 0.05]} position={[0, FY + dy, z + 0.18]} material={mats.cable} castShadow={false} />
      ))}
      {[-3, 3].map((x) => (
        <mesh key={x} material={mats.pipe} position={[x, FY + 1.9, z + 0.12]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 4, 10]} />
        </mesh>
      ))}

      {/* the green work light */}
      <mesh material={mats.work} position={[0, FY + 2.0, z + 0.25]}>
        <sphereGeometry args={[0.06, 10, 8]} />
      </mesh>
      <pointLight color="#7bffb0" intensity={1.6} distance={5} decay={2} position={[0, FY + 1.9, z + 0.4]} />

      {/* a coil of rope on the floor */}
      <mesh material={mats.cable} position={[-3.4, FY + 0.06, z + 0.3]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.16, 0.04, 8, 22]} />
      </mesh>

      {/* the warning */}
      <mesh material={mats.sign} position={[2.6, FY + 1.7, z + 0.22]}>
        <planeGeometry args={[0.9, 0.34]} />
      </mesh>
    </group>
  )
}
